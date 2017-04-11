'use strict';

/**
 * Module dependencies
 */
var businessunitsPolicy = require('../policies/businessunits.server.policy'),
  businessunits = require('../controllers/businessunits.server.controller');

module.exports = function (app) {
  // Businessunits Routes
  app.route('/api/businessunits').all(businessunitsPolicy.isAllowed)
    .get(businessunits.list)
    .post(businessunits.create);

  app.route('/api/businessunits/:businessunitId').all(businessunitsPolicy.isAllowed)
    .get(businessunits.read)
    .put(businessunits.update)
    .delete(businessunits.delete);

  //send the file of employees to import to the database
  app.route('/api/import-employees').all(businessunitsPolicy.isAllowed)
    .post(businessunits.createFromArray);

  // Finish by binding the Businessunit middleware
  app.param('businessunitId', businessunits.businessunitByID);
};
