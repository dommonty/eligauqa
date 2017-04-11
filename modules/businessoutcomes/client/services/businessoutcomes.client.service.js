//Businessoutcomes service used to communicate Businessoutcomes REST endpoints
(function () {
  'use strict';

  angular
    .module('businessoutcomes')
    .factory('BusinessoutcomesService', BusinessoutcomesService);

  BusinessoutcomesService.$inject = ['$resource'];

  function BusinessoutcomesService($resource) {
    return $resource('api/businessoutcomes/:businessoutcomeId', {
      businessoutcomeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
