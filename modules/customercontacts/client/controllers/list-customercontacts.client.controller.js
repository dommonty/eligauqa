(function () {
  'use strict';

  angular
    .module('customercontacts')
    .controller('CustomercontactsListController', CustomercontactsListController);

  CustomercontactsListController.$inject = [ 'CustomercontactsService', 'CustomersService', '$stateParams' ];

  function CustomercontactsListController(CustomercontactsService, CustomersService, $stateParams) {
    var vm = this;

    vm.customercontacts = CustomercontactsService.query({ customerId: $stateParams.customerId });
    vm.customer = CustomersService.get({ customerId: $stateParams.customerId });
  }
})();
