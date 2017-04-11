'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customercontact = mongoose.model('Customercontact'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Customercontact
 */
exports.create = function (req, res) {
  var customercontact = new Customercontact(req.body);
  customercontact.user = req.user;

  customercontact.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customercontact);
    }
  });
};

/**
 * Show the current Customercontact
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var customercontact = req.customercontact ? req.customercontact.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customercontact.isCurrentUserOwner = req.user && customercontact.user && customercontact.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(customercontact);
};

/**
 * Update a Customercontact
 */
exports.update = function (req, res) {
  var customercontact = req.customercontact;

  customercontact = _.extend(customercontact, req.body);

  customercontact.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customercontact);
    }
  });
};

/**
 * Delete an Customercontact
 */
exports.delete = function (req, res) {
  var customercontact = req.customercontact;

  customercontact.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customercontact);
    }
  });
};

/**
 * List of Customercontacts
 */
exports.list = function (req, res) {
  var customerId = req.query.customerId;
  Customercontact.find(
    {
      customer: customerId
    }).sort('-created').populate('user', 'displayName').exec(function (err, customercontacts) {if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customercontacts);
    }
    });
};

/**
 * Customercontact middleware
 */
exports.customercontactByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customercontact is invalid'
    });
  }

  Customercontact.findById(id).populate('user', 'displayName').exec(function (err, customercontact) {
    if (err) {
      return next(err);
    } else if (!customercontact) {
      return res.status(404).send({
        message: 'No Customercontact with that identifier has been found'
      });
    }
    req.customercontact = customercontact;
    next();
  });
};
