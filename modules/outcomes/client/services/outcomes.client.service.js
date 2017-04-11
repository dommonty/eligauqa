//Outcomes service used to communicate Outcomes REST endpoints
(function () {
  'use strict';

  angular
    .module('outcomes')
    .factory('OutcomesService', OutcomesService);

  OutcomesService.$inject = ['$resource'];

  function OutcomesService($resource) {
    return $resource('api/outcomes/:outcomeId', {
      outcomeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
