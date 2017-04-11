'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Revenueallocation = mongoose.model('Revenueallocation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Revenueallocation
 */
exports.create = function (req, res) {
  var revenueallocation = new Revenueallocation(req.body);
  revenueallocation.user = req.user;

  revenueallocation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(revenueallocation);
    }
  });
};

/**
 * Show the current Revenueallocation
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var revenueallocation = req.revenueallocation ? req.revenueallocation.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  revenueallocation.isCurrentUserOwner = req.user && revenueallocation.user && revenueallocation.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(revenueallocation);
};

/**
 * Update a Revenueallocation
 */
exports.update = function (req, res) {
  var revenueallocation = req.revenueallocation;

  revenueallocation = _.extend(revenueallocation, req.body);

  revenueallocation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(revenueallocation);
    }
  });
};

/**
 * Delete an Revenueallocation
 */
exports.delete = function (req, res) {
  var revenueallocation = req.revenueallocation;

  revenueallocation.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(revenueallocation);
    }
  });
};

/**
 * List of Revenueallocations
 */
exports.list = function (req, res) {
  var query;
  if (req.query.productId) {
    query = Revenueallocation.find({
      product: req.query.productId }
    );
  }
  else
    query = Revenueallocation.find();
  query.sort('-created').populate([ 'user', 'squad', 'product' ]).exec(function (err, revenueallocations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(revenueallocations);
    }
  });
};

/**
 * Revenueallocation middleware
 */
exports.revenueallocationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Revenueallocation is invalid'
    });
  }

  Revenueallocation.findById(id).populate([ 'user', 'squad', 'product' ]).exec(function (err, revenueallocation) {
    if (err) {
      return next(err);
    } else if (!revenueallocation) {
      return res.status(404).send({
        message: 'No Revenueallocation with that identifier has been found'
      });
    }
    req.revenueallocation = revenueallocation;
    next();
  });
};
