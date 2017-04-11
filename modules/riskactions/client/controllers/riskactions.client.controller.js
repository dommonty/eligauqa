(function () {
  'use strict';

  // Riskactions controller
  angular
    .module('riskactions')
    .controller('RiskactionsController', RiskactionsController);

  RiskactionsController.$inject = [ '$scope', '$state', 'Authentication', 'riskactionResolve', 'customerResolve', '$stateParams',
    'Admin' ];

  function RiskactionsController($scope, $state, Authentication, riskaction, customer, $stateParams,
                                 Admin) {
    var vm = this;

    vm.authentication = Authentication;
    vm.riskaction = riskaction;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.users = Admin.query();

    vm.businessUnitId = $stateParams.businessUnitId;

    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];

    if (vm.riskaction._id)
      vm.riskaction.dueBy = new Date(vm.riskaction.dueBy); //ui-date-picker expects a JS Date not a string

    vm.openCalendar = function () {
      vm.isCalendarOpen = true;
    };

    vm.customer = customer;
    // Remove existing Riskaction
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.riskaction.$remove($state.go('riskactions.list'));
      }
    }

    // Save Riskaction
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.riskactionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.riskaction._id) {
        vm.riskaction.$update(successCallback, errorCallback);
      } else {
        vm.riskaction.customer = vm.customer;
        vm.riskaction.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('riskactions.list', {
          customerId: vm.customer._id,
          businessUnitId: vm.businessUnitId
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.classForCustomer = function (customer) {
      switch (customer.riskRating) {
        case 'Major':
          return 'label-major';
        case 'Moderate':
          return 'label-moderate';
        case 'Minor' :
          return 'label-minor';
      }
    };
  }
})();
