'use strict';

/**
 * Module dependencies
 */
var ceodiscountsPolicy = require('../policies/ceodiscounts.server.policy'),
  ceodiscounts = require('../controllers/ceodiscounts.server.controller');

module.exports = function(app) {
  // Ceodiscounts Routes
  app.route('/api/ceodiscounts').all(ceodiscountsPolicy.isAllowed)
    .get(ceodiscounts.list)
    .post(ceodiscounts.create);

  app.route('/api/ceodiscounts/:ceodiscountId').all(ceodiscountsPolicy.isAllowed)
    .get(ceodiscounts.read)
    .put(ceodiscounts.update)
    .delete(ceodiscounts.delete);

  // Finish by binding the Ceodiscount middleware
  app.param('ceodiscountId', ceodiscounts.ceodiscountByID);
};
