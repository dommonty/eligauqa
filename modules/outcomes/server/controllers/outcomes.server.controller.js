'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Outcome = mongoose.model('Outcome'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Outcome
 */
exports.create = function (req, res) {
  var outcome = new Outcome(req.body);
  outcome.user = req.user;

  outcome.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(outcome);
    }
  });
};

/**
 * Show the current Outcome
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var outcome = req.outcome ? req.outcome.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  outcome.isCurrentUserOwner = req.user && outcome.user && outcome.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(outcome);
};

/**
 * Update a Outcome
 */
exports.update = function (req, res) {
  var outcome = req.outcome;

  outcome = _.extend(outcome, req.body);

  outcome.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(outcome);
    }
  });
};

/**
 * Delete an Outcome
 */
exports.delete = function (req, res) {
  var outcome = req.outcome;

  outcome.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(outcome);
    }
  });
};

/**
 * List of Outcomes
 */
exports.list = function (req, res) {
  Outcome.find().sort('-created').populate([ 'user', 'outcomeTeam', 'businessPeriod' ]).exec(function (err, outcomes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(outcomes);
    }
  });
};

/**
 * Outcome middleware
 */
exports.outcomeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Outcome is invalid'
    });
  }

  Outcome.findById(id).populate([ 'user', 'outcomeTeam', 'businessPeriod' ]).exec(function (err, outcome) {
    if (err) {
      return next(err);
    } else if (!outcome) {
      return res.status(404).send({
        message: 'No Outcome with that identifier has been found'
      });
    }
    req.outcome = outcome;
    next();
  });
};
