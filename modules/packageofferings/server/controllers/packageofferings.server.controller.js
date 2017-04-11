'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Packageoffering = mongoose.model('Packageoffering'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Packageoffering
 */
exports.create = function(req, res) {
  var packageoffering = new Packageoffering(req.body);
  packageoffering.user = req.user;

  packageoffering.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(packageoffering);
    }
  });
};

/**
 * Show the current Packageoffering
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var packageoffering = req.packageoffering ? req.packageoffering.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  packageoffering.isCurrentUserOwner = req.user && packageoffering.user && packageoffering.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(packageoffering);
};

/**
 * Update a Packageoffering
 */
exports.update = function(req, res) {
  var packageoffering = req.packageoffering ;

  packageoffering = _.extend(packageoffering , req.body);

  packageoffering.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(packageoffering);
    }
  });
};

/**
 * Delete an Packageoffering
 */
exports.delete = function(req, res) {
  var packageoffering = req.packageoffering ;

  packageoffering.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(packageoffering);
    }
  });
};

/**
 * List of Packageofferings
 */
exports.list = function(req, res) { 
  Packageoffering.find().sort('-created').populate('user', 'displayName').exec(function(err, packageofferings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(packageofferings);
    }
  });
};

/**
 * Packageoffering middleware
 */
exports.packageofferingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Packageoffering is invalid'
    });
  }

  Packageoffering.findById(id).populate('user', 'displayName').exec(function (err, packageoffering) {
    if (err) {
      return next(err);
    } else if (!packageoffering) {
      return res.status(404).send({
        message: 'No Packageoffering with that identifier has been found'
      });
    }
    req.packageoffering = packageoffering;
    next();
  });
};
