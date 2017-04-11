'use strict';

/**
 * Module dependencies
 */
var outcomesPolicy = require('../policies/outcomes.server.policy'),
  outcomes = require('../controllers/outcomes.server.controller');

module.exports = function(app) {
  // Outcomes Routes
  app.route('/api/outcomes').all(outcomesPolicy.isAllowed)
    .get(outcomes.list)
    .post(outcomes.create);

  app.route('/api/outcomes/:outcomeId').all(outcomesPolicy.isAllowed)
    .get(outcomes.read)
    .put(outcomes.update)
    .delete(outcomes.delete);

  // Finish by binding the Outcome middleware
  app.param('outcomeId', outcomes.outcomeByID);
};
