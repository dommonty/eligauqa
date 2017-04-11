'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Quote = mongoose.model('Quote'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Quote
 */
exports.create = function (req, res) {
  var quote = new Quote(req.body);
  quote.user = req.user;

  quote.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quote);
    }
  });
};

/**
 * Show the current Quote
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var quote = req.quote ? req.quote.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  quote.isCurrentUserOwner = req.user && quote.user && quote.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(quote);
};

/**
 * Update a Quote
 */
exports.update = function (req, res) {
  var quote = req.quote;

  quote = _.extend(quote, req.body);

  quote.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quote);
    }
  });
};

/**
 * Delete an Quote
 */
exports.delete = function (req, res) {
  var quote = req.quote;

  quote.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quote);
    }
  });
};

/**
 * List of Quotes
 */
exports.list = function (req, res) {
  Quote.find().sort('-created').populate([ 'user', 'displayName', 'customer', 'region', 'accountOwner' ]).exec(function (err, quotes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quotes);
    }
  });
};

/**
 * Quote middleware
 */
exports.quoteByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Quote is invalid'
    });
  }

  Quote.findById(id).populate([ 'user', 'accountOwner', 'includedProducts', 'customer', 'accountOwner', 'ceoDiscount', 'supportPlan', 'contractPeriod', 'packageOffer', 'currency' ]).exec(function (err, quote) {
    if (err) {
      return next(err);
    } else if (!quote) {
      return res.status(404).send({
        message: 'No Quote with that identifier has been found'
      });
    }
    req.quote = quote;
    next();
  });
};
