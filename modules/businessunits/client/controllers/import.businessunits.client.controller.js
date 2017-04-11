(function () {
  'use strict';

  // Businessunits import controller
  angular
    .module('businessunits')
    .controller('BusinessunitsImportController', BusinessunitsImportController);

  BusinessunitsImportController.$inject = [ '$scope', '$window', '$timeout', '$state', 'Authentication', 'businessunitResolve',
    'EmployeesImportFactory', 'LocationsService', 'RolesService' ];

  function BusinessunitsImportController($scope, $window, $timeout, $state, Authentication, businessunit,
                                         EmployeesImportFactory, LocationsService, RolesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.businessunit = businessunit;
    vm.locations = LocationsService.query();
    vm.roles = RolesService.query();


    vm.csv = {
      content: null,
      header: true,
      headerVisible: true,
      separator: ',',
      separatorVisible: true,
      result: null,
      //encoding: 'ISO-8859-1',
      encodingVisible: false,
      uploadButtonLabel: 'upload a csv file with employee entries',
      accept: '.csv'

    };

    // Send the csv file to the server Add extra fiels to employee name and salary which are in the imported file
    vm.uploadCSVEntries = function () {
      console.log(vm.csv.result);
      for (var i = 0; i < vm.csv.result.length; i++) {
        vm.csv.result[ i ].role = vm.role._id;
        vm.csv.result[ i ].location = vm.location._id;
        vm.csv.result[ i ].businessUnit = vm.businessunit._id;
        vm.csv.result[ i ].user = vm.authentication.user._id;
        console.log(vm.csv.result[ i ]);
      }
      vm.success = vm.error = null;
      EmployeesImportFactory.sendCsvEntries(vm.csv.result, function (response) {
        if (response.status === 200) {
          vm.success = true;
        } else {
          vm.error = 'Upload failed: ' + response.message;
        }
      });
    };


  }
})();
