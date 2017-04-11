'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Businessunits Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([ {
    roles: [ 'admin' ],
    allows: [ {
      resources: '/api/businessunits',
      permissions: '*'
    }, {
      resources: '/api/businessunits/:businessunitId',
      permissions: '*'
    } ]
  }, {
    roles: [ 'user' ],
    allows: [ {
      resources: '/api/businessunits',
      permissions: [ 'get', 'post' ]
    }, {
      resources: '/api/businessunits/:businessunitId',
      permissions: [ 'get' ]
    }, {
      resources: '/api/import-employees',
      permissions: [ 'post' ]
    } ]
  }, {
    roles: [ 'guest' ],
    allows: [ {
      resources: '/api/businessunits',
      permissions: [ 'get' ]
    }, {
      resources: '/api/businessunits/:businessunitId',
      permissions: [ 'get' ]
    } ]
  } ]);
};

/**
 * Check If Businessunits Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : [ 'guest' ];

  // If an Businessunit is being processed and the current user created it then allow any manipulation
  if (req.businessunit && req.user && req.businessunit.user && req.businessunit.user.id === req.user.id) {
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
