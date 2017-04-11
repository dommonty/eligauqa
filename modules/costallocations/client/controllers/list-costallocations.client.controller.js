(function () {
  'use strict';

  angular
    .module('costallocations')
    .controller('CostallocationsListController', CostallocationsListController);

  CostallocationsListController.$inject = [ 'CostallocationsService', 'CostsService', '$stateParams' ];

  function CostallocationsListController(CostallocationsService, CostsService, $stateParams) {
    var vm = this;
    vm.cost = CostsService.get({
      costId: $stateParams.costId
    });

    vm.costallocations = CostallocationsService.query({costId: $stateParams.costId});

  }
})();
