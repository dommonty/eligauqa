//Costallocations service used to communicate Costallocations REST endpoints
(function () {
  'use strict';

  angular
    .module('costallocations')
    .factory('CostallocationsService', CostallocationsService);

  CostallocationsService.$inject = ['$resource'];

  function CostallocationsService($resource) {
    return $resource('api/costallocations/:costallocationId', {
      costallocationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
