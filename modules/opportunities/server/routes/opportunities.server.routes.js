'use strict';

/**
 * Module dependencies
 */
var opportunitiesPolicy = require('../policies/opportunities.server.policy'),
  opportunities = require('../controllers/opportunities.server.controller');

module.exports = function(app) {
  // Opportunities Routes
  app.route('/api/opportunities').all(opportunitiesPolicy.isAllowed)
    .get(opportunities.list)
    .post(opportunities.create);

  app.route('/api/opportunities/:opportunityId').all(opportunitiesPolicy.isAllowed)
    .get(opportunities.read)
    .put(opportunities.update)
    .delete(opportunities.delete);

  //send the file of opportunity actuals to import to the database
  app.route('/api/import-opportunities-actuals').all(opportunitiesPolicy.isAllowed)
    .post(opportunities.createFromArray);

  // Finish by binding the Opportunity middleware
  app.param('opportunityId', opportunities.opportunityByID);
};
