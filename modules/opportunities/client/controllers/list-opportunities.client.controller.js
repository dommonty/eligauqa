(function () {
  'use strict';

  angular
    .module('opportunities')
    .controller('OpportunitiesListController', OpportunitiesListController);

  OpportunitiesListController.$inject = [ 'OpportunitiesService', '$rootScope', 'Authentication', '$filter', '$state', 'BusinessunitsService' ];

  function OpportunitiesListController(OpportunitiesService, $rootScope, Authentication, $filter, $state, BusinessunitsService) {
    var vm = this;
    vm.displayedValues = [];
    vm.opportunityListMenuCallback = opportunityListMenuCallback;
    vm.openOpportunityView = openOpportunityView;
    vm.authentication = Authentication;

    vm.businessUnits = BusinessunitsService.query();

    BusinessunitsService.get({
      businessunitId: vm.authentication.user.defaultBusinessUnit
    }).$promise.then(function (bu) {
      vm.businessUnit = bu;
      if (vm.businessUnit)
        vm.businessUnitChanged();
    });


    vm.businessUnitChanged = function () {
      vm.showSpinner = true;
      vm.opportunitiesForActualTemplate = [];
      generateExcelTemplate();
      OpportunitiesService.query({
        businessUnitId: vm.businessUnit._id
      }).$promise.then(function (data) {
        vm.displayedValues.splice(0, vm.displayedValues.length);
        for (var i = 0; i < data.length; i++) {
          var tableEntry = {};
          var eachOpportunity = data[ i ];
          if (eachOpportunity.probability === 100)
            vm.opportunitiesForActualTemplate.push({
              saisOpportunityId: eachOpportunity._id,
              opportunityName: eachOpportunity.name,
              customerName: eachOpportunity.customer.name,
              actual: 0
            });
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
          vm.displayedValues.push(tableEntry);
        }
        vm.showSpinner = false;
        $rootScope.$broadcast('RefreshSearchTable');
      });
    };
    vm.opportunityListTitles = [ 'Name', 'Customer', 'Region', 'Owner', 'Business Unit', 'Products', 'Probability', 'Rolling 12 Months', 'Contract Value' ];


    function opportunityListMenuCallback(action, tableEntry) {
      if (action === 'View') {
        $state.go('opportunities.view', {
          opportunityId: tableEntry._id
        });
      }
      if (action === 'Edit') {
        $state.go('opportunities.edit', {
          opportunityId: tableEntry._id
        });
      }
    }

    function openOpportunityView(tableEntry) {
      $state.go('opportunities.view', {
        opportunityId: tableEntry._id
      });
    }

    function generateExcelTemplate() {
      vm.actualsTemplateHeader = {
        saisOpportunityId: 'saisOpportunityId',
        opportunityName: 'opportunityName',
        customerName: 'customerName',
        actual: 'actualValue'
      };
    }
  }
})();
