//Locations service used to communicate Locations REST endpoints
(function () {
  'use strict';

  angular
    .module('locations')
    .factory('LocationsService', LocationsService);

  LocationsService.$inject = ['$resource'];

  function LocationsService($resource) {
    return $resource('api/locations/:locationId', {
      locationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
