(function () {
  'use strict';

  angular
    .module('packageofferings')
    .controller('PackageofferingsListController', PackageofferingsListController);

  PackageofferingsListController.$inject = ['PackageofferingsService'];

  function PackageofferingsListController(PackageofferingsService) {
    var vm = this;

    vm.packageofferings = PackageofferingsService.query();
  }
})();
