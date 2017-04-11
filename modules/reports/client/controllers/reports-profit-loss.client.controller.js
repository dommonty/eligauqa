(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsProfitLossController', ReportsProfitLossController);

  ReportsProfitLossController.$inject = [ '$scope', '$rootScope', '$state', 'CostallocationsService', 'OpportunitiesService', 'SquadsService', 'negateActualAmountFilter', 'allocateCostFilter' ];

  function ReportsProfitLossController($scope, $rootScope, $state, CostallocationsService, OpportunitiesService, SquadsService, negateActualAmountFilter, allocateCostFilter) {

    var vm = this;
    vm.listMenuCallback = listMenuCallback;
    vm.rules = [];

    SquadsService.query(
      {
        probability: 0,
        deepPopulate: true
      }).$promise.then(function (squadsData) {
      vm.rules.push(getSquadsGroupEntry(squadsData));
      CostallocationsService.query().$promise.then(function (costsData) {
        vm.rules.push(getCostsGroupEntry(costsData));
        OpportunitiesService.query().$promise.then(function (OpportutnitiesData) {
          vm.rules.push(getOpportunitiesGroupEntry(OpportutnitiesData));
          //$rootScope.$broadcast('RefreshSmartAmountsTable');
        });
      });
    });


    function getCostsGroupEntry(costAllocationEntries) {
      var costGroupEntry = {
        groupName: 'Costs (Direct & Loaded)',
        groupEntries: []
      };
      for (var i = 0; i < costAllocationEntries.length; i++) {
        negateAmount([ costAllocationEntries[ i ].cost.forecastSeries ]);
        costGroupEntry.groupEntries.push({
          name: costAllocationEntries[ i ].squad.name + ' - ' + costAllocationEntries[ i ].cost.name,
          businessUnit: costAllocationEntries[ i ].cost.businessUnit,
          probability: costAllocationEntries[ i ].cost.probability,
          series: [ allocateCostFilter(costAllocationEntries[ i ]) ],
          actuals: negateActualAmountFilter(costAllocationEntries [ i ].actuals),
          term: costAllocationEntries[ i ].cost.contractPeriod.contractTerm
        });
      }
      return costGroupEntry;

    }

    function negateAmount(series) {
      angular.forEach(series, function (each) {
        each.amount = each.amount * -1;
      });
    }

    function getOpportunitiesGroupEntry(opportunitiesEntries) {
      var opportunitiesGroupEntry = {
        groupName: 'Opportunities',
        groupEntries: []
      };
      for (var i = 0; i < opportunitiesEntries.length; i++) {
        opportunitiesGroupEntry.groupEntries.push({
          name: opportunitiesEntries[ i ].customer.name + '/' + opportunitiesEntries[ i ].name,
          businessUnit: opportunitiesEntries[ i ].businessUnit,
          probability: opportunitiesEntries[ i ].probability,
          series: opportunitiesEntries[ i ].forecastSeries,
          actuals: opportunitiesEntries[ i ].actualSeries,
          term: opportunitiesEntries[ i ].contractPeriod.contractTerm
        });
      }
      return opportunitiesGroupEntry;
    }

    function getSquadsGroupEntry(squadsEntries) {
      var squadsGroupEntry = {
        groupName: 'Squads Cost',
        groupEntries: []
      };
      for (var i = 0; i < squadsEntries.length; i++) {
        squadsGroupEntry.groupEntries.push({
          name: squadsEntries[ i ].name,
          businessUnit: squadsEntries[ i ].outcomeTeam.businessUnit,
          probability: 100,
          actuals: negateActualAmountFilter(squadsEntries[ i ].actuals),
          series: [ {
            date: squadsEntries[ i ].created,
            amount: squadsEntries[ i ].baseSquadCost / 12 * -1,
            repeat: 'monthly'
          } ],
          term: 5
        });
      }
      return squadsGroupEntry;
    }


    function listMenuCallback(action, tableEntry) {
      $state.go('costs.view', {
        costId: tableEntry._id
      });

    }

  }
})();
