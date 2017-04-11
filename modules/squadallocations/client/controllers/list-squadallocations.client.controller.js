(function () {
  'use strict';

  angular
    .module('squadallocations')
    .controller('SquadallocationsListController', SquadallocationsListController);

  SquadallocationsListController.$inject = [ 'SquadallocationsService', '$stateParams', 'EmployeesService' ];

  function SquadallocationsListController(SquadallocationsService, $stateParams, EmployeesService) {
    var vm = this;

    vm.employee = EmployeesService.get({
      employeeId: $stateParams.employeeId
    });


    vm.squadallocations = SquadallocationsService.query({employeeId: $stateParams.employeeId});
  }
})();
