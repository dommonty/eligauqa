'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Contractterm = mongoose.model('Contractterm'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Contractterm
 */
exports.create = function(req, res) {
  var contractterm = new Contractterm(req.body);
  contractterm.user = req.user;

  contractterm.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contractterm);
    }
  });
};

/**
 * Show the current Contractterm
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var contractterm = req.contractterm ? req.contractterm.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  contractterm.isCurrentUserOwner = req.user && contractterm.user && contractterm.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(contractterm);
};

/**
 * Update a Contractterm
 */
exports.update = function(req, res) {
  var contractterm = req.contractterm ;

  contractterm = _.extend(contractterm , req.body);

  contractterm.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contractterm);
    }
  });
};

/**
 * Delete an Contractterm
 */
exports.delete = function(req, res) {
  var contractterm = req.contractterm ;

  contractterm.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contractterm);
    }
  });
};

/**
 * List of Contractterms
 */
exports.list = function(req, res) { 
  Contractterm.find().sort('-created').populate('user', 'displayName').exec(function(err, contractterms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contractterms);
    }
  });
};

/**
 * Contractterm middleware
 */
exports.contracttermByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Contractterm is invalid'
    });
  }

  Contractterm.findById(id).populate('user', 'displayName').exec(function (err, contractterm) {
    if (err) {
      return next(err);
    } else if (!contractterm) {
      return res.status(404).send({
        message: 'No Contractterm with that identifier has been found'
      });
    }
    req.contractterm = contractterm;
    next();
  });
};
