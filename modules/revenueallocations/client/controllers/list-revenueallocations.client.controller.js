(function () {
  'use strict';

  angular
    .module('revenueallocations')
    .controller('RevenueallocationsListController', RevenueallocationsListController);

  RevenueallocationsListController.$inject = [ 'RevenueallocationsService', '$stateParams', 'ProductsService' ];

  function RevenueallocationsListController(RevenueallocationsService, $stateParams, ProductsService) {
    var vm = this;

    vm.product = ProductsService.get({
      productId: $stateParams.productId
    });

    vm.revenueallocations = RevenueallocationsService.query({
      productId: $stateParams.productId
    });
  }
})();
