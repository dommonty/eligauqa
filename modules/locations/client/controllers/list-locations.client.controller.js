(function () {
  'use strict';

  angular
    .module('locations')
    .controller('LocationsListController', LocationsListController);

  LocationsListController.$inject = ['LocationsService'];

  function LocationsListController(LocationsService) {
    var vm = this;

    vm.locations = LocationsService.query();
  }
})();
