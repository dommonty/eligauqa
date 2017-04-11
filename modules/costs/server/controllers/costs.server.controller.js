'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cost = mongoose.model('Cost'),
  BusinessUnit = mongoose.model('Businessunit'),
  Costallocation = mongoose.model('Costallocation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cost
 */
exports.create = function (req, res) {
  var cost = new Cost(req.body);
  var autoAllocate = req.body.autoAllocate;
  cost.user = req.user;
  cost.forecastSeries.date = new Date(cost.forecastSeries.date);
  cost.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (autoAllocate) {
        BusinessUnit.findById(cost.businessUnit).exec(function (err, _bu) {
          _bu.allSquads(function (squads) {
            if (squads.length > 0) {
              var costAllocations = [];
              var allocation = Math.round(100 / squads.length);
              for (var i = 0; i < squads.length; i++) {
                costAllocations.push({
                  squad: squads[ i ],
                  cost: cost,
                  allocation: allocation,
                  user: cost.user
                });
              }
              Costallocation.create(costAllocations, function (err, _costAllocations) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                }
                cost.allocations = _costAllocations;
                res.jsonp(cost);
              });
            }
          });
        });
      }
      else {
        res.jsonp(cost);
      }
    }
  });
};

/**
 * Show the current Cost
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cost = req.cost; //cost is a kind of mongoose document

  cost.allocatedCost(function (_allocatedCost) {
    var _cost = cost.toJSON();
    _cost.allocatedCost = _allocatedCost;
    _cost.isCurrentUserOwner = req.user && cost.user && cost.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(_cost);
  });

};

/**
 * Update a Cost
 */
exports.update = function (req, res) {
  var cost = req.cost;

  cost = _.extend(cost, req.body);
  cost.forecastSeries.date = new Date(cost.forecastSeries.date);
  cost.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cost);
    }
  });
};

/**
 * Delete an Cost
 */
exports.delete = function (req, res) {
  var cost = req.cost;

  Costallocation.remove({
    cost: cost._id
  }, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    cost.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(cost);
      }
    });
  });

};

/**
 * List of Costs
 */
exports.list = function (req, res) {
  var query;

  if (req.query.businessUnitId)
    query = {businessUnit: req.query.businessUnitId};

  Cost.find(query).sort('-created').populate([ 'user', 'businessUnit', 'contractPeriod' ]).exec(function (err, costs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(costs);
    }
  });
};

/**
 * Cost middleware
 */
exports.costByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cost is invalid'
    });
  }

  Cost.findById(id).populate([ 'user', 'businessUnit', 'contractPeriod' ]).exec(function (err, cost) {
    if (err) {
      return next(err);
    } else if (!cost) {
      return res.status(404).send({
        message: 'No Cost with that identifier has been found'
      });
    }
    req.cost = cost;
    next();
  });
};

/**
 * prepare and store the cost allocations from the array of costs
 */
exports.createFromArray = function (req, res) {
  var async = require('async');
  var costsFromRequest = req.body.csv;
  var responseSent;

  async.each(costsFromRequest, getAndUpdateCostAllocations, function () {
    if (!responseSent)
      res.status(200).send({
        message: 'Costs from CSV successfully saved'
      });

  });

  function getAndUpdateCostAllocations(eachCostFromRequest, firstCallback) {
    var CostAllocation = mongoose.model('Costallocation');
    CostAllocation.find({
      cost: mongoose.Types.ObjectId(eachCostFromRequest.costId)
    }).exec(function (err, costAllocations) {

      async.forEach(costAllocations, function (eachAllocation, secondCallback) {
        eachAllocation.actuals.push({
          amount: Math.round(eachCostFromRequest.actualValue * eachAllocation.allocation / 100),
          dateCreated: eachCostFromRequest.actualMonth,
          description: 'Actual imported from file'
        });
        eachAllocation.save(function (err) {
          if (err && !responseSent) {
            responseSent = true;
            res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          secondCallback();
        });
      }, function () {
        firstCallback();
      });
    });
  }
};



