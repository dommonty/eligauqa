'use strict';

/**
 * Module dependencies
 */
var regionsPolicy = require('../policies/regions.server.policy'),
  regions = require('../controllers/regions.server.controller');

module.exports = function(app) {
  // Regions Routes
  app.route('/api/regions').all(regionsPolicy.isAllowed)
    .get(regions.list)
    .post(regions.create);

  app.route('/api/regions/:regionId').all(regionsPolicy.isAllowed)
    .get(regions.read)
    .put(regions.update)
    .delete(regions.delete);

  // Finish by binding the Region middleware
  app.param('regionId', regions.regionByID);
};
