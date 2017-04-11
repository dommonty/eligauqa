(function () {
  'use strict';

  // Ceodiscounts controller
  angular
    .module('ceodiscounts')
    .controller('CeodiscountsController', CeodiscountsController);

  CeodiscountsController.$inject = ['$scope', '$state', 'Authentication', 'ceodiscountResolve'];

  function CeodiscountsController ($scope, $state, Authentication, ceodiscount) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ceodiscount = ceodiscount;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ceodiscount
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.ceodiscount.$remove($state.go('ceodiscounts.list'));
      }
    }

    // Save Ceodiscount
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ceodiscountForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ceodiscount._id) {
        vm.ceodiscount.$update(successCallback, errorCallback);
      } else {
        vm.ceodiscount.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ceodiscounts.view', {
          ceodiscountId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
