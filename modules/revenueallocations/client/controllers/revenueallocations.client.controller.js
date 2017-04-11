(function () {
  'use strict';

  // Revenueallocations controller
  angular
    .module('revenueallocations')
    .controller('RevenueallocationsController', RevenueallocationsController);

  RevenueallocationsController.$inject = [ '$scope', '$state', 'Authentication', 'revenueallocationResolve', '$stateParams', 'ProductsService',
    'SquadsService' ];

  function RevenueallocationsController($scope, $state, Authentication, revenueallocation, $stateParams, ProductsService,
                                        SquadsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.revenueallocation = revenueallocation;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    ProductsService.get({
      productId: $stateParams.productId
    }).$promise.then(function (_product) {
      vm.product = _product;
      SquadsService.query().$promise.then(function (squads) {
        vm.squads = [];
        for (var i = 0; i < squads.length; i++) {
          var eachSquad = squads[ i ];
          if (eachSquad.outcomeTeam.businessUnit._id === vm.product.businessUnit._id)
            vm.squads.push(eachSquad);
        }
      });

      if (!vm.revenueallocation._id) {
        vm.revenueallocation.allocation = 100;
        vm.revenueallocation.product = vm.product;
      }
    });


    // Remove existing Revenueallocation
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.revenueallocation.$remove($state.go('revenueallocations.list'));
      }
    }


    // Save Revenueallocation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.revenueallocationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.revenueallocation._id) {
        vm.revenueallocation.$update(successCallback, errorCallback);
      } else {
        vm.revenueallocation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('revenueallocations.view', {
          revenueallocationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
