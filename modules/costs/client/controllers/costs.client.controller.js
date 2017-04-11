(function () {
  'use strict';

  // Costs controller
  angular
    .module('costs')
    .controller('CostsController', CostsController);

  CostsController.$inject = [ '$scope', '$state', 'Authentication', 'costResolve', 'BusinessunitsService',
    'ContracttermsService' ];

  function CostsController($scope, $state, Authentication, cost, BusinessunitsService,
                           ContracttermsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.cost = cost;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.businessUnits = BusinessunitsService.query();
    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];
    vm.contractTerms = ContracttermsService.query();


    if (vm.cost._id)
      vm.cost.forecastSeries.date = new Date(vm.cost.forecastSeries.date); //ui-date-picker expects a JS Date not a string

    // Remove existing Cost
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.cost.$remove($state.go('costs.list'));
      }
    }

    // Save Cost
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.costForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cost._id) {
        vm.cost.$update(successCallback, errorCallback);
      } else {
        vm.cost.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('costs.view', {
          costId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.openCalendar = function () {
      vm.isCalendarOpen = true;
    };

  }
})();
