'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  async = require('async'),
  _ = require('lodash');

/**
 * Create a Customer
 */
exports.create = function (req, res) {
  var customer = new Customer(req.body);
  customer.user = req.user;

  customer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Show the current Customer
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var customer = req.customer;
  if (!req.query.populateForReporting)
    customer = req.customer ? req.customer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customer.isCurrentUserOwner = req.user && customer.user && customer.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(customer);
};

/**
 * Update a Customer
 */
exports.update = function (req, res) {
  var customer = req.customer;

  customer = _.extend(customer, req.body);

  customer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * Delete an Customer
 */
exports.delete = function (req, res) {
  var customer = req.customer;

  customer.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function (req, res) {
  var populateForReporting = req.query.populateForReporting;
  var businessUnitId = req.query.businessUnitId;

  Customer.find().sort('name').populate([ 'user', 'region', 'businessUnit' ]).exec(function (err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (populateForReporting) {
        var populatedCustomers = [];
        async.each(customers, function (eachCustomer, cb) {
          populateCustomerForReporting(eachCustomer, businessUnitId, function (_customer) {
            populatedCustomers.push(_customer);
            cb();
          });
        }, function () {
          res.jsonp(populatedCustomers);
        });
      }
      else
        res.jsonp(customers);
    }
  });
};

/**
 * Customer middleware
 */
exports.customerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  var populateForReporting = req.query.populateForReporting;
  var businessUnitId = req.query.businessUnitId;

  Customer.findById(id).populate([ 'user', 'region' ]).exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No Customer with that identifier has been found'
      });
    }
    if (populateForReporting)
      populateCustomerForReporting(customer, businessUnitId, function (_customer) {
        req.customer = _customer;
        next();
      });
    else {
      req.customer = customer;
      next();
    }
  });
};

/*
 * get all the derived values for a squad
 * call cb with the populate values
 */
function populateCustomerForReporting(customer, businessUnitId, cb) {
  async.waterfall([
    addIsCustomerAtRisk,
    addAnnualRevenue,
    addContributionShare,
    addRiskRating
  ], returnPopulatedCustomer);

  function addIsCustomerAtRisk(callback) {
    customer.isCustomerAtRisk(function (atRisk) {
      var _customer = customer.toObject();  //Mongoose models are immutable
      _customer.isAtRisk = atRisk;
      callback(null, _customer);
    });
  }

  function addAnnualRevenue(_customer, callback) {
    customer.annualRevenue(businessUnitId, function (revenue) {
      _customer.annualRevenue = revenue;
      callback(null, _customer);
    });
  }

  function addContributionShare(_customer, callback) {
    customer.contributionShare(businessUnitId, function (share) {
      _customer.contributionShare = share;
      callback(null, _customer);
    });
  }

  function addRiskRating(_customer, callback) {
    if (_customer.isAtRisk) {
      if (_customer.contributionShare > 10)
        _customer.riskRating = 'Major';
      else if (_customer.contributionShare < 5)
        _customer.riskRating = 'Minor';
      else
        _customer.riskRating = 'Moderate';
    }
    callback(null, _customer);
  }

  function returnPopulatedCustomer(err, _customer) {
    // console.log(_customer);
    cb(_customer);
  }

}
