//Revenueallocations service used to communicate Revenueallocations REST endpoints
(function () {
  'use strict';

  angular
    .module('revenueallocations')
    .factory('RevenueallocationsService', RevenueallocationsService);

  RevenueallocationsService.$inject = ['$resource'];

  function RevenueallocationsService($resource) {
    return $resource('api/revenueallocations/:revenueallocationId', {
      revenueallocationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
