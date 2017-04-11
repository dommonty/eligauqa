(function () {
  'use strict';

  angular
    .module('projects')
    .controller('OpportunityRevenuesController', OpportunityRevenuesController);

  OpportunityRevenuesController.$inject = [ 'OpportunitiesService', 'projectResolve', '$rootScope', '$filter', '$state' ];

  function OpportunityRevenuesController(OpportunitiesService, project, $rootScope, $filter, $state) {
    var vm = this;
    vm.project = project;
    vm.opportunityRevenueDisplayedValues = [];
    vm.allOpportunitiesDisplayedValues = [];
    vm.addNewOpportunityClicked = addNewOpportunityClicked;
    vm.opportunityListMenuCallback = opportunityListMenuCallback;
    vm.opportunityRevenueListMenuCallback = opportunityRevenueListMenuCallback;
    vm.closeAddNewOpportunitClicked = closeAddNewOpportunitClicked;

    vm.opportunityRevenueListTitles = [ 'Name', 'Customer', 'Probability', 'Opportunity Value' ];

    updateLinkedOpporunitiesList();

    function updateLinkedOpporunitiesList() {
      vm.opportunityRevenueDisplayedValues.splice(0, vm.opportunityRevenueDisplayedValues.length);
      for (var i = 0; i < vm.project.linkedRevenueOpportunities.length; i++) {
        var tableEntry = {};
        var eachOpportunity = vm.project.linkedRevenueOpportunities[ i ];

        tableEntry[ 0 ] = eachOpportunity.name;
        tableEntry[ 1 ] = eachOpportunity.customer.name;
        tableEntry[ 2 ] = eachOpportunity.probability;
        tableEntry[ 3 ] = $filter('currency')(eachOpportunity.totalOpportunityValue, '$', 0);
        tableEntry._id = eachOpportunity._id;
        vm.opportunityRevenueDisplayedValues.push(tableEntry);
      }
      $rootScope.$broadcast('RefreshSearchTable');
    }

    vm.opportunityListTitles = [ 'Name', 'Customer', 'Region', 'Owner', 'Business Unit', 'Products', 'Probability', 'Rolling 12 Months', 'Contract Value' ];

    function updateAllOpportunitiesList() {
      vm.allOpportunitiesDisplayedValues.splice(0, vm.allOpportunitiesDisplayedValues.length);
      OpportunitiesService.query({
        businessUnitId: vm.project.businessUnit._id
      }).$promise.then(function (data) {

        for (var i = 0; i < data.length; i++) {
          var tableEntry = {};
          var eachOpportunity = data[ i ];

          if (opportunityNotAdded(eachOpportunity)) {

            tableEntry[ 0 ] = eachOpportunity.name;
            tableEntry[ 1 ] = eachOpportunity.customer.name;
            tableEntry[ 2 ] = eachOpportunity.customer.region ? eachOpportunity.customer.region.name : '';
            tableEntry[ 3 ] = eachOpportunity.owner ? eachOpportunity.owner.displayName : '';
            tableEntry[ 4 ] = eachOpportunity.businessUnit.name;
            tableEntry[ 5 ] = eachOpportunity.includedProduct.name;
            tableEntry[ 6 ] = eachOpportunity.probability;
            tableEntry[ 7 ] = $filter('currency')(eachOpportunity.valueNext12Months, '$', 0);
            tableEntry[ 8 ] = $filter('currency')(eachOpportunity.totalOpportunityValue, '$', 0);
            tableEntry._id = eachOpportunity._id;
            vm.allOpportunitiesDisplayedValues.push(tableEntry);
          }
        }
        $rootScope.$broadcast('RefreshSearchTable');
      });
    }

    function opportunityNotAdded(opportunity) {
      for (var i = 0; i < vm.project.linkedRevenueOpportunities.length; i++) {
        if (vm.project.linkedRevenueOpportunities[ i ]._id === opportunity._id)
          return false;
      }
      return true;
    }

    function opportunityListMenuCallback(action, tableEntry) {
      OpportunitiesService.get({opportunityId: tableEntry._id}).$promise.then(function (opp) {
        vm.project.linkedRevenueOpportunities.push(opp);
        saveProject();
        updateLinkedOpporunitiesList();
        vm.showAddNewOpportunity = false;
      });
    }

    function opportunityRevenueListMenuCallback(action, tableEntry) {
      if (confirm('Are you sure you want to remove the opportunity?')) {
        for (var i = 0; i < vm.project.linkedRevenueOpportunities.length; i++) {
          if (vm.project.linkedRevenueOpportunities[ i ]._id === tableEntry._id)
            vm.project.linkedRevenueOpportunities.splice(i, 1);
        }
        saveProject();
        updateLinkedOpporunitiesList();

      }

    }

    function addNewOpportunityClicked() {
      updateAllOpportunitiesList();
      vm.showAddNewOpportunity = true;
    }

    function closeAddNewOpportunitClicked() {
      vm.showAddNewOpportunity = false;
    }


    function saveProject() {

      vm.project.$update(successCallback, errorCallback);

      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
