'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Performancereviews Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/performancereviews',
      permissions: '*'
    }, {
      resources: '/api/performancereviews/:performancereviewId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'user-restricted'],
    allows: [{
      resources: '/api/performancereviews',
      permissions: ['get', 'post']
    }, {
      resources: '/api/performancereviews/:performancereviewId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/performancereviews',
      permissions: ['get', 'post']
    }, {
      resources: '/api/performancereviews/:performancereviewId',
      permissions: ['get', 'put', 'delete']
    }]
  }]);
};

/**
 * Check If Performancereviews Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : [''];

  // If an Performancereview is being processed and the current user created it then allow any manipulation
  if (req.performancereview && req.user && req.performancereview.user && req.performancereview.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
