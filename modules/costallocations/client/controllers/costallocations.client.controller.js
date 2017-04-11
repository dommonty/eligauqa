(function () {
  'use strict';

  // Costallocations controller
  angular
    .module('costallocations')
    .controller('CostallocationsController', CostallocationsController);

  CostallocationsController.$inject = [ '$scope', '$state', 'Authentication', 'costallocationResolve', '$stateParams', 'CostsService',
    'SquadsService' ];

  function CostallocationsController($scope, $state, Authentication, costallocation, $stateParams, CostsService,
                                     SquadsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.costallocation = costallocation;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    CostsService.get({
      costId: $stateParams.costId
    }).$promise.then(function (_cost) {
      vm.cost = _cost;
      if (!vm.costallocation._id) {
        vm.costallocation.cost = vm.cost;
      }
      SquadsService.query().$promise.then(function (squads) {
        vm.squads = [];
        for (var i = 0; i < squads.length; i++) {
          var eachSquad = squads[ i ];
          if (eachSquad.outcomeTeam.businessUnit._id === vm.cost.businessUnit._id)
            vm.squads.push(eachSquad);
        }
      });
    });

    // Remove existing Costallocation
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.costallocation.$remove($state.go('costallocations.list'));
      }
    }

    // Save Costallocation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.costallocationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.costallocation._id) {
        vm.costallocation.$update(successCallback, errorCallback);
      } else {
        vm.costallocation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('costallocations.view', {
          costallocationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
