(function () {
  'use strict';

  // Periods controller
  angular
    .module('periods')
    .controller('PeriodsController', PeriodsController);

  PeriodsController.$inject = [ '$scope', '$state', 'Authentication', 'periodResolve' ];

  function PeriodsController($scope, $state, Authentication, period) {
    var vm = this;

    vm.authentication = Authentication;
    vm.period = period;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];

    if (vm.period._id) {
      vm.period.periodFrom = new Date(vm.period.periodFrom); //ui-date-picker expects a JS Date not a string
      vm.period.periodTo = new Date(vm.period.periodTo);
    }

    vm.openCalendar = function () {
      vm.isCalendarOpen = true;
    };
    vm.openCalendar1 = function () {
      vm.isCalendarOpen1 = true;
    };

    // Remove existing Period
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.period.$remove($state.go('periods.list'));
      }
    }

    // Save Period
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.periodForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.period._id) {
        vm.period.$update(successCallback, errorCallback);
      } else {
        vm.period.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('periods.view', {
          periodId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
