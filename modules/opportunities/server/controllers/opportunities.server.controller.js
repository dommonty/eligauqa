'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Opportunity = mongoose.model('Opportunity'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  async = require('async'),
  _ = require('lodash');

/**
 * Create a Opportunity
 */
exports.create = function (req, res) {
  var opportunity = new Opportunity(req.body);
  opportunity.user = req.user;

  opportunity.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunity);
    }
  });
};

/**
 * Show the current Opportunity
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var opportunity = req.opportunity ? req.opportunity.toJSON() : {};

  opportunity.isCurrentUserOwner = req.user && _.includes(req.user.roles, 'user');

  res.jsonp(opportunity);
};

/**
 * Update a Opportunity
 */
exports.update = function (req, res) {
  var opportunity = req.opportunity;

  opportunity = _.extend(opportunity, req.body);

  opportunity.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunity);
    }
  });
};

/**
 * Delete an Opportunity
 */
exports.delete = function (req, res) {
  var opportunity = req.opportunity;

  opportunity.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunity);
    }
  });
};

/**
 * List of Opportunities
 */
exports.list = function (req, res) {
  var query;

  if (req.query.businessUnitId)
    query = {businessUnit: req.query.businessUnitId};

  if (req.query.customerId) {
    if (query)
      query.customer = req.query.customerId;
    else
      query = {customer: req.query.customerId};
  }

  Opportunity.find(query).sort('-created').populate([ 'owner', 'user', 'customer', 'contractPeriod', 'businessUnit', 'includedProduct', 'totalOpportunityValue' ]).exec(function (err, opportunities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var results = [];
      Opportunity.deepPopulate(opportunities, [ 'customer.region' ], function (err, opportunities) {
        async.each(opportunities, function (opportunity, cb) {
          var _opportunity = opportunity.toObject();
          opportunity.getOpportunityValueNext12Months(function (amount) {
            _opportunity.valueNext12Months = amount;
            results.push(_opportunity);
            cb();
          });
        }, function (err) {
          res.jsonp(results);
        });
      });
    }
  });
};

/**
 * Opportunity middleware
 */
exports.opportunityByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Opportunity is invalid'
    });
  }

  Opportunity.findById(id).populate([ 'owner', 'user', 'customer', 'contractPeriod', 'businessUnit', 'includedProduct', 'totalOpportunityValue' ]).exec(function (err, opportunity) {
    if (err) {
      return next(err);
    } else if (!opportunity) {
      return res.status(404).send({
        message: 'No Opportunity with that identifier has been found'
      });
    }
    req.opportunity = opportunity;
    next();
  });
};

/**
 * prepare and store the opportunity actuals from the array of opportunities
 */
exports.createFromArray = function (req, res) {
  var async = require('async');
  var opportunitiesFromRequest = req.body.csv;
  var responseSent;

  async.each(opportunitiesFromRequest, getAndUpdateOpportunityActuals, function () {
    if (!responseSent)
      res.status(200).send({
        message: 'Opportunities actuals from CSV successfully saved'
      });

  });

  function getAndUpdateOpportunityActuals(eachOpportunityFromRequest, callback) {
    Opportunity.findById(eachOpportunityFromRequest.saisOpportunityId).exec(function (err, opportunity) {
      opportunity.actualSeries.push({
        dateCreated: eachOpportunityFromRequest.actualMonth,
        amount: Math.round(eachOpportunityFromRequest.actualValue)
      });
      opportunity.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });

        }
        callback();
      });
    });
  }
};
