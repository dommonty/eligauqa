(function () {
  'use strict';

  // Supportplans controller
  angular
    .module('supportplans')
    .controller('SupportplansController', SupportplansController);

  SupportplansController.$inject = ['$scope', '$state', 'Authentication', 'supportplanResolve'];

  function SupportplansController ($scope, $state, Authentication, supportplan) {
    var vm = this;

    vm.authentication = Authentication;
    vm.supportplan = supportplan;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Supportplan
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.supportplan.$remove($state.go('supportplans.list'));
      }
    }

    // Save Supportplan
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.supportplanForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.supportplan._id) {
        vm.supportplan.$update(successCallback, errorCallback);
      } else {
        vm.supportplan.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('supportplans.view', {
          supportplanId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
