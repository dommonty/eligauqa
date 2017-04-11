'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Squadallocation = mongoose.model('Squadallocation'),
  Squad = mongoose.model('Squad'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  moment = require('moment'),
  _ = require('lodash');

/**
 * Create a Squadallocation
 */
exports.create = function (req, res) {
  var squadallocation = new Squadallocation(req.body);
  squadallocation.user = req.user;
  saveSquadActuals(squadallocation, function (err) {
    if (err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    else {
      squadallocation.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(squadallocation);
        }
      });
    }
  });
};

/**
 * Show the current Squadallocation
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var squadallocation = req.squadallocation ? req.squadallocation.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  squadallocation.isCurrentUserOwner = req.user && squadallocation.user && squadallocation.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(squadallocation);
};

/**
 * Update a Squadallocation
 */
exports.update = function (req, res) {
  var squadallocation = req.squadallocation;

  squadallocation = _.extend(squadallocation, req.body);
  saveSquadActuals(squadallocation, function (err) {
    if (err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    else {
      squadallocation.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(squadallocation);
        }
      });
    }
  });
};

/*
 * Save the actuals of a squad when the allocation is modified
 */
function saveSquadActuals(squadAllocation, callback) {
  var squadB = squadAllocation.squad;

  Squad.findById(squadB._id ? squadB._id : squadB).exec(function (err, _squad) {
    if (err) {
      return callback(err);
    } else {
      _squad.getSquadCosts(function (baseSquadCost, loadedSquadCost) {
        var today = moment(new Date());
        for (var i = 0; i < _squad.actuals.length; i++) {
          if (today.isSame(_squad.actuals[ i ].dateCreated, 'month'))
            _squad.actuals.splice(i);
        } //only keep one entry per month, the latest one
        _squad.actuals.push({
          dateCreated: new Date(),
          amount: baseSquadCost / 12,
          description: 'Squad allocation changed'
        });

        _squad.save(function (err) {
          if (err) {
            return callback(err);
          } else {
            return callback();
          }
        });
      });
    }
  });
}

/**
 * Delete an Squadallocation
 */
exports.delete = function (req, res) {
  var squadallocation = req.squadallocation;

  saveSquadActuals(squadallocation, function (err) {
    if (err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    else {
      squadallocation.remove(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(squadallocation);
        }
      });
    }
  });
};

/**
 * List of Squadallocations
 */
exports.list = function (req, res) {
  var query;

  if (req.query.employeeId)
    query = {
      employee: req.query.employeeId
    };

  if (req.query.squadId) {
    if (query)
      query.squad = req.query.squadId;
    else
      query = {
        squad: req.query.squadId
      };
  }


  Squadallocation.find(query).sort('-created').populate([ 'user', 'squad', 'employee' ]).exec(function (err, squadallocations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(squadallocations);
    }
  });
};

/**
 * Squadallocation middleware
 */
exports.squadallocationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Squadallocation is invalid'
    });
  }

  Squadallocation.findById(id).populate([ 'user', 'squad', 'employee' ]).exec(function (err, squadallocation) {
    if (err) {
      return next(err);
    } else if (!squadallocation) {
      return res.status(404).send({
        message: 'No Squadallocation with that identifier has been found'
      });
    }
    req.squadallocation = squadallocation;
    next();
  });
};
