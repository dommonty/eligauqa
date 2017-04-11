(function () {
  'use strict';

  angular
    .module('employees')
    .controller('EmployeesListController', EmployeesListController);

  EmployeesListController.$inject = [ 'EmployeesService', '$rootScope', '$state', 'SquadallocationsService', 'BusinessunitsService' ];

  function EmployeesListController(EmployeesService, $rootScope, $state, SquadallocationsService, BusinessunitsService) {
    var vm = this;

    vm.displayedValues = [];
    vm.employeeListMenuCallback = employeeListMenuCallback;
    vm.openEmployeeView = openEmployeeView;

    vm.businessUnits = BusinessunitsService.query();

    vm.businessUnitChanged = function () {
      vm.displayedValues.splice(0, vm.displayedValues.length);
      vm.showSpinner = true;
      EmployeesService.query({ businessUnitId: vm.businessUnit._id }).$promise.then(function (data) {
        for (var i = 0; i < data.length; i++) {
          var tableEntry = {};
          var eachEmployee = data[ i ];

          tableEntry[ 0 ] = eachEmployee.nickName ? eachEmployee.name + '(' + eachEmployee.nickName + ')' : eachEmployee.name;
          tableEntry[ 1 ] = eachEmployee.role.name;
          tableEntry[ 2 ] = eachEmployee.otherRole ? eachEmployee.otherRole.name : '';
          tableEntry[ 3 ] = eachEmployee.businessUnit.name;
          tableEntry[ 4 ] = getSquadAllocationDisplay(eachEmployee.allocations);
          tableEntry[ 5 ] = eachEmployee.location.name;
          tableEntry[ 6 ] = eachEmployee.reportingManager ? eachEmployee.reportingManager.name : 'Squad Owner';
          tableEntry._id = eachEmployee._id;
          vm.displayedValues.push(tableEntry);
        }
        $rootScope.$broadcast('RefreshSearchTable');
        vm.showSpinner = false;
      });
    };

    function getSquadAllocationDisplay(allocations) {
      var squadNameArray = [];
      angular.forEach(allocations, function (eachAllocation) {
        squadNameArray.push(eachAllocation.squad.name);
      });
      return squadNameArray.join();
    }

    function getSquadOwner(allocations) {
      return allocations.length === 1 ? allocations[ 0 ].employee.name : '';
    }

    vm.employeeListTitles = [ 'Name', 'Role', 'Other Role', 'Business Unit', 'Squad', 'Location', 'Reporting Manager' ];

    function employeeListMenuCallback(action, tableEntry) {
      if (action === 'View') {
        $state.go('employees.view', {
          employeeId: tableEntry._id
        });
      }
      if (action === 'Edit') {
        $state.go('employees.edit', {
          employeeId: tableEntry._id
        });
      }
    }

    function openEmployeeView(tableEntry) {
      $state.go('employees.view', {
        employeeId: tableEntry._id
      });
    }

  }
})();
