'use strict';

/**
 * Module dependencies
 */
var squadoutcomesPolicy = require('../policies/squadoutcomes.server.policy'),
  squadoutcomes = require('../controllers/squadoutcomes.server.controller');

module.exports = function(app) {
  // Squadoutcomes Routes
  app.route('/api/squadoutcomes').all(squadoutcomesPolicy.isAllowed)
    .get(squadoutcomes.list)
    .post(squadoutcomes.create);

  app.route('/api/squadoutcomes/:squadoutcomeId').all(squadoutcomesPolicy.isAllowed)
    .get(squadoutcomes.read)
    .put(squadoutcomes.update)
    .delete(squadoutcomes.delete);

  // Finish by binding the Squadoutcome middleware
  app.param('squadoutcomeId', squadoutcomes.squadoutcomeByID);
};
