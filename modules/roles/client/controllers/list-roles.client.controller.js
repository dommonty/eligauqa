(function () {
  'use strict';

  angular
    .module('roles')
    .controller('RolesListController', RolesListController);

  RolesListController.$inject = ['RolesService'];

  function RolesListController(RolesService) {
    var vm = this;

    vm.roles = RolesService.query();
  }
})();
