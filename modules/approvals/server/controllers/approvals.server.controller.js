'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Approval = mongoose.model('Approval'),
  Quote = mongoose.model('Quote'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  _ = require('lodash');


/**
 * Create a Approval
 */
exports.create = function (req, res) {
  var approval = new Approval(req.body);
  approval.user = req.user;

  approval.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      Quote.findById(approval.quote).exec(function (err, quote) {
        quote.status = approval.status;
        quote.save(function (err) {
          if (err)
            console.log('could not update quote when saving approval');
        });
      });
      approval.deepPopulate('approver.systemUser', function (err, _approval) {
        sendEmailForApproval(req, res, _approval);
      });
      res.jsonp(approval);
    }
  });
};

/**
 * Show the current Approval
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var approval = req.approval ? req.approval.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  approval.isCurrentUserOwner = req.user && approval.user && approval.user._id.toString() === req.user._id.toString() ? true : false;
  res.jsonp(approval);

};

/**
 * Update a Approval
 */
exports.update = function (req, res) {
  var approval = req.approval;

  approval = _.extend(approval, req.body);

  approval.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Quote.findById(approval.quote).exec(function (err, quote) {
        quote.status = approval.status;
        quote.save(function (err) {
          if (err)
            console.log('could not update quote when saving approval');
        });
      });
      approval.deepPopulate('approver.systemUser', function (err, _approval) {
        sendEmailForApproval(req, res, _approval);
      });
      res.jsonp(approval);
    }
  });
};

/**
 * Delete an Approval
 */
exports.delete = function (req, res) {
  var approval = req.approval;

  approval.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(approval);
    }
  });
};

/**
 * List of Approvals
 */
exports.list = function (req, res) {
  Approval.find({quote: req.query.quoteId}).sort('-created').populate([ 'user', 'approver' ]).exec(function (err, approvals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(approvals);
    }
  });
};

/**
 * Approval middleware
 */
exports.approvalByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Approval is invalid'
    });
  }

  Approval.findById(id).populate([ 'user', 'displayName', 'approver' ]).exec(function (err, approval) {
    if (err) {
      return next(err);
    } else if (!approval) {
      return res.status(404).send({
        message: 'No Approval with that identifier has been found'
      });
    }
    req.approval = approval;
    next();
  });
};

/*
 * send an email to the assignee of the action
 */
function sendEmailForApproval(req, res, approval) {
  var smtpTransport = nodemailer.createTransport(config.mailer.options);

  async.waterfall([
    function (done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render('modules/approvals/server/templates/send-approval-email', {
        name: approval.approver.name,
        url: httpTransport + req.headers.host + '/approvals/' + approval._id + '?quoteId=' + approval.quote,
        appName: config.app.title,
      }, function (err, emailHTML) {
        //console.log(emailHTML);
        done(err, emailHTML);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, done) {
      var mailOptions = {
        to: approval.approver.systemUser.email,
        from: config.mailer.from,
        subject: 'You have a new customer approval',
        html: emailHTML
      };
      console.log(mailOptions);
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
