(function () {
  'use strict';

  // Squadallocations controller
  angular
    .module('squadallocations')
    .controller('SquadallocationsController', SquadallocationsController);

  SquadallocationsController.$inject = [ '$scope', '$state', 'Authentication', 'squadallocationResolve', '$stateParams',
    'EmployeesService', 'SquadsService' ];

  function SquadallocationsController($scope, $state, Authentication, squadallocation, $stateParams,
                                      EmployeesService, SquadsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.squadallocation = squadallocation;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.employee = EmployeesService.get({
      employeeId: $stateParams.employeeId
    });

    if (vm.squadallocation.squad)
      vm.squad = SquadsService.get({squadId: vm.squadallocation.squad._id});

    if (!vm.squadallocation._id) {
      vm.squadallocation.allocation = 100;
      vm.squadallocation.employee = vm.employee;
    }

    SquadsService.query().$promise.then(function (squads) {
      vm.squads = [];
      for (var i = 0; i < squads.length; i++) {
        var eachSquad = squads[ i ];
        if (eachSquad.outcomeTeam.businessUnit._id === vm.employee.businessUnit._id)
          vm.squads.push(eachSquad);
      }
    });


    // Remove existing Squadallocation
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.squadallocation.$remove($state.go('squadallocations.list'));
      }
    }

    // Save Squadallocation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.squadallocationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.squadallocation._id) {
        vm.squadallocation.$update(successCallback, errorCallback);
      } else {
        vm.squadallocation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('squadallocations.view', {
          squadallocationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
