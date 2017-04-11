'use strict';

/**
 * Module dependencies
 */
var squadsPolicy = require('../policies/squads.server.policy'),
  squads = require('../controllers/squads.server.controller');

module.exports = function(app) {
  // Squads Routes
  app.route('/api/squads').all(squadsPolicy.isAllowed)
    .get(squads.list)
    .post(squads.create);

  app.route('/api/squads/:squadId').all(squadsPolicy.isAllowed)
    .get(squads.read)
    .put(squads.update)
    .delete(squads.delete);

  // Finish by binding the Squad middleware
  app.param('squadId', squads.squadByID);
};
