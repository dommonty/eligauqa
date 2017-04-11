//Costs service used to communicate Costs REST endpoints
(function () {
  'use strict';

  angular
    .module('costs')
    .factory('CostsService', CostsService);

  CostsService.$inject = ['$resource'];

  function CostsService($resource) {
    return $resource('api/costs/:costId', {
      costId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
