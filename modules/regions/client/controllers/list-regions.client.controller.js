(function () {
  'use strict';

  angular
    .module('regions')
    .controller('RegionsListController', RegionsListController);

  RegionsListController.$inject = ['RegionsService'];

  function RegionsListController(RegionsService) {
    var vm = this;

    vm.regions = RegionsService.query();
  }
})();
