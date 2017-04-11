//Periods service used to communicate Periods REST endpoints
(function () {
  'use strict';

  angular
    .module('periods')
    .factory('PeriodsService', PeriodsService);

  PeriodsService.$inject = ['$resource'];

  function PeriodsService($resource) {
    return $resource('api/periods/:periodId', {
      periodId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
