(function () {
  'use strict';

  // Squads controller
  angular
    .module('squads')
    .controller('SquadsController', SquadsController);

  SquadsController.$inject = [ '$scope', '$state', 'Authentication', 'squadResolve', 'OutcometeamsService', 'EmployeesService' ];

  function SquadsController($scope, $state, Authentication, squad, OutcometeamsService, EmployeesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.squad = squad;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.outcomeTeams = OutcometeamsService.query();
    vm.employees = EmployeesService.query();

    if (vm.squad._id) {
      vm.squad.created = new Date(vm.squad.created); //ui-date-picker expects a JS Date not a string
    }

    // Remove existing Squad
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.squad.$remove($state.go('squads.list'));
      }
    }

    // Save Squad
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.squadForm');
        return false;
      }
      if(vm.squad.squadOwner.systemUser)
        vm.squad.user = vm.squad.squadOwner.systemUser; //This will allow the squad owner to modify only their own squad
      // TODO: move create/update logic to service
      if (vm.squad._id) {
        vm.squad.$update(successCallback, errorCallback);
      } else {
        vm.squad.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('squads.view', {
          squadId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.openCalendar = function () {
      vm.isCalendarOpen = true;
    };

    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];
  }
})();
