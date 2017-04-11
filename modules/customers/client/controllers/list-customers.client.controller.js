(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = [ 'CustomersService', '$rootScope', '$state' ];

  function CustomersListController(CustomersService, $rootScope, $state) {
    var vm = this;
    vm.customerListMenuCallback = customerListMenuCallback;

    vm.customers = CustomersService.query();


    vm.customerListTitles = [ 'Name', 'Region', 'Tier' ];
    vm.displayedValues = [];

    CustomersService.query().$promise.then(function (data) {
      for (var i = 0; i < data.length; i++) {
        var tableEntry = {};
        var eachCustomer = data[ i ];

        tableEntry[ 0 ] = eachCustomer.name;
        tableEntry[ 1 ] = eachCustomer.region ? eachCustomer.region.name : '';
        tableEntry[ 2 ] = eachCustomer.tier;
        tableEntry._id = eachCustomer._id;
        vm.displayedValues.push(tableEntry);
      }
      $rootScope.$broadcast('RefreshSearchTable');
    });

    function customerListMenuCallback(action, tableEntry) {
      if (action === 'View') {
        $state.go('customers.view', {
          customerId: tableEntry._id
        });
      }
      if (action === 'Edit') {
        $state.go('customers.edit', {
          customerId: tableEntry._id
        });
      }

    }
  }
})();
