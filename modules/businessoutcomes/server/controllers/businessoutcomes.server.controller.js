'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Businessoutcome = mongoose.model('Businessoutcome'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Businessoutcome
 */
exports.create = function(req, res) {
  var businessoutcome = new Businessoutcome(req.body);
  businessoutcome.user = req.user;

  businessoutcome.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(businessoutcome);
    }
  });
};

/**
 * Show the current Businessoutcome
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var businessoutcome = req.businessoutcome ? req.businessoutcome.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  businessoutcome.isCurrentUserOwner = req.user && businessoutcome.user && businessoutcome.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(businessoutcome);
};

/**
 * Update a Businessoutcome
 */
exports.update = function(req, res) {
  var businessoutcome = req.businessoutcome ;

  businessoutcome = _.extend(businessoutcome , req.body);

  businessoutcome.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(businessoutcome);
    }
  });
};

/**
 * Delete an Businessoutcome
 */
exports.delete = function(req, res) {
  var businessoutcome = req.businessoutcome ;

  businessoutcome.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(businessoutcome);
    }
  });
};

/**
 * List of Businessoutcomes
 */
exports.list = function(req, res) { 
  Businessoutcome.find().sort('-created').populate(['user', 'businessUnit', 'businessPeriod']).exec(function(err, businessoutcomes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(businessoutcomes);
    }
  });
};

/**
 * Businessoutcome middleware
 */
exports.businessoutcomeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Businessoutcome is invalid'
    });
  }

  Businessoutcome.findById(id).populate(['user', 'businessUnit', 'businessPeriod']).exec(function (err, businessoutcome) {
    if (err) {
      return next(err);
    } else if (!businessoutcome) {
      return res.status(404).send({
        message: 'No Businessoutcome with that identifier has been found'
      });
    }
    req.businessoutcome = businessoutcome;
    next();
  });
};
