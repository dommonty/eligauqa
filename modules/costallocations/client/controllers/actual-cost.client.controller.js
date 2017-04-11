(function () {
  'use strict';

  angular
    .module('costallocations')
    .controller('ActualCostController', ActualCostController);

  ActualCostController.$inject = [ '$scope', '$rootScope', 'costallocationResolve', '$filter', '$uibModal' ];

  function ActualCostController($scope, $rootScope, allocation, $filter, $uibModal) {
    var vm = this;

    init();

    function init() {
      vm.valuesTitles = [ 'Amount', 'Date Created', 'Description' ];
      vm.displayedValues = [];
      vm.actualsMenuCallback = actualsMenuCallback;
      vm.openActualCaptureModal = openActualCaptureModal;
      vm.allocation = allocation;
      vm.refreshDisplayedValues = refreshDisplayedValues;
      refreshDisplayedValues();
    }

    function actualsMenuCallback(action, tableEntry) {
      if (action === 'Remove') {
        if (confirm('Are you sure you want to delete the actual entry?')) {
          vm.allocation.actuals.splice(tableEntry._id, 1);
          vm.allocation.$update(function (res) {
            refreshDisplayedValues();
          }, function (res) {
            vm.error = res.data.message;
          });
        }
      }
    }

    function refreshDisplayedValues() {
      if (!vm.allocation.actuals)
        vm.allocation.actuals = [];
      vm.displayedValues.splice(0, vm.displayedValues.length);

      for (var i = 0; i < vm.allocation.actuals.length; i++) {
        var tableEntry = {};
        var eachActual = vm.allocation.actuals[ i ];
        tableEntry[ 0 ] = $filter('currency')(eachActual.amount, '$', 0);
        tableEntry[ 1 ] = $filter('date')(eachActual.dateCreated, 'dd MMM yyyy');
        tableEntry[ 2 ] = eachActual.description;
        vm.displayedValues.push(tableEntry);
        tableEntry._id = i; //store the index so it can be removed, see actualsMenuCallback function above
      }
      $rootScope.$broadcast('RefreshSearchTable');
    }

    function openActualCaptureModal() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'captureActual.html',
        controller: 'captureActualFormController',
        controllerAs: 'vm',
        resolve: {
          allocation: function () {
            return vm.allocation;
          },
          parentViewModel: function () {
            return vm;
          }
        }
      });

    }
  }

  /*
   * show the confirmation modal popup
   */
  angular.module('projects').controller('captureActualFormController', [ '$rootScope', '$scope', '$state',
    '$uibModalInstance', 'allocation', 'parentViewModel',
    function sprintFormController($rootScope, $scope, $state,
                                  $uibModalInstance, allocation, parentViewModel) {
      var vm = this;
      vm.actual = {
        dateCreated: Date.now()
      };
      vm.allocation = allocation;

      vm.openCalendar = function () {
        vm.isCalendarOpen = true;
      };

      $scope.confirmActual = function (isValid) {

        function successCallback(res) {
          parentViewModel.refreshDisplayedValues();
          $uibModalInstance.close();
        }

        function errorCallback(res) {
          vm.error = res.data.message;
        }

        if (isValid) {
          vm.allocation.actuals.push(vm.actual);
          vm.allocation.$update(successCallback, errorCallback);
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.close();
      };

    }
  ]);
})();
