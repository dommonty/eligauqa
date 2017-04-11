'use strict';

/**
 * Module dependencies
 */
var supportplansPolicy = require('../policies/supportplans.server.policy'),
  supportplans = require('../controllers/supportplans.server.controller');

module.exports = function(app) {
  // Supportplans Routes
  app.route('/api/supportplans').all(supportplansPolicy.isAllowed)
    .get(supportplans.list)
    .post(supportplans.create);

  app.route('/api/supportplans/:supportplanId').all(supportplansPolicy.isAllowed)
    .get(supportplans.read)
    .put(supportplans.update)
    .delete(supportplans.delete);

  // Finish by binding the Supportplan middleware
  app.param('supportplanId', supportplans.supportplanByID);
};
