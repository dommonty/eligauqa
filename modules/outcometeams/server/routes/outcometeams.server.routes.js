'use strict';

/**
 * Module dependencies
 */
var outcometeamsPolicy = require('../policies/outcometeams.server.policy'),
  outcometeams = require('../controllers/outcometeams.server.controller');

module.exports = function (app) {
  // Outcometeams Routes
  app.route('/api/outcometeams').all(outcometeamsPolicy.isAllowed)
    .get(outcometeams.list)
    .post(outcometeams.create);

  app.route('/api/outcometeams/:outcometeamId').all(outcometeamsPolicy.isAllowed)
    .get(outcometeams.read)
    .put(outcometeams.update)
    .delete(outcometeams.delete);
  
  // Finish by binding the Outcometeam middleware
  app.param('outcometeamId', outcometeams.outcometeamByID);
};
