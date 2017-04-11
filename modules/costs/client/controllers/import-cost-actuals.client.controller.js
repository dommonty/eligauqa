(function () {
  'use strict';

  angular
    .module('costs')
    .controller('ImportCostActualsController', ImportCostActualsController);

  ImportCostActualsController.$inject = [ '$scope', 'BusinessunitsService', 'CostActualsImportFactory', '$moment' ];

  function ImportCostActualsController($scope, BusinessunitsService, CostActualsImportFactory, $moment) {
    var vm = this;


    init();

    function init() {
      vm.businessUnits = BusinessunitsService.query();
      vm.businessUnit = null;
      vm.csv = {
        content: null,
        header: true,
        headerVisible: true,
        separator: ',',
        separatorVisible: true,
        result: null,
        //encoding: 'ISO-8859-1',
        encodingVisible: false,
        uploadButtonLabel: 'upload a csv file with actual cost entries',
        accept: '.csv'

      };

      // Send the csv file to the server
      vm.uploadCSVEntries = function () {
        for (var i = 0; i < vm.csv.result.length; i++) {
          vm.csv.result[ i ].actualMonth = vm.actualMonth;
        }
        vm.success = vm.error = null;
        CostActualsImportFactory.sendCsvEntries(vm.csv.result, function (response) {
          if (response.status === 200) {
            vm.success = true;
            init();
          } else {
            vm.error = 'Upload failed! Some actuals may have been imported.  Please verify carefully by going to the cost actuals view before loading again : ' + response.message;
          }
        });
      };
    }

    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];

    vm.actualMonth = $moment(Date.now()).subtract(1, 'M').toDate();

    vm.dateOptions = {
      maxDate: Date.now()
    };

    vm.openCalendar = function () {
      vm.isCalendarOpen = true;
    };
  }
})();
