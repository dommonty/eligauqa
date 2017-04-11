(function () {
  'use strict';

  angular
    .module('costs')
    .controller('CostsListController', CostsListController);

  CostsListController.$inject = [ '$rootScope', '$state', 'Authentication', '$filter', 'CostsService', 'BusinessunitsService' ];

  function CostsListController($rootScope, $state, Authentication, $filter, CostsService, BusinessunitsService) {
    var vm = this;
    vm.costListMenuCallback = costListMenuCallback;
    vm.openCostView = openCostView;
    vm.displayedValues = [];
    vm.authentication = Authentication;
    vm.businessUnits = BusinessunitsService.query();

    BusinessunitsService.get({
      businessunitId: vm.authentication.user.defaultBusinessUnit
    }).$promise.then(function (bu) {
      vm.businessUnit = bu;
      if (vm.businessUnit)
        vm.businessUnitChanged();
    });

    vm.costListTitles = [ 'Name', 'Business Unit', 'Probability', 'Total Cost', 'Next 12 months' ];

    vm.businessUnitChanged = function () {
      vm.showSpinner = true;
      vm.displayedValues.splice(0, vm.displayedValues.length);
      generateExcelTemplate();
      vm.actualCostValues = [];
      CostsService.query({
        businessUnitId: vm.businessUnit._id
      }).$promise.then(function (data) {
        for (var i = 0; i < data.length; i++) {
          var tableEntry = {};
          var eachCost = data[ i ];
          vm.actualCostValues.push({
            saisCostId: eachCost._id,
            costName: eachCost.name,
            actual: 0
          });
          tableEntry[ 0 ] = eachCost.name;
          tableEntry[ 1 ] = eachCost.businessUnit.name;
          tableEntry[ 2 ] = eachCost.probability + '%';
          tableEntry[ 3 ] = $filter('currency')(eachCost.totalCost);
          tableEntry[ 4 ] = $filter('currency')(eachCost.next12MonthsCost);
          tableEntry._id = eachCost._id;
          vm.displayedValues.push(tableEntry);
        }
        $rootScope.$broadcast('RefreshSearchTable');
        vm.showSpinner = false;
      });
    };

    function costListMenuCallback(action, tableEntry) {
      if (action === 'View') {
        $state.go('costs.view', {
          costId: tableEntry._id
        });
      }
      if (action === 'Edit') {
        $state.go('costs.edit', {
          costId: tableEntry._id
        });
      }
    }

    function openCostView(tableEntry) {
      $state.go('costs.view', {
        costId: tableEntry._id
      });
    }

    function generateExcelTemplate() {
      vm.actualsTemplateHeader = {
        saisCostId: 'costId',
        costName: 'costName',
        actual: 'actualValue'
      };
    }
  }
})();
