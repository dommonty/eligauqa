'use strict';

/**
 * Module dependencies
 */
var opportunitynotesPolicy = require('../policies/opportunitynotes.server.policy'),
  opportunitynotes = require('../controllers/opportunitynotes.server.controller');

module.exports = function(app) {
  // Opportunitynotes Routes
  app.route('/api/opportunitynotes').all(opportunitynotesPolicy.isAllowed)
    .get(opportunitynotes.list)
    .post(opportunitynotes.create);

  app.route('/api/opportunitynotes/:opportunitynoteId').all(opportunitynotesPolicy.isAllowed)
    .get(opportunitynotes.read)
    .put(opportunitynotes.update)
    .delete(opportunitynotes.delete);

  // Finish by binding the Opportunitynote middleware
  app.param('opportunitynoteId', opportunitynotes.opportunitynoteByID);
};
