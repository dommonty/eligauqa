(function () {
  'use strict';

  angular
    .module('businessunits')
    .controller('BusinessunitsListController', BusinessunitsListController);

  BusinessunitsListController.$inject = ['BusinessunitsService'];

  function BusinessunitsListController(BusinessunitsService) {
    var vm = this;

    vm.businessunits = BusinessunitsService.query();
  }
})();
