'use strict';

/**
 * Module dependencies
 */
var approvalsPolicy = require('../policies/approvals.server.policy'),
  approvals = require('../controllers/approvals.server.controller');

module.exports = function(app) {
  // Approvals Routes
  app.route('/api/approvals').all(approvalsPolicy.isAllowed)
    .get(approvals.list)
    .post(approvals.create);

  app.route('/api/approvals/:approvalId').all(approvalsPolicy.isAllowed)
    .get(approvals.read)
    .put(approvals.update)
    .delete(approvals.delete);

  // Finish by binding the Approval middleware
  app.param('approvalId', approvals.approvalByID);
};
