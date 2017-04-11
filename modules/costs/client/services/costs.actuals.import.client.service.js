(function () {
  'use strict';

  angular.module('costs')
    .factory('CostActualsImportFactory', [ '$http', CostActualsImportFactory ]);

  function CostActualsImportFactory($http) {
    var costActualsFactory = {};

    costActualsFactory.sendCsvEntries = function (contents, callback) {
      return $http.post('/api/import-costs-actuals', {
        'csv': contents
      })
        .then(function successCallback(response) {
          console.log(response.data.message);
          callback({
            status: response.status,
            message: response.data.message
          });
        }, function errorCallback(response) {
          console.log('error callback called');
          console.log(response.data.message);
          callback({
            status: response.status,
            message: response.data.message
          });
        });
    };
    return costActualsFactory;
  }
})();
