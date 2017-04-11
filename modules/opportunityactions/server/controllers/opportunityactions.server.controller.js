'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Opportunityaction = mongoose.model('Opportunityaction'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  _ = require('lodash');

/**
 * Create a Opportunityaction
 */
exports.create = function (req, res) {
  var opportunityaction = new Opportunityaction(req.body);
  opportunityaction.user = req.user;

  opportunityaction.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunityaction);
      Opportunityaction.findById(opportunityaction._id).populate([ 'user', 'assignee', 'opportunity' ]).exec(function (err, _opportunityaction) {
        sendEmailForAction(req, res, _opportunityaction);
      });
    }
  });
};

/**
 * Show the current Opportunityaction
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var opportunityaction = req.opportunityaction ? req.opportunityaction.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  opportunityaction.isCurrentUserOwner = req.user && opportunityaction.user && opportunityaction.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(opportunityaction);
};

/**
 * Update a Opportunityaction
 */
exports.update = function (req, res) {
  var opportunityaction = req.opportunityaction;

  opportunityaction = _.extend(opportunityaction, req.body);

  opportunityaction.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunityaction);
      sendEmailForAction(req, res, opportunityaction);
    }
  });
};

/**
 * Delete an Opportunityaction
 */
exports.delete = function (req, res) {
  var opportunityaction = req.opportunityaction;

  opportunityaction.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunityaction);
    }
  });
};

/**
 * List of Opportunityactions
 */
exports.list = function (req, res) {
  var opportunityId = req.query.opportunityId;
  var assigneeId = req.query.assigneeId;
  var filter = {};
  if (opportunityId)
    filter.opportunity = opportunityId;
  if (assigneeId)
    filter.assignee = assigneeId;

  Opportunityaction.find(filter).sort('-created').populate([ 'user', 'assignee', 'opportunity' ]).exec(function (err, opportunityactions) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        Opportunityaction.deepPopulate(opportunityactions, [ 'opportunity.customer' ], function (err, opportunityactions) {
          res.jsonp(opportunityactions);
        });
      }
    }
  );
};

/**
 * Opportunityaction middleware
 */
exports.opportunityactionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Opportunityaction is invalid'
    });
  }

  Opportunityaction.findById(id).populate([ 'user', 'assignee', 'opportunity' ]).exec(function (err, opportunityaction) {
    if (err) {
      return next(err);
    } else if (!opportunityaction) {
      return res.status(404).send({
        message: 'No Opportunityaction with that identifier has been found'
      });
    }
    req.opportunityaction = opportunityaction;
    next();
  });
};

/*
 * send an email to the assignee of the action
 */
function sendEmailForAction(req, res, opportunityAction) {
 // console.log('about to send email for opportunity action' + opportunityAction);
  var smtpTransport = nodemailer.createTransport(config.mailer.options);

  async.waterfall([
    function (done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render('modules/opportunityactions/server/templates/send-action-email', {
        name: opportunityAction.assignee.displayName,
        assignedByName: opportunityAction.user.displayName,
        url: httpTransport + req.headers.host + '/opportunityactions?assigneeId=' + opportunityAction.assignee._id,
        appName: config.app.title,
      }, function (err, emailHTML) {
        //console.log(emailHTML);
        done(err, emailHTML);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, done) {
      var mailOptions = {
        to: opportunityAction.assignee.email,
        from: config.mailer.from,
        subject: 'You have a new opportunity action',
        html: emailHTML
      };
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
