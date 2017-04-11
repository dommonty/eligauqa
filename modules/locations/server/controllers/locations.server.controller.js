'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Location = mongoose.model('Location'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Location
 */
exports.create = function(req, res) {
  var location = new Location(req.body);
  location.user = req.user;

  location.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(location);
    }
  });
};

/**
 * Show the current Location
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var location = req.location ? req.location.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  location.isCurrentUserOwner = req.user && location.user && location.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(location);
};

/**
 * Update a Location
 */
exports.update = function(req, res) {
  var location = req.location ;

  location = _.extend(location , req.body);

  location.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(location);
    }
  });
};

/**
 * Delete an Location
 */
exports.delete = function(req, res) {
  var location = req.location ;

  location.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(location);
    }
  });
};

/**
 * List of Locations
 */
exports.list = function(req, res) { 
  Location.find().sort('-created').populate('user', 'displayName').exec(function(err, locations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(locations);
    }
  });
};

/**
 * Location middleware
 */
exports.locationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Location is invalid'
    });
  }

  Location.findById(id).populate('user', 'displayName').exec(function (err, location) {
    if (err) {
      return next(err);
    } else if (!location) {
      return res.status(404).send({
        message: 'No Location with that identifier has been found'
      });
    }
    req.location = location;
    next();
  });
};
