'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Customercontacts Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/customercontacts',
      permissions: '*'
    }, {
      resources: '/api/customercontacts/:customercontactId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/customercontacts',
      permissions: ['get', 'post']
    }, {
      resources: '/api/customercontacts/:customercontactId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/customercontacts',
      permissions: ['get']
    }, {
      resources: '/api/customercontacts/:customercontactId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Customercontacts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Customercontact is being processed and the current user created it then allow any manipulation
  if (req.customercontact && req.user && req.customercontact.user && req.customercontact.user.id === req.user.id) {
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
