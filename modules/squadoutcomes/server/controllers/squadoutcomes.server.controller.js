'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Squadoutcome = mongoose.model('Squadoutcome'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Squadoutcome
 */
exports.create = function (req, res) {
  var squadoutcome = new Squadoutcome(req.body);
  squadoutcome.user = req.user;

  squadoutcome.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(squadoutcome);
    }
  });
};

/**
 * Show the current Squadoutcome
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var squadoutcome = req.squadoutcome ? req.squadoutcome.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  squadoutcome.isCurrentUserOwner = req.user && squadoutcome.user && squadoutcome.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(squadoutcome);
};

/**
 * Update a Squadoutcome
 */
exports.update = function (req, res) {
  var squadoutcome = req.squadoutcome;

  squadoutcome = _.extend(squadoutcome, req.body);

  squadoutcome.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(squadoutcome);
    }
  });
};

/**
 * Delete an Squadoutcome
 */
exports.delete = function (req, res) {
  var squadoutcome = req.squadoutcome;

  squadoutcome.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(squadoutcome);
    }
  });
};

/**
 * List of Squadoutcomes
 */
exports.list = function (req, res) {
  var query;

  if (req.query.squadId)
    query = Squadoutcome.find({
      squad: req.query.squadId
    });
  else
    query = Squadoutcome.find();

  query.sort('-created').populate([ 'user', 'squad', 'businessPeriod' ]).exec(function (err, squadoutcomes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(squadoutcomes);
    }
  });
};

/**
 * Squadoutcome middleware
 */
exports.squadoutcomeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Squadoutcome is invalid'
    });
  }

  Squadoutcome.findById(id).populate([ 'user', 'squad', 'businessPeriod' ]).exec(function (err, squadoutcome) {
    if (err) {
      return next(err);
    } else if (!squadoutcome) {
      return res.status(404).send({
        message: 'No Squadoutcome with that identifier has been found'
      });
    }
    req.squadoutcome = squadoutcome;
    next();
  });
};
