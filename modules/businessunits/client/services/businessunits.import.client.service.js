(function () {
  'use strict';

  angular.module('businessunits')
    .factory('EmployeesImportFactory', [ '$http', EmployeesImportFactory ]);

  function EmployeesImportFactory($http) {
    var employeeFactory = {};

    employeeFactory.sendCsvEntries = function (contents, callback) {
      return $http.post('/api/import-employees', {
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
    return employeeFactory;
  }
})();
