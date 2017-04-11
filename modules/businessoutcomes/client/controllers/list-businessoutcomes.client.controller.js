(function () {
  'use strict';

  angular
    .module('businessoutcomes')
    .controller('BusinessoutcomesListController', BusinessoutcomesListController);

  BusinessoutcomesListController.$inject = [ 'BusinessoutcomesService', 'businessUnitResolve', 'PeriodsService', '$filter' ];

  function BusinessoutcomesListController(BusinessoutcomesService, businessUnitResolve, PeriodsService, $filter) {
    var vm = this;

    vm.businessUnit = businessUnitResolve;
    vm.businessoutcomes = [];
    vm.periods = PeriodsService.query();
    vm.periodChanged = periodChanged;
    vm.filteredItems = [];

    BusinessoutcomesService.query().$promise.then(function (allOutcomes) {
      angular.forEach(allOutcomes, function (eachOutcome) {
        if (eachOutcome.businessUnit._id === vm.businessUnit._id) {
          vm.businessoutcomes.push(eachOutcome);
          vm.filteredItems.push(eachOutcome);
        }
      });
    });

    function periodChanged() {
      vm.filteredItems = $filter('filter')(vm.businessoutcomes, {
        businessPeriod: {
          _id: vm.businessPeriod._id
        }
      });
    }
  }
})();
