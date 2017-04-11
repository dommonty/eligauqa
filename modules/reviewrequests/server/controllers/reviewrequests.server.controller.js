'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reviewrequest = mongoose.model('Reviewrequest'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  User = require('mongoose').model('User'),
  async = require('async');


/**
 * Create a Reviewrequest
 */
exports.create = function (req, res) {
  var reviewrequest = new Reviewrequest(req.body);
  reviewrequest.user = req.user;

  reviewrequest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reviewrequest);
    }
  });
};

/**
 * Show the current Reviewrequest
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var reviewrequest = req.reviewrequest ? req.reviewrequest.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  reviewrequest.isCurrentUserOwner = req.user && reviewrequest.user && reviewrequest.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(reviewrequest);
};

/**
 * Update a Reviewrequest
 */
exports.update = function (req, res) {
  var reviewrequest = req.reviewrequest;
  reviewrequest = _.extend(reviewrequest, req.body);


  reviewrequest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reviewrequest);
      if (reviewrequest.status === 'submitted') {
        sendEmailForReview(req, res, reviewrequest._id,
          reviewrequest.reviewer.systemUser,
          reviewrequest.performanceReviewId,
          reviewrequest.dueBy.toString());
        sendEmailForReview(req, res, reviewrequest._id,
          reviewrequest.reviewee.systemUser,
          reviewrequest.performanceReviewId,
          reviewrequest.dueBy.toString());
      }
      if (reviewrequest.status === 'reviewee-completed')
        notifyReviewerByEmail(req, res, reviewrequest._id,
          reviewrequest.reviewer.systemUser,
          reviewrequest.performanceReviewId,
          reviewrequest.reviewee.name);
    }
  });
};

/**
 * Delete an Reviewrequest
 */
exports.delete = function (req, res) {
  var reviewrequest = req.reviewrequest;

  reviewrequest.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reviewrequest);
    }
  });
};

/**
 * List of Reviewrequests
 */
exports.list = function (req, res) {
  var query;

  if (req.query.revieweeId)
    query = {
      reviewee: req.query.revieweeId
    };
  if (req.query.businessPeriodId) {
    if (query)
      query.businessPeriod = req.query.businessPeriodId;
    else
      query = {
        businessPeriod: req.query.businessPeriodId
      };
  }
  Reviewrequest.find(query).sort('-created').populate([ 'user', 'reviewer', 'reviewee', 'outcomeSquad', 'businessPeriod' ]).exec(function (err, reviewrequests) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reviewrequests);
    }
  });
};

/**
 * Reviewrequest middleware
 */
exports.reviewrequestByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Reviewrequest is invalid'
    });
  }

  Reviewrequest.findById(id).populate([ 'user', 'reviewer', 'reviewee', 'outcomeSquad', 'businessPeriod' ]).exec(function (err, reviewrequest) {
    if (err) {
      return next(err);
    } else if (!reviewrequest) {
      return res.status(404).send({
        message: 'No Reviewrequest with that identifier has been found'
      });
    }
    req.reviewrequest = reviewrequest;
    next();
  });
};

/*
 * send an email to the assignee of the action
 */
function sendEmailForReview(req, res, reviewRequestId, assigneeId, reviewId, dueBy) {
  var smtpTransport = nodemailer.createTransport(config.mailer.options);
  console.log('Email sent to reviewer or reviewee');

  async.waterfall([
    function (done) {
      User.findById(assigneeId).exec(function (err, assignee) {
        done(err, assignee);
      });
    },
    function (assignee, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render('modules/reviewrequests/server/templates/send-review-email',
        {
          name: assignee.displayName,
          url: httpTransport + req.headers.host + '/performancereviews',
          appName: config.app.title,
          dueBy: dueBy
        },
        function (err, emailHTML) {
          //console.log(emailHTML);
          done(err, emailHTML, assignee);
        }
      );
    },
    // If valid email, send reset email using service
    function (emailHTML, assignee, done) {
      var mailOptions = {
        to: assignee.email,
        from: config.mailer.from,
        subject: 'Feedback review',
        html: emailHTML
      };
      console.log(emailHTML);
      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
  });

}

/*
 * send an email to the reviewer when the review is completed by the reviewee
 */
function notifyReviewerByEmail(req, res, reviewRequestId, reviewerId, reviewId, revieweeName) {
  var smtpTransport = nodemailer.createTransport(config.mailer.options);

  async.waterfall([
    function (done) {
      User.findById(reviewerId).exec(function (err, reviewer) {
        done(err, reviewer);
      });
    },
    function (reviewer, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render('modules/reviewrequests/server/templates/notify-reviewer-email',
        {
          name: reviewer.displayName,
          url: httpTransport + req.headers.host + '/performancereviews',
          appName: config.app.title,
          reviewee: revieweeName
        },
        function (err, emailHTML) {
          //console.log(emailHTML);
          done(err, emailHTML, reviewer);
        }
      );
    },
    // If valid email, send reset email using service
    function (emailHTML, reviewer, done) {
      var mailOptions = {
        to: reviewer.email,
        from: config.mailer.from,
        subject: 'Feedback review completed',
        html: emailHTML
      };
      console.log(emailHTML);
      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      console.log(err);
    }
  });

}
