//Squadallocations service used to communicate Squadallocations REST endpoints
(function () {
  'use strict';

  angular
    .module('squadallocations')
    .factory('SquadallocationsService', SquadallocationsService);

  SquadallocationsService.$inject = ['$resource'];

  function SquadallocationsService($resource) {
    return $resource('api/squadallocations/:squadallocationId', {
      squadallocationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
