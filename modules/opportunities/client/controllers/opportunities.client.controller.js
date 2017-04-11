(function () {
  'use strict';

  // Opportunities controller
  angular
    .module('opportunities')
    .controller('OpportunitiesController', OpportunitiesController);

  OpportunitiesController.$inject = [ '$rootScope', '$scope', '$state', 'Authentication', 'opportunityResolve', 'BusinessunitsService',
    'CustomersService', 'ProductsService', '$uibModal', '$filter', 'ContracttermsService', 'Admin' ];

  function OpportunitiesController($rootScope, $scope, $state, Authentication, opportunity, BusinessunitsService,
                                   CustomersService, ProductsService, $uibModal, $filter, ContracttermsService, Admin) {
    var vm = this;

    vm.authentication = Authentication;
    vm.opportunity = opportunity;
    vm.error = null;
    vm.form = {};
    vm.businessUnits = BusinessunitsService.query();
    vm.customers = CustomersService.query();
    vm.remove = remove;
    vm.save = save;
    vm.openOpportunityModal = openOpportunityModal;
    vm.refreshDisplayedValues = refreshDisplayedValues;
    vm.opportunityMenuCallback = opportunityMenuCallback;
    vm.contractTerms = ContracttermsService.query();
    vm.displayedValues = [];
    vm.products = ProductsService.query();
    vm.users = Admin.query();
    vm.linkClicked = linkClicked;


    if (!vm.opportunity.businessUnit) {
      BusinessunitsService.get({businessunitId: vm.authentication.user.defaultBusinessUnit}).$promise.then(function (bu) {
        vm.opportunity.businessUnit = bu;
      });
    }


    vm.refreshDisplayedValues();

    vm.valuesTitles = [ 'Start Date', 'Amount', 'Description', 'Repeat' ];

    function opportunityMenuCallback(action, tableEntry) {
      if (action === 'Remove') {
        if (confirm('Are you sure you want to delete?')) {
          vm.opportunity.forecastSeries.splice(tableEntry._id, 1);
          refreshDisplayedValues();
        }
      }

      if (action === 'Edit') {
        openOpportunityModal(vm.opportunity.forecastSeries[ tableEntry._id ]);
      }
    }

    function linkClicked(tableEntry) {
      openOpportunityModal(vm.opportunity.forecastSeries[ tableEntry._id ]);
    }

    function refreshDisplayedValues() {
      if (!vm.opportunity.forecastSeries)
        vm.opportunity.forecastSeries = [];
      vm.displayedValues.splice(0, vm.displayedValues.length);

      for (var i = 0; i < vm.opportunity.forecastSeries.length; i++) {
        var tableEntry = {};
        var eachForecast = vm.opportunity.forecastSeries[ i ];
        tableEntry[ 0 ] = $filter('date')(eachForecast.date, 'dd MMM yyyy');
        tableEntry[ 1 ] = $filter('currency')(eachForecast.amount);
        tableEntry[ 2 ] = eachForecast.description;
        tableEntry[ 3 ] = eachForecast.repeat;
        vm.displayedValues.push(tableEntry);
        tableEntry._id = i; //store the index so it can be removed, see opportunityMenuCallack function above
      }
      $rootScope.$broadcast('RefreshSearchTable');
    }


    // Remove existing Opportunity
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.opportunity.$remove($state.go('opportunities.list'));
      }
    }

    // Save Opportunity
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.opportunityForm');
        return false;
      }

      if (vm.opportunity._id) {
        vm.opportunity.$update(successCallback, errorCallback);
      } else {
        vm.opportunity.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('opportunities.view', {
          opportunityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }


    function openOpportunityModal(opportunityAmount) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'confirmOpportunityValue.html',
        controller: 'confirmOpportunityValueCtrl',
        controllerAs: 'vm',
        resolve: {
          opportunity: function () {
            return vm.opportunity;
          },
          parentViewModel: function () {
            return vm;
          },
          opportunityAmount: function () {
            return opportunityAmount;
          }
        }
      });
    }


  }

  /*
   * show the confirmation modal popup
   */
  angular.module('opportunities').controller('confirmOpportunityValueCtrl', [ '$rootScope', '$scope', '$state',
    '$uibModalInstance', 'opportunity', 'parentViewModel', 'opportunityAmount',
    function confirmOpportunityValueCtrl($rootScope, $scope, $state, $uibModalInstance, opportunity, parentViewModel, opportunityAmount) {
      var vm = this,
        editMode = true;

      vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];
      if (opportunityAmount) {
        vm.selectedOpportunityAmount = opportunityAmount;
        vm.selectedOpportunityAmount.date = new Date(vm.selectedOpportunityAmount.date); //ui-date-picker expects a JS Date not a string

      }
      else {
        vm.selectedOpportunityAmount = {};
        editMode = false;
      }

      vm.disabled = disabled;

      function disabled(date, mode) {
        var enabledDay = date.getDate();
        return enabledDay !== 1;
      }

      vm.openCalendar = function () {
        vm.isCalendarOpen = true;
      };

      $scope.confirmOpportunity = function (isValid) {
        if (isValid) {
          if (!editMode)
            opportunity.forecastSeries.push(vm.selectedOpportunityAmount);
          parentViewModel.refreshDisplayedValues();
          $uibModalInstance.close();
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.close();
      };
    }
  ]);
})();
