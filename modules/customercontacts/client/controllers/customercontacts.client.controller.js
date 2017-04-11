(function () {
  'use strict';

  // Customercontacts controller
  angular
    .module('customercontacts')
    .controller('CustomercontactsController', CustomercontactsController);

  CustomercontactsController.$inject = ['$scope', '$state', 'Authentication', 'customercontactResolve', 'CustomersService', '$stateParams'];

  function CustomercontactsController ($scope, $state, Authentication, customercontact, CustomersService, $stateParams) {
    var vm = this;

    vm.authentication = Authentication;
    vm.customercontact = customercontact;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.customer = CustomersService.get({ customerId: $stateParams.customerId });

    // Remove existing Customercontact
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.customercontact.$remove($state.go('customercontacts.list'));
      }
    }

    // Save Customercontact
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customercontactForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.customercontact._id) {
        vm.customercontact.$update(successCallback, errorCallback);
      } else {
        vm.customercontact.customer = vm.customer;
        vm.customercontact.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('customercontacts.list', {
          customerId: vm.customer._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
