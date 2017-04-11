//Regions service used to communicate Regions REST endpoints
(function () {
  'use strict';

  angular
    .module('regions')
    .factory('RegionsService', RegionsService);

  RegionsService.$inject = ['$resource'];

  function RegionsService($resource) {
    return $resource('api/regions/:regionId', {
      regionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
