'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Supportplan = mongoose.model('Supportplan'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Supportplan
 */
exports.create = function(req, res) {
  var supportplan = new Supportplan(req.body);
  supportplan.user = req.user;

  supportplan.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(supportplan);
    }
  });
};

/**
 * Show the current Supportplan
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var supportplan = req.supportplan ? req.supportplan.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  supportplan.isCurrentUserOwner = req.user && supportplan.user && supportplan.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(supportplan);
};

/**
 * Update a Supportplan
 */
exports.update = function(req, res) {
  var supportplan = req.supportplan ;

  supportplan = _.extend(supportplan , req.body);

  supportplan.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(supportplan);
    }
  });
};

/**
 * Delete an Supportplan
 */
exports.delete = function(req, res) {
  var supportplan = req.supportplan ;

  supportplan.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(supportplan);
    }
  });
};

/**
 * List of Supportplans
 */
exports.list = function(req, res) { 
  Supportplan.find().sort('-created').populate('user', 'displayName').exec(function(err, supportplans) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(supportplans);
    }
  });
};

/**
 * Supportplan middleware
 */
exports.supportplanByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Supportplan is invalid'
    });
  }

  Supportplan.findById(id).populate('user', 'displayName').exec(function (err, supportplan) {
    if (err) {
      return next(err);
    } else if (!supportplan) {
      return res.status(404).send({
        message: 'No Supportplan with that identifier has been found'
      });
    }
    req.supportplan = supportplan;
    next();
  });
};
