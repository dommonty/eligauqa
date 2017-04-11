'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Costallocation = mongoose.model('Costallocation'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Costallocation
 */
exports.create = function (req, res) {
  var costallocation = new Costallocation(req.body);
  costallocation.user = req.user;

  costallocation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(costallocation);
    }
  });
};

/**
 * Show the current Costallocation
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var costallocation = req.costallocation;

  costallocation.allocatedCost(function (cost) {
    var _costallocation = costallocation.toJSON();
    _costallocation.allocatedCost = cost;
    _costallocation.isCurrentUserOwner = req.user && costallocation.user && costallocation.user._id.toString() === req.user._id.toString() ? true : false;
    res.jsonp(_costallocation);
  });
};

/**
 * Update a Costallocation
 */
exports.update = function (req, res) {
  var costallocation = req.costallocation;

  costallocation = _.extend(costallocation, req.body);
  costallocation.allocation = Math.round(costallocation.allocation);
  costallocation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(costallocation);
    }
  });

};

/**
 * Delete an Costallocation
 */
exports.delete = function (req, res) {
  var costallocation = req.costallocation;

  costallocation.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(costallocation);
    }
  });
};

/**
 * List of Costallocations
 */
exports.list = function (req, res) {
  var query;
  var results = [];
  if (req.query.costId)
    query = Costallocation.find(
      {
        cost: req.query.costId
      }
    );
  else
    query = Costallocation.find();

  query.find().sort('-created').populate([ 'user', 'squad', 'cost' ]).exec(function (err, costallocations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      async.each(costallocations, function (costAllocation, cb) {
        costAllocation.allocatedCost(function (allocatedCost) {
          var _costAllocation = costAllocation.toObject();
          _costAllocation.allocatedCost = allocatedCost;
          results.push(_costAllocation);
          cb();
        });
      }, function (err) {
        res.jsonp(results);
      });

    }
  });
};

/**
 * Costallocation middleware
 */
exports.costallocationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Costallocation is invalid'
    });
  }

  Costallocation.findById(id).populate([ 'user', 'squad', 'cost' ]).exec(function (err, costallocation) {
    if (err) {
      return next(err);
    } else if (!costallocation) {
      return res.status(404).send({
        message: 'No Costallocation with that identifier has been found'
      });
    }
    req.costallocation = costallocation;
    next();

  });
};
