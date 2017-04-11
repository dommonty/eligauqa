'use strict';

/**
 * Module dependencies
 */
var revenueallocationsPolicy = require('../policies/revenueallocations.server.policy'),
  revenueallocations = require('../controllers/revenueallocations.server.controller');

module.exports = function(app) {
  // Revenueallocations Routes
  app.route('/api/revenueallocations').all(revenueallocationsPolicy.isAllowed)
    .get(revenueallocations.list)
    .post(revenueallocations.create);

  app.route('/api/revenueallocations/:revenueallocationId').all(revenueallocationsPolicy.isAllowed)
    .get(revenueallocations.read)
    .put(revenueallocations.update)
    .delete(revenueallocations.delete);

  // Finish by binding the Revenueallocation middleware
  app.param('revenueallocationId', revenueallocations.revenueallocationByID);
};
