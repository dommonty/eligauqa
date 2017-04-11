'use strict';

/**
 * Module dependencies
 */
var opportunityactionsPolicy = require('../policies/opportunityactions.server.policy'),
  opportunityactions = require('../controllers/opportunityactions.server.controller');

module.exports = function(app) {
  // Opportunityactions Routes
  app.route('/api/opportunityactions').all(opportunityactionsPolicy.isAllowed)
    .get(opportunityactions.list)
    .post(opportunityactions.create);

  app.route('/api/opportunityactions/:opportunityactionId').all(opportunityactionsPolicy.isAllowed)
    .get(opportunityactions.read)
    .put(opportunityactions.update)
    .delete(opportunityactions.delete);

  // Finish by binding the Opportunityaction middleware
  app.param('opportunityactionId', opportunityactions.opportunityactionByID);
};
