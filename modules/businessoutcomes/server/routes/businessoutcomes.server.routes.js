'use strict';

/**
 * Module dependencies
 */
var businessoutcomesPolicy = require('../policies/businessoutcomes.server.policy'),
  businessoutcomes = require('../controllers/businessoutcomes.server.controller');

module.exports = function(app) {
  // Businessoutcomes Routes
  app.route('/api/businessoutcomes').all(businessoutcomesPolicy.isAllowed)
    .get(businessoutcomes.list)
    .post(businessoutcomes.create);

  app.route('/api/businessoutcomes/:businessoutcomeId').all(businessoutcomesPolicy.isAllowed)
    .get(businessoutcomes.read)
    .put(businessoutcomes.update)
    .delete(businessoutcomes.delete);

  // Finish by binding the Businessoutcome middleware
  app.param('businessoutcomeId', businessoutcomes.businessoutcomeByID);
};
