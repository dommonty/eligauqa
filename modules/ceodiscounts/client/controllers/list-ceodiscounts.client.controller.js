(function () {
  'use strict';

  angular
    .module('ceodiscounts')
    .controller('CeodiscountsListController', CeodiscountsListController);

  CeodiscountsListController.$inject = ['CeodiscountsService'];

  function CeodiscountsListController(CeodiscountsService) {
    var vm = this;

    vm.ceodiscounts = CeodiscountsService.query();
  }
})();
