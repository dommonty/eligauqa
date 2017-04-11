'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  async = require('async'),
  Employee = mongoose.model('Employee'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Employee
 */
exports.create = function (req, res) {
  var employee = new Employee(req.body);
  employee.user = req.user;

  employee.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(employee);
    }
  });
};

/**
 * Show the current Employee
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var employee = req.employee ? req.employee.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  employee.isCurrentUserOwner = req.user && employee.user && employee.user._id.toString() === req.user._id.toString() ? true : false;

  if (!(req.user.isHRAdmin || req.user.isAdmin))
    employee.salary = null;
  res.jsonp(employee);
};

/**
 * Update a Employee
 */
exports.update = function (req, res) {
  var employee = req.employee;

  employee = _.extend(employee, req.body);

  employee.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(employee);
    }
  });
};

/**
 * Delete an Employee
 */
exports.delete = function (req, res) {
  var employee = req.employee;

  employee.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(employee);
    }
  });
};

/**
 * List of Employees
 */
exports.list = function (req, res) {
  var quoteAuthorityLevel = req.query.quoteAuthorityLevel;
  var findQuery;

  if (quoteAuthorityLevel > 0)
    findQuery = Employee.find(
      {
        quoteEstimateAuthorityLevel: {
          $gt: quoteAuthorityLevel
        }
      });
  else {
    var query;

    if (req.query.businessUnitId)
      query = { businessUnit: req.query.businessUnitId };
    findQuery = Employee.find(query);
  }

  findQuery.sort('created').populate([ 'user', 'location', 'role', 'otherRole', 'businessUnit', 'squad', 'systemUser', 'reportingManager' ]).exec(function (err, employees) {
    var results = [];
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      async.each(employees, function (eachEmployee, cb) {
        eachEmployee.getSquadAllocations(function (allocations) {
          var employeeObj = eachEmployee.toObject();  //Mongoose models are immutable
          employeeObj.salary = null; //security reasons
          employeeObj.allocations = allocations;
          results.push(employeeObj);
          cb();
        });
      }, function () {
        res.jsonp(results);
      });
    }
  });
};

/**
 * Employee middleware
 */
exports.employeeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Employee is invalid'
    });
  }

  Employee.findById(id).populate([ 'user', 'location', 'role', 'otherRole', 'businessUnit', 'squad', 'systemUser', 'reportingManager' ]).exec(function (err, employee) {
    if (err) {
      return next(err);
    } else if (!employee) {
      return res.status(404).send({
        message: 'No Employee with that identifier has been found'
      });
    }
    req.employee = employee;
    next();
  });
};
