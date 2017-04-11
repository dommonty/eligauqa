(function () {
  'use strict';

  // Regions controller
  angular
    .module('regions')
    .controller('RegionsController', RegionsController);

  RegionsController.$inject = ['$scope', '$state', 'Authentication', 'regionResolve'];

  function RegionsController ($scope, $state, Authentication, region) {
    var vm = this;

    vm.authentication = Authentication;
    vm.region = region;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Region
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.region.$remove($state.go('regions.list'));
      }
    }

    // Save Region
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.regionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.region._id) {
        vm.region.$update(successCallback, errorCallback);
      } else {
        vm.region.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('regions.view', {
          regionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
