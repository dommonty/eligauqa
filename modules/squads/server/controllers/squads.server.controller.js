'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Squad = mongoose.model('Squad'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Squad
 */
exports.create = function (req, res) {
  var squad = new Squad(req.body);
  squad.user = req.user;

  squad.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(squad);
    }
  });
};

/**
 * Show the current Squad
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var probability = req.query.probability;
  var squad = req.squad ? req.squad.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  squad.isCurrentUserOwner = req.user && squad.user && squad.user._id.toString() === req.user._id.toString() ? true : false;

  Squad.findById(squad._id).populate([ 'user', 'squadOwner', 'outcomeTeam', 'listName' ]).exec(function (err, squadB) {
    squadB.getSquadCosts(function (baseSquadCost, loadedSquadCost) {
      squad.baseSquadCost = baseSquadCost;
      squad.loadedSquadCost = loadedSquadCost;
      squadB.getOpportunityValues(function (total, next12Months) {
        squad.totalOpportunityValue = total;
        squad.next12MonthsValue = next12Months;
        squadB.getProjectedProfit(function (profit) {
          squad.profit = profit;
          req.squad = squad;
          res.jsonp(squad);
        }, probability);
      }, probability);

    });
  });
};

/**
 * Update a Squad
 */
exports.update = function (req, res) {
  var squad = req.squad;

  squad = _.extend(squad, req.body);

  squad.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      res.jsonp(squad);
    }
  });
};

/**
 * Delete an Squad
 */
exports.delete = function (req, res) {
  var squad = req.squad;

  squad.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(squad);
    }
  });
};

/**
 * List of Squads
 */
exports.list = function (req, res) {
  var probability = req.query.probability;
  var deepPopulate = req.query.deepPopulate;
  var query;
  if (req.query.outcomeTeamId)
    query = {outcomeTeam: req.query.outcomeTeamId};
  Squad.find(query).sort('-created').populate([ 'user', 'squadOwner', 'outcomeTeam', 'listName' ]).exec(function (err, squads) {
    var results = [];
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (deepPopulate) {
        Squad.deepPopulate(squads, [ 'outcomeTeam', 'outcomeTeam.businessUnit' ], function (err, _squads) {
          async.each(_squads, function (squad, cb) {
            populateSquad(squad, probability, function (squadObj) {
              results.push(squadObj);
              cb();
            });
          }, function (err) {
            res.jsonp(results);
          });

        });
      }
      else {
        Squad.deepPopulate(squads, [ 'outcomeTeam', 'outcomeTeam.businessUnit' ], function (err, _squads) {
          res.jsonp(_squads);
        });
      }

    }
  });
};

/**
 * Squad middleware
 */
exports.squadByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Squad is invalid'
    });
  }

  Squad.findById(id).populate([ 'user', 'squadOwner', 'outcomeTeam' ]).exec(function (err, squad) {
    if (err) {
      return next(err);
    } else if (!squad) {
      return res.status(404).send({
        message: 'No Squad with that identifier has been found'
      });
    }
    req.squad = squad;
    next();
  });
};

/*
 * get all the derived values for a squad
 * call cb with the populate values
 */
function populateSquad(squad, probability, cb) {
  if (probability)
    async.waterfall([
      getSquadCosts,
      getOpportunityValues,
      getProjectedProfit,
      getProducts,
      getNext12MonthsCost
    ], addSquadObjToResults);
  else
    async.waterfall([
      getSquadCosts,
      getNext12MonthsCost
    ], addSquadObjToResults);


  function getSquadCosts(callback) {
    squad.getSquadCosts(function (baseSquadCost, loadedSquadCost) {
      var squadObj = squad.toObject();  //Mongoose models are immutable
      squadObj.baseSquadCost = baseSquadCost;
      squadObj.loadedSquadCost = loadedSquadCost;
      callback(null, squadObj);
    });
  }

  function getOpportunityValues(squadObj, callback) {
    squad.getOpportunityValues(param1, probability);
    function param1(total, next12Months) {
      squadObj.totalOpportunityValue = total;
      squadObj.next12MonthsValue = next12Months;
      callback(null, squadObj);
    }
  }

  function getProjectedProfit(squadObj, callback) {
    squad.getProjectedProfit(param1, probability);
    function param1(profit) {
      squadObj.profit = profit;
      callback(null, squadObj);
    }
  }

  function getProducts(squadObj, callback) {
    squad.getProducts(function (products) {
      squadObj.products = products;
      callback(null, squadObj);
    });
  }

  function getNext12MonthsCost(squadObj, callback) {
    squad.next12MonthsCost(function (cost) {
      squadObj.next12MonthsCost = cost;
      callback(null, squadObj);
    });
  }

  function addSquadObjToResults(err, squadObj) {
    cb(squadObj);
  }

}


