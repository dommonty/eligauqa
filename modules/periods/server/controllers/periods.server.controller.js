'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Period = mongoose.model('Period'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Period
 */
exports.create = function(req, res) {
  var period = new Period(req.body);
  period.user = req.user;

  period.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(period);
    }
  });
};

/**
 * Show the current Period
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var period = req.period ? req.period.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  period.isCurrentUserOwner = req.user && period.user && period.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(period);
};

/**
 * Update a Period
 */
exports.update = function(req, res) {
  var period = req.period ;

  period = _.extend(period , req.body);

  period.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(period);
    }
  });
};

/**
 * Delete an Period
 */
exports.delete = function(req, res) {
  var period = req.period ;

  period.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(period);
    }
  });
};

/**
 * List of Periods
 */
exports.list = function(req, res) { 
  Period.find().sort('periodFrom').populate('user', 'displayName').exec(function(err, periods) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(periods);
    }
  });
};

/**
 * Period middleware
 */
exports.periodByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Period is invalid'
    });
  }

  Period.findById(id).populate('user', 'displayName').exec(function (err, period) {
    if (err) {
      return next(err);
    } else if (!period) {
      return res.status(404).send({
        message: 'No Period with that identifier has been found'
      });
    }
    req.period = period;
    next();
  });
};
