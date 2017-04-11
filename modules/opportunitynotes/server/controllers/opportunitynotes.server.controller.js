'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Opportunitynote = mongoose.model('Opportunitynote'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Opportunitynote
 */
exports.create = function(req, res) {
  var opportunitynote = new Opportunitynote(req.body);
  opportunitynote.user = req.user;

  opportunitynote.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunitynote);
    }
  });
};

/**
 * Show the current Opportunitynote
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var opportunitynote = req.opportunitynote ? req.opportunitynote.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  opportunitynote.isCurrentUserOwner = req.user && opportunitynote.user && opportunitynote.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(opportunitynote);
};

/**
 * Update a Opportunitynote
 */
exports.update = function(req, res) {
  var opportunitynote = req.opportunitynote ;

  opportunitynote = _.extend(opportunitynote , req.body);

  opportunitynote.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunitynote);
    }
  });
};

/**
 * Delete an Opportunitynote
 */
exports.delete = function(req, res) {
  var opportunitynote = req.opportunitynote ;

  opportunitynote.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunitynote);
    }
  });
};

/**
 * List of Opportunitynotes
 */
exports.list = function(req, res) {
  var opportunityId = req.query.opportunityId;
  Opportunitynote.find({ opportunity: opportunityId }).sort('-created').populate('user', 'displayName').exec(function(err, opportunitynotes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(opportunitynotes);
    }
  });
};

/**
 * Opportunitynote middleware
 */
exports.opportunitynoteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Opportunitynote is invalid'
    });
  }

  Opportunitynote.findById(id).populate('user', 'displayName').exec(function (err, opportunitynote) {
    if (err) {
      return next(err);
    } else if (!opportunitynote) {
      return res.status(404).send({
        message: 'No Opportunitynote with that identifier has been found'
      });
    }
    req.opportunitynote = opportunitynote;
    next();
  });
};
