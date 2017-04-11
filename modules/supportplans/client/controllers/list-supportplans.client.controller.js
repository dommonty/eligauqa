(function () {
  'use strict';

  angular
    .module('supportplans')
    .controller('SupportplansListController', SupportplansListController);

  SupportplansListController.$inject = ['SupportplansService'];

  function SupportplansListController(SupportplansService) {
    var vm = this;

    vm.supportplans = SupportplansService.query();
  }
})();
