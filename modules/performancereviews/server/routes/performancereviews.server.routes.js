'use strict';

/**
 * Module dependencies
 */
var performancereviewsPolicy = require('../policies/performancereviews.server.policy'),
  performancereviews = require('../controllers/performancereviews.server.controller');

module.exports = function(app) {
  // Performancereviews Routes
  app.route('/api/performancereviews').all(performancereviewsPolicy.isAllowed)
    .get(performancereviews.list)
    .post(performancereviews.create);

  app.route('/api/performancereviews/:performancereviewId').all(performancereviewsPolicy.isAllowed)
    .get(performancereviews.read)
    .put(performancereviews.update)
    .delete(performancereviews.delete);

  // Finish by binding the Performancereview middleware
  app.param('performancereviewId', performancereviews.performancereviewByID);
};
