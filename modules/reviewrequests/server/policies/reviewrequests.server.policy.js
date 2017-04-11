'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Reviewrequests Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/reviewrequests',
      permissions: '*'
    }, {
      resources: '/api/reviewrequests/:reviewrequestId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'user-restricted'],
    allows: [{
      resources: '/api/reviewrequests',
      permissions: ['get', 'post']
    }, {
      resources: '/api/reviewrequests/:reviewrequestId',
      permissions: ['get', 'put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/reviewrequests',
      permissions: ['get']
    }, {
      resources: '/api/reviewrequests/:reviewrequestId',
      permissions: ['get', 'put']
    }]
  }]);
};

/**
 * Check If Reviewrequests Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Reviewrequest is being processed and the current user created it then allow any manipulation
  if (req.reviewrequest && req.user && req.reviewrequest.user && req.reviewrequest.user.id === req.user.id) {
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
