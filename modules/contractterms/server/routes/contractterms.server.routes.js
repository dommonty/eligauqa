'use strict';

/**
 * Module dependencies
 */
var contracttermsPolicy = require('../policies/contractterms.server.policy'),
  contractterms = require('../controllers/contractterms.server.controller');

module.exports = function(app) {
  // Contractterms Routes
  app.route('/api/contractterms').all(contracttermsPolicy.isAllowed)
    .get(contractterms.list)
    .post(contractterms.create);

  app.route('/api/contractterms/:contracttermId').all(contracttermsPolicy.isAllowed)
    .get(contractterms.read)
    .put(contractterms.update)
    .delete(contractterms.delete);

  // Finish by binding the Contractterm middleware
  app.param('contracttermId', contractterms.contracttermByID);
};
