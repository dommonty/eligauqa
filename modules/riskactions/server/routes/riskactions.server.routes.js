'use strict';

/**
 * Module dependencies
 */
var riskactionsPolicy = require('../policies/riskactions.server.policy'),
  riskactions = require('../controllers/riskactions.server.controller');

module.exports = function(app) {
  // Riskactions Routes
  app.route('/api/riskactions').all(riskactionsPolicy.isAllowed)
    .get(riskactions.list)
    .post(riskactions.create);

  app.route('/api/riskactions/:riskactionId').all(riskactionsPolicy.isAllowed)
    .get(riskactions.read)
    .put(riskactions.update)
    .delete(riskactions.delete);

  // Finish by binding the Riskaction middleware
  app.param('riskactionId', riskactions.riskactionByID);
};
