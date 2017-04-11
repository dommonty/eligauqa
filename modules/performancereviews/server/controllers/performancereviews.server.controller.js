'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Performancereview = mongoose.model('Performancereview'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Performancereview
 */
exports.create = function (req, res) {
  var performancereview = new Performancereview(req.body);
  performancereview.user = req.user;

  performancereview.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(performancereview);
    }
  });
};

/**
 * Show the current Performancereview
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var performancereview = req.performancereview ? req.performancereview.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  performancereview.isCurrentUserOwner = req.user && performancereview.assignee && performancereview.assignee._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(performancereview);
};

/**
 * Update a Performancereview
 */
exports.update = function (req, res) {
  var performancereview = req.performancereview;

  performancereview = _.extend(performancereview, req.body);

  performancereview.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(performancereview);
    }
  });
};

/**
 * Delete an Performancereview
 */
exports.delete = function (req, res) {
  var performancereview = req.performancereview;

  performancereview.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(performancereview);
    }
  });
};

/**
 * List of Performancereviews
 */
exports.list = function (req, res) {
  var query;

  if (req.query.reviewRequestId)
    query = {
      request: req.query.reviewRequestId
    };
  if (req.query.assigneeId) {
    if (query)
      query.assignee = req.query.assigneeId;
    else
      query = {
        assignee: req.query.assigneeId
      };
  }
  console.log(query);

  Performancereview.find(query).sort('-created').populate([ 'user', 'displayName', 'assignee', 'request' ]).exec(function (err, performancereviews) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Performancereview.deepPopulate(performancereviews, [ 'request.businessPeriod', 'request.reviewee' ], function (err, _performancereviews) {
        res.jsonp(_performancereviews);
      });
    }
  });
};

/**
 * Performancereview middleware
 */
exports.performancereviewByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Performancereview is invalid'
    });
  }

  Performancereview.findById(id).populate([ 'user', 'displayName', 'assignee', 'request' ]).exec(function (err, performancereview) {
    if (err) {
      return next(err);
    } else if (!performancereview) {
      return res.status(404).send({
        message: 'No Performancereview with that identifier has been found'
      });
    }
    performancereview.deepPopulate([ 'request.reviewer', 'request.reviewee', 'request.businessPeriod'], function (err, _performancereview) {
      req.performancereview = _performancereview;
      next();
    });

  });
};

