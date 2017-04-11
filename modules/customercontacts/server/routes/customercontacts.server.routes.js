'use strict';

/**
 * Module dependencies
 */
var customercontactsPolicy = require('../policies/customercontacts.server.policy'),
  customercontacts = require('../controllers/customercontacts.server.controller');

module.exports = function(app) {
  // Customercontacts Routes
  app.route('/api/customercontacts').all(customercontactsPolicy.isAllowed)
    .get(customercontacts.list)
    .post(customercontacts.create);

  app.route('/api/customercontacts/:customercontactId').all(customercontactsPolicy.isAllowed)
    .get(customercontacts.read)
    .put(customercontacts.update)
    .delete(customercontacts.delete);

  // Finish by binding the Customercontact middleware
  app.param('customercontactId', customercontacts.customercontactByID);
};
