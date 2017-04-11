'use strict';

/**
 * Module dependencies
 */
var squadallocationsPolicy = require('../policies/squadallocations.server.policy'),
  squadallocations = require('../controllers/squadallocations.server.controller');

module.exports = function(app) {
  // Squadallocations Routes
  app.route('/api/squadallocations').all(squadallocationsPolicy.isAllowed)
    .get(squadallocations.list)
    .post(squadallocations.create);

  app.route('/api/squadallocations/:squadallocationId').all(squadallocationsPolicy.isAllowed)
    .get(squadallocations.read)
    .put(squadallocations.update)
    .delete(squadallocations.delete);

  // Finish by binding the Squadallocation middleware
  app.param('squadallocationId', squadallocations.squadallocationByID);
};
