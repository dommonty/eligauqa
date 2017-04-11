'use strict';

/**
 * Module dependencies
 */
var reviewrequestsPolicy = require('../policies/reviewrequests.server.policy'),
  reviewrequests = require('../controllers/reviewrequests.server.controller');

module.exports = function(app) {
  // Reviewrequests Routes
  app.route('/api/reviewrequests').all(reviewrequestsPolicy.isAllowed)
    .get(reviewrequests.list)
    .post(reviewrequests.create);

  app.route('/api/reviewrequests/:reviewrequestId').all(reviewrequestsPolicy.isAllowed)
    .get(reviewrequests.read)
    .put(reviewrequests.update)
    .delete(reviewrequests.delete);

  // Finish by binding the Reviewrequest middleware
  app.param('reviewrequestId', reviewrequests.reviewrequestByID);
};
