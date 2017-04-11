//Riskactions service used to communicate Riskactions REST endpoints
(function () {
  'use strict';

  angular
    .module('riskactions')
    .factory('RiskactionsService', RiskactionsService);

  RiskactionsService.$inject = ['$resource'];

  function RiskactionsService($resource) {
    return $resource('api/riskactions/:riskactionId', {
      riskactionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
