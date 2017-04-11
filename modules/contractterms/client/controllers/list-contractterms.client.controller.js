(function () {
  'use strict';

  angular
    .module('contractterms')
    .controller('ContracttermsListController', ContracttermsListController);

  ContracttermsListController.$inject = ['ContracttermsService'];

  function ContracttermsListController(ContracttermsService) {
    var vm = this;

    vm.contractterms = ContracttermsService.query();
  }
})();
