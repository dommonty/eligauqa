'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Opportunityactions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/opportunityactions',
      permissions: '*'
    }, {
      resources: '/api/opportunityactions/:opportunityactionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/opportunityactions',
      permissions: ['get', 'post']
    }, {
      resources: '/api/opportunityactions/:opportunityactionId',
      permissions: ['*']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/opportunityactions',
      permissions: ['get']
    }, {
      resources: '/api/opportunityactions/:opportunityactionId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Opportunityactions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Opportunityaction is being processed and the current user created it then allow any manipulation
  if (req.opportunityaction && req.user && req.opportunityaction.user && req.opportunityaction.user.id === req.user.id) {
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
