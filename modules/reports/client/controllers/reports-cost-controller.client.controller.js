(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsCostController', ReportsCostController);

  ReportsCostController.$inject = [ '$scope', '$filter', '$rootScope', '$state', 'CostallocationsService', '$window', 'allocateCostFilter' ];

  function ReportsCostController($scope, $filter, $rootScope, $state, CostallocationsService, $window, allocateCostFilter) {
    var vm = this;
    vm.costListMenuCallback = costListMenuCallback;
    vm.rules = [];

    CostallocationsService.query().$promise.then(function (data) {
      vm.rules[ 0 ] = {
        groupEntries: [],
        groupName: 'Costs'
      };
      for (var i = 0; i < data.length; i++) {
        vm.rules[ 0 ].groupEntries.push({
          name: data[ i ].squad.name + ' - ' + data[ i ].cost.name,
          businessUnit: data[ i ].cost.businessUnit,
          probability: data[ i ].cost.probability,
          series: [allocateCostFilter(data [ i ])],
          actuals: data [ i ].actuals,
          term: data[ i ].cost.contractPeriod.contractTerm,
          _id: data[ i ].cost._id
        });
        //$rootScope.$broadcast('RefreshSmartAmountsTable');
      }
    });


    function costListMenuCallback(action, tableEntry) {
      $state.go('costs.view', {
        costId: tableEntry._id
      });

    }


  }
})();
