(function () {
  'use strict';

  angular.module('opportunities')
    .factory('OpportunityActualsImportFactory', [ '$http', OpportunityActualsImportFactory ]);

  function OpportunityActualsImportFactory($http) {
    var opportunityActualsFactory = {};

    opportunityActualsFactory.sendCsvEntries = function (contents, callback) {
      return $http.post('/api/import-opportunities-actuals', {
        'csv': contents
      })
        .then(function successCallback(response) {
          callback({
            status: response.status,
            message: response.data.message
          });
        }, function errorCallback(response) {
          callback({
            status: response.status,
            message: response.data.message
          });
        });
    };
    return opportunityActualsFactory;
  }
})();
