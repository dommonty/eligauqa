'use strict';

/**
 * Module dependencies
 */
var costallocationsPolicy = require('../policies/costallocations.server.policy'),
  costallocations = require('../controllers/costallocations.server.controller');

module.exports = function(app) {
  // Costallocations Routes
  app.route('/api/costallocations').all(costallocationsPolicy.isAllowed)
    .get(costallocations.list)
    .post(costallocations.create);

  app.route('/api/costallocations/:costallocationId').all(costallocationsPolicy.isAllowed)
    .get(costallocations.read)
    .put(costallocations.update)
    .delete(costallocations.delete);

  // Finish by binding the Costallocation middleware
  app.param('costallocationId', costallocations.costallocationByID);
};
