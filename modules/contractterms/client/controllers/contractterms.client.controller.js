(function () {
  'use strict';

  // Contractterms controller
  angular
    .module('contractterms')
    .controller('ContracttermsController', ContracttermsController);

  ContracttermsController.$inject = [ '$scope', '$state', 'Authentication', 'contracttermResolve' ];

  function ContracttermsController($scope, $state, Authentication, contractterm) {
    var vm = this;

    vm.authentication = Authentication;
    vm.contractterm = contractterm;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contractterm
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.contractterm.$remove($state.go('contractterms.list'));
      }
    }

    // Save Contractterm
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contracttermForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contractterm._id) {
        vm.contractterm.$update(successCallback, errorCallback);
      } else {
        vm.contractterm.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contractterms.view', {
          contracttermId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
