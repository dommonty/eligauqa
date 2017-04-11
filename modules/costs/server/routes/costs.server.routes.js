'use strict';

/**
 * Module dependencies
 */
var costsPolicy = require('../policies/costs.server.policy'),
  costs = require('../controllers/costs.server.controller');

module.exports = function(app) {
  // Costs Routes
  app.route('/api/costs').all(costsPolicy.isAllowed)
    .get(costs.list)
    .post(costs.create);

  app.route('/api/costs/:costId').all(costsPolicy.isAllowed)
    .get(costs.read)
    .put(costs.update)
    .delete(costs.delete);

  //send the file of cost actuals to import to the database
  app.route('/api/import-costs-actuals').all(costsPolicy.isAllowed)
    .post(costs.createFromArray);

  // Finish by binding the Cost middleware
  app.param('costId', costs.costByID);
};
