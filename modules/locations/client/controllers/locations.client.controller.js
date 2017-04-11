(function () {
  'use strict';

  // Locations controller
  angular
    .module('locations')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['$scope', '$state', 'Authentication', 'locationResolve'];

  function LocationsController ($scope, $state, Authentication, location) {
    var vm = this;

    vm.authentication = Authentication;
    vm.location = location;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Location
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.location.$remove($state.go('locations.list'));
      }
    }

    // Save Location
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.locationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.location._id) {
        vm.location.$update(successCallback, errorCallback);
      } else {
        vm.location.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('locations.view', {
          locationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
