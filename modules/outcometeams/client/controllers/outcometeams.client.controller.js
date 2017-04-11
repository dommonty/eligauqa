(function () {
  'use strict';

  // Outcometeams controller
  angular
    .module('outcometeams')
    .controller('OutcometeamsController', OutcometeamsController);

  OutcometeamsController.$inject = [ '$scope', '$state', 'Authentication', 'outcometeamResolve', 'BusinessunitsService',
    'EmployeesService', '$stateParams' ];

  function OutcometeamsController($scope, $state, Authentication, outcometeam, BusinessunitsService,
                                  EmployeesService, $stateParams) {
    var vm = this;

    vm.authentication = Authentication;
    vm.outcometeam = outcometeam;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.businessUnits = BusinessunitsService.query();
    vm.employees = EmployeesService.query();

    console.log('probability = ' + $stateParams.probability);

    // Remove existing Outcometeam
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.outcometeam.$remove($state.go('outcometeams.list'));
      }
    }

    // Save Outcometeam
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.outcometeamForm');
        return false;
      }

      if (!vm.outcometeam.outcomeOwner._id) {
        console.log(vm.outcometeam.outcomeOwner);
        vm.error = 'Please select Outcome Owner from the type ahead';
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.outcometeam._id) {
        vm.outcometeam.$update(successCallback, errorCallback);
      } else {
        vm.outcometeam.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('outcometeams.view', {
          outcometeamId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
