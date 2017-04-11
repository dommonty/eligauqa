//Performancereviews service used to communicate Performancereviews REST endpoints
(function () {
  'use strict';

  angular
    .module('performancereviews')
    .factory('PerformancereviewsService', PerformancereviewsService);

  PerformancereviewsService.$inject = ['$resource'];

  function PerformancereviewsService($resource) {
    return $resource('api/performancereviews/:performancereviewId', {
      performancereviewId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
