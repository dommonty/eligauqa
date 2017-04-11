(function () {
  'use strict';

  angular
    .module('opportunities')
    .controller('OpportunitiesActualsController', OpportunitiesActualsController);

  OpportunitiesActualsController.$inject = [ '$scope', '$rootScope', 'opportunityResolve', '$filter', '$uibModal' ];

  function OpportunitiesActualsController($scope, $rootScope, opportunity, $filter, $uibModal) {
    var vm = this;

    init();

    function init() {
      vm.valuesTitles = [ 'Amount', 'Date Created', 'Description' ];
      vm.displayedValues = [];
      vm.actualsMenuCallback = actualsMenuCallback;
      vm.openActualCaptureModal = openActualCaptureModal;
      vm.opportunity = opportunity;
      vm.refreshDisplayedValues = refreshDisplayedValues;
      refreshDisplayedValues();
    }

    function actualsMenuCallback(action, tableEntry) {
      if (action === 'Remove') {
        if (confirm('Are you sure you want to delete the actual entry?')) {
          vm.opportunity.actualSeries.splice(tableEntry._id, 1);
          vm.opportunity.$update(function (res) {
            refreshDisplayedValues();
          }, function (res) {
            vm.error = res.data.message;
          });
        }
      }
    }

    function refreshDisplayedValues() {
      if (!vm.opportunity.actualSeries)
        vm.opportunity.actualSeries = [];
      vm.displayedValues.splice(0, vm.displayedValues.length);

      for (var i = 0; i < vm.opportunity.actualSeries.length; i++) {
        var tableEntry = {};
        var eachActual = vm.opportunity.actualSeries[ i ];
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
        templateUrl: 'captureOpportunityActual.html',
        controller: 'captureOpportunityActualFormController',
        controllerAs: 'vm',
        resolve: {
          opportunity: function () {
            return vm.opportunity;
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
  angular.module('projects').controller('captureOpportunityActualFormController', [ '$rootScope', '$scope', '$state',
    '$uibModalInstance', 'opportunity', 'parentViewModel',
    function sprintFormController($rootScope, $scope, $state,
                                  $uibModalInstance, opportunity, parentViewModel) {
      var vm = this;
      vm.format = 'dd-MMMM-yyyy';
      vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];
      
      vm.actual = {
        dateCreated: Date.now()
      };
      vm.opportunity = opportunity;

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
          vm.opportunity.actualSeries.push(vm.actual);
          vm.opportunity.$update(successCallback, errorCallback);
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.close();
      };

    }
  ]);
})();
