'use strict';

/**
 * Module dependencies
 */
var packageofferingsPolicy = require('../policies/packageofferings.server.policy'),
  packageofferings = require('../controllers/packageofferings.server.controller');

module.exports = function(app) {
  // Packageofferings Routes
  app.route('/api/packageofferings').all(packageofferingsPolicy.isAllowed)
    .get(packageofferings.list)
    .post(packageofferings.create);

  app.route('/api/packageofferings/:packageofferingId').all(packageofferingsPolicy.isAllowed)
    .get(packageofferings.read)
    .put(packageofferings.update)
    .delete(packageofferings.delete);

  // Finish by binding the Packageoffering middleware
  app.param('packageofferingId', packageofferings.packageofferingByID);
};
