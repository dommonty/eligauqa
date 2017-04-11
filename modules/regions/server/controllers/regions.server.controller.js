'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Region = mongoose.model('Region'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Region
 */
exports.create = function(req, res) {
  var region = new Region(req.body);
  region.user = req.user;

  region.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(region);
    }
  });
};

/**
 * Show the current Region
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var region = req.region ? req.region.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  region.isCurrentUserOwner = req.user && region.user && region.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(region);
};

/**
 * Update a Region
 */
exports.update = function(req, res) {
  var region = req.region ;

  region = _.extend(region , req.body);

  region.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(region);
    }
  });
};

/**
 * Delete an Region
 */
exports.delete = function(req, res) {
  var region = req.region ;

  region.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(region);
    }
  });
};

/**
 * List of Regions
 */
exports.list = function(req, res) { 
  Region.find().sort('name').populate('user', 'displayName').exec(function(err, regions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(regions);
    }
  });
};

/**
 * Region middleware
 */
exports.regionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Region is invalid'
    });
  }

  Region.findById(id).populate('user', 'displayName').exec(function (err, region) {
    if (err) {
      return next(err);
    } else if (!region) {
      return res.status(404).send({
        message: 'No Region with that identifier has been found'
      });
    }
    req.region = region;
    next();
  });
};
