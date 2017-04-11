'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Outcometeam = mongoose.model('Outcometeam'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Outcometeam
 */
exports.create = function (req, res) {
  var outcometeam = new Outcometeam(req.body);
  outcometeam.user = req.user;

  outcometeam.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(outcometeam);
    }
  });
};

/**
 * Show the current Outcometeam
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var probability = req.query.probability;
  console.log('probability = ' + probability);
  var outcometeam = req.outcometeam ? req.outcometeam.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  outcometeam.isCurrentUserOwner = req.user && outcometeam.user && outcometeam.user._id.toString() === req.user._id.toString() ? true : false;
  Outcometeam.findById(outcometeam._id).exec(function (err, fatObj) {
    fatObj.totalSquadsCost(function (baseCost, loadedCost) {
      outcometeam.baseCost = baseCost;
      outcometeam.loadedCost = loadedCost;
      fatObj.getOpportunityValues(function (total, next12Months) {
        outcometeam.totalOpportunityValue = total;
        outcometeam.next12MonthsValue = next12Months;
        fatObj.getProjectedProfit(function (profit) {
          outcometeam.profit = profit;
          res.jsonp(outcometeam);
        }, probability);
      }, probability);

    });
  });
};

/**
 * Update a Outcometeam
 */
exports.update = function (req, res) {
  var outcometeam = req.outcometeam;

  outcometeam = _.extend(outcometeam, req.body);

  outcometeam.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(outcometeam);
    }
  });
};

/**
 * Delete an Outcometeam
 */
exports.delete = function (req, res) {
  var outcometeam = req.outcometeam;

  outcometeam.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(outcometeam);
    }
  });
};

/**
 * List of Outcometeams
 */
exports.list = function (req, res) {
  var probability = req.query.probability;
  var deepPopulate = req.query.deepPopulate;

  var query;

  if(req.query.businessUnitId)
    query = { businessUnit: req.query.businessUnitId };


  Outcometeam.find(query).sort('-created').populate([ 'user', 'businessUnit', 'outcomeOwner' ]).exec(function (err, outcometeams) {
    var results = [];
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (deepPopulate) {
        async.each(outcometeams, function (outcomeTeam, cb) {
          outcomeTeam.totalSquadsCost(function (baseCost, loadedCost) {
            var outcomeObj = outcomeTeam.toObject();  //Mongoose models are immutable
            outcomeObj.baseCost = baseCost;
            outcomeObj.loadedCost = loadedCost;
            outcomeTeam.getOpportunityValues(function (total, next12Months) {
              outcomeObj.totalOpportunityValue = total;
              outcomeObj.next12MonthsValue = next12Months;
              outcomeTeam.getProjectedProfit(function (profit) {
                outcomeObj.profit = profit;
                outcomeTeam.getProducts(function (products) {
                  outcomeObj.products = products;
                  outcomeTeam.next12MonthsCost(function (directCost) {
                    outcomeObj.next12MonthsCost = directCost;
                    outcomeTeam.getProjects(function (projects) {
                      outcomeObj.projects = projects;
                      results.push(outcomeObj);
                      cb();
                    });

                  });
                });
              }, probability);
            }, probability);
          });
        }, function (err) {
          res.jsonp(results);
        });
      }
      else
        res.jsonp(outcometeams);

    }
  });
};

/**
 * Outcometeam middleware
 */
exports.outcometeamByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Outcometeam is invalid'
    });
  }

  Outcometeam.findById(id).populate([ 'user', 'businessUnit', 'outcomeOwner' ]).exec(function (err, outcometeam) {
    if (err) {
      return next(err);
    } else if (!outcometeam) {
      return res.status(404).send({
        message: 'No Outcometeam with that identifier has been found'
      });
    }
    req.outcometeam = outcometeam;
    next();
  });
};


