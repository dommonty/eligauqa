(function () {
  'use strict';

  angular
    .module('outcometeams')
    .controller('OutcometeamsListController', OutcometeamsListController);

  OutcometeamsListController.$inject = [ '$rootScope', '$state', 'Authentication', 'OutcometeamsService', '$filter', 'BusinessunitsService' ];

  function OutcometeamsListController($rootScope, $state, Authentication, OutcometeamsService, $filter, BusinessunitsService) {
    var vm = this;
    vm.displayedValues = [];
    vm.authentication = Authentication;
    vm.outcomeTeamListMenuCallback = outcomeTeamListMenuCallback;
    vm.businessUnits = BusinessunitsService.query();

    BusinessunitsService.get({
      businessunitId: vm.authentication.user.defaultBusinessUnit
    }).$promise.then(function (bu) {
      vm.businessUnit = bu;
      if (bu)
        vm.businessUnitChanged();
    });


    vm.outcomeTeamListTitles = [ 'Name', 'Business Unit', 'Outcome Owner' ];

    vm.businessUnitChanged = function () {
      vm.showSpinner = true;
      vm.displayedValues.splice(0, vm.displayedValues.length);
      OutcometeamsService.query({businessUnitId: vm.businessUnit._id}).$promise.then(function (data) {

        for (var i = 0; i < data.length; i++) {
          var tableEntry = {};
          var eachTeam = data[ i ];

          tableEntry[ 0 ] = eachTeam.name;
          tableEntry[ 1 ] = eachTeam.businessUnit.name;
          tableEntry[ 2 ] = eachTeam.outcomeOwner.name;
          tableEntry._id = eachTeam._id;
          vm.displayedValues.push(tableEntry);
        }
        $rootScope.$broadcast('RefreshSearchTable');
        vm.showSpinner = false;
      });
    };

    function outcomeTeamListMenuCallback(action, tableEntry) {
      if (action === 'View') {
        $state.go('outcometeams.view', {
          outcometeamId: tableEntry._id,
          probability: '70'
        });
      }
      if (action === 'Edit') {
        $state.go('outcometeams.edit', {
          outcometeamId: tableEntry._id,
          probability: '70'
        });
      }

    }
  }
})();
