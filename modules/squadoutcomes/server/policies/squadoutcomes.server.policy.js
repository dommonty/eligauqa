'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Squadoutcomes Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/squadoutcomes',
      permissions: '*'
    }, {
      resources: '/api/squadoutcomes/:squadoutcomeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/squadoutcomes',
      permissions: ['get', 'post']
    }, {
      resources: '/api/squadoutcomes/:squadoutcomeId',
      permissions: ['get', 'put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/squadoutcomes',
      permissions: ['get']
    }, {
      resources: '/api/squadoutcomes/:squadoutcomeId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Squadoutcomes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Squadoutcome is being processed and the current user created it then allow any manipulation
  if (req.squadoutcome && req.user && req.squadoutcome.user && req.squadoutcome.user.id === req.user.id) {
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
