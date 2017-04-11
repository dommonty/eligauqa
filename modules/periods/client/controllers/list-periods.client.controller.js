(function () {
  'use strict';

  angular
    .module('periods')
    .controller('PeriodsListController', PeriodsListController);

  PeriodsListController.$inject = ['PeriodsService'];

  function PeriodsListController(PeriodsService) {
    var vm = this;

    vm.periods = PeriodsService.query();
  }
})();
