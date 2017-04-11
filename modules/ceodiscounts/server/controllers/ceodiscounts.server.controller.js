'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ceodiscount = mongoose.model('Ceodiscount'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Ceodiscount
 */
exports.create = function(req, res) {
  var ceodiscount = new Ceodiscount(req.body);
  ceodiscount.user = req.user;

  ceodiscount.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ceodiscount);
    }
  });
};

/**
 * Show the current Ceodiscount
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ceodiscount = req.ceodiscount ? req.ceodiscount.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ceodiscount.isCurrentUserOwner = req.user && ceodiscount.user && ceodiscount.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(ceodiscount);
};

/**
 * Update a Ceodiscount
 */
exports.update = function(req, res) {
  var ceodiscount = req.ceodiscount ;

  ceodiscount = _.extend(ceodiscount , req.body);

  ceodiscount.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ceodiscount);
    }
  });
};

/**
 * Delete an Ceodiscount
 */
exports.delete = function(req, res) {
  var ceodiscount = req.ceodiscount ;

  ceodiscount.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ceodiscount);
    }
  });
};

/**
 * List of Ceodiscounts
 */
exports.list = function(req, res) { 
  Ceodiscount.find().sort('discount').populate('user', 'displayName').exec(function(err, ceodiscounts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ceodiscounts);
    }
  });
};

/**
 * Ceodiscount middleware
 */
exports.ceodiscountByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ceodiscount is invalid'
    });
  }

  Ceodiscount.findById(id).populate('user', 'displayName').exec(function (err, ceodiscount) {
    if (err) {
      return next(err);
    } else if (!ceodiscount) {
      return res.status(404).send({
        message: 'No Ceodiscount with that identifier has been found'
      });
    }
    req.ceodiscount = ceodiscount;
    next();
  });
};
