(function () {
  'use strict';

  // Businessunits controller
  angular
    .module('businessunits')
    .controller('BusinessunitsController', BusinessunitsController);

  BusinessunitsController.$inject = [ '$scope', '$state', 'Authentication', 'businessunitResolve', 'CompaniesService',
    'OutcometeamsService', 'CostsService' ];

  function BusinessunitsController($scope, $state, Authentication, businessunit, CompaniesService,
                                   OutcometeamsService, CostsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.businessunit = businessunit;
    vm.error = null;
    vm.form = {};
    vm.companies = CompaniesService.query();
    vm.remove = remove;
    vm.save = save;
    vm.outcomeTeams = [];
    vm.costs = CostsService.query();

    // Remove existing Businessunit
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.businessunit.$remove($state.go('businessunits.list'));
      }
    }

    OutcometeamsService.query().$promise.then(function (data) {
      for (var i = 0; i < data.length; i++) {
        var outcomeTeam = data[ i ];

        if (outcomeTeam.businessUnit._id === vm.businessunit._id) {
          vm.outcomeTeams.push(outcomeTeam);
        }
      }
    });

    // Save Businessunit
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.businessunitForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.businessunit._id) {
        vm.businessunit.$update(successCallback, errorCallback);
      } else {
        vm.businessunit.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('businessunits.view', {
          businessunitId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
