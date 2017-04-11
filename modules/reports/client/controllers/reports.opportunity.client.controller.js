(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsOpportunityController', ReportsOpportunityController);

  ReportsOpportunityController.$inject = [ '$scope', '$filter', '$rootScope', '$state', 'OpportunitiesService', '$moment' ];

  function ReportsOpportunityController($scope, $filter, $rootScope, $state, OpportunitiesService, $moment) {
    var vm = this;
    vm.opportunityListMenuCallback = opportunityListMenuCallback;
    vm.rules = [];

    OpportunitiesService.query().$promise.then(function (data) {
      vm.rules[ 0 ] = {
        groupEntries: [],
        groupName: 'Opportunities'
      };
      for (var i = 0; i < data.length; i++) {
        vm.rules[ 0 ].groupEntries.push({
          name: data[ i ].customer.name + '/' + data[ i ].name,
          businessUnit: data[ i ].businessUnit,
          probability: data[ i ].probability,
          series: data[ i ].forecastSeries,
          actuals: data[ i ].actualSeries,
          term: data[ i ].contractPeriod.contractTerm,
          _id: data[ i ]._id
        });
        //$rootScope.$broadcast('RefreshSmartAmountsTable');
      }
    });


    function opportunityListMenuCallback(action, tableEntry) {
      $state.go('opportunities.view', {
        opportunityId: tableEntry._id
      });

    }

  }
})();
