'use strict';

/**
 * Module dependencies
 */
var periodsPolicy = require('../policies/periods.server.policy'),
  periods = require('../controllers/periods.server.controller');

module.exports = function(app) {
  // Periods Routes
  app.route('/api/periods').all(periodsPolicy.isAllowed)
    .get(periods.list)
    .post(periods.create);

  app.route('/api/periods/:periodId').all(periodsPolicy.isAllowed)
    .get(periods.read)
    .put(periods.update)
    .delete(periods.delete);

  // Finish by binding the Period middleware
  app.param('periodId', periods.periodByID);
};
