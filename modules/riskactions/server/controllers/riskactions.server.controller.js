'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Riskaction = mongoose.model('Riskaction'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Riskaction
 */
exports.create = function (req, res) {
  var riskaction = new Riskaction(req.body);
  riskaction.user = req.user;

  riskaction.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(riskaction);
    }
  });
};

/**
 * Show the current Riskaction
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var riskaction = req.riskaction ? req.riskaction.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  riskaction.isCurrentUserOwner = req.user && riskaction.user && riskaction.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(riskaction);
};

/**
 * Update a Riskaction
 */
exports.update = function (req, res) {
  var riskaction = req.riskaction;

  riskaction = _.extend(riskaction, req.body);

  riskaction.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(riskaction);
    }
  });
};

/**
 * Delete an Riskaction
 */
exports.delete = function (req, res) {
  var riskaction = req.riskaction;

  riskaction.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(riskaction);
    }
  });
};

/**
 * List of Riskactions
 */
exports.list = function (req, res) {
  var query = Riskaction.find();

  if (req.query.customerId)
    query = Riskaction.find({ customer: req.query.customerId });

  query.sort('-created').populate([ 'user', 'owner']).exec(function (err, riskactions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(riskactions);
    }
  });
}
;

/**
 * Riskaction middleware
 */
exports.riskactionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Riskaction is invalid'
    });
  }

  Riskaction.findById(id).populate([ 'user', 'owner' ]).exec(function (err, riskaction) {
    if (err) {
      return next(err);
    } else if (!riskaction) {
      return res.status(404).send({
        message: 'No Riskaction with that identifier has been found'
      });
    }
    req.riskaction = riskaction;
    next();
  });
};
