(function () {
  'use strict';

  // Employees controller
  angular
    .module('employees')
    .controller('EmployeesController', EmployeesController);

  EmployeesController.$inject = [ '$scope', '$state', 'Authentication', 'employeeResolve', 'RolesService',
    'LocationsService', 'BusinessunitsService', 'Admin', 'EmployeesService', '$filter' ];

  function EmployeesController($scope, $state, Authentication, employee, RolesService,
                               LocationsService, BusinessunitsService, Admin, EmployeesService, $filter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.employee = employee;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.roles = RolesService.query();
    vm.locations = LocationsService.query();
    vm.businessUnits = BusinessunitsService.query();
    vm.users = Admin.query();


    // Remove existing Employee
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.employee.$remove($state.go('employees.list'));
      }
    }

    // Save Employee
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.employeeForm');
        return false;
      }
      if (vm.employee.systemUser === '')
        vm.employee.systemUser = null;

      // TODO: move create/update logic to service
      if (vm.employee._id) {
        vm.employee.$update(successCallback, errorCallback);
      } else {
        vm.employee.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('employees.view', {
          employeeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // EmployeesService.query().$promise.then(function (data) {
    //   vm.managers = data;
    // });


    EmployeesService.query().$promise.then(function (data) {
      vm.managers = $filter('filter')(data, {
        reviewer: true
      });
    });


  }
})();
