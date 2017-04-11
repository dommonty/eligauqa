'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Businessunit = mongoose.model('Businessunit'),
  Employee = mongoose.model('Employee'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Businessunit
 */
exports.create = function (req, res) {
  var businessunit = new Businessunit(req.body);
  businessunit.user = req.user;

  businessunit.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(businessunit);
    }
  });
};

/**
 * Show the current Businessunit
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var businessunit = req.businessunit ? req.businessunit.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  businessunit.isCurrentUserOwner = req.user && businessunit.user && businessunit.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(businessunit);
};

/**
 * Update a Businessunit
 */
exports.update = function (req, res) {
  var businessunit = req.businessunit;

  businessunit = _.extend(businessunit, req.body);

  businessunit.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(businessunit);
    }
  });
};

/**
 * Delete an Businessunit
 */
exports.delete = function (req, res) {
  var businessunit = req.businessunit;

  businessunit.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(businessunit);
    }
  });
};

/**
 * List of Businessunits
 */
exports.list = function (req, res) {
  Businessunit.find().sort('-created').populate([ 'user', 'companyOverheadCost', 'businessUnitOverheadCost', 'company' ]).exec(function (err, businessunits) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(businessunits);
    }
  });
};

/**
 * Businessunit middleware
 */
exports.businessunitByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Businessunit is invalid'
    });
  }

  Businessunit.findById(id).populate([ 'user', 'companyOverheadCost', 'businessUnitOverheadCost', 'company' ]).exec(function (err, businessunit) {
    if (err) {
      return next(err);
    } else if (!businessunit) {
      return res.status(404).send({
        message: 'No Businessunit with that identifier has been found'
      });
    }
    req.businessunit = businessunit;
    next();
  });
};

/**
 * store an array of employees
 */
exports.createFromArray = function (req, res) {
  var employeesFromRequest = req.body.csv;
  console.log('employees = ' + employeesFromRequest);
  Employee.create(employeesFromRequest, function (err, employees) {
    if (err) {
      res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(200).send({
        message: 'Employees from CSV successfully saved'
      });
    }
  });
};
