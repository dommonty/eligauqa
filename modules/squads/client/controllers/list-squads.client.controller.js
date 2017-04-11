(function () {
  'use strict';

  angular
    .module('squads')
    .controller('SquadsListController', SquadsListController);

  SquadsListController.$inject = [ '$rootScope', '$state', '$filter', 'SquadsService', 'BusinessunitsService', 'OutcometeamsService' ];

  function SquadsListController($rootScope, $state, $filter, SquadsService, BusinessunitsService, OutcometeamsService) {
    var vm = this;

    vm.squads = SquadsService.query();
    vm.businessUnits = BusinessunitsService.query();
    vm.displayedValues = [];
    vm.squadListMenuCallback = squadTeamListMenuCallback;
    vm.openSquadView = openSquadView;

    vm.squadListTitles = [ 'Name', 'Squad Owner', 'Outcome Team' ];

    vm.businessUnitChanged = function () {
      vm.outcomeTeams = OutcometeamsService.query({businessUnitId: vm.businessUnit._id});
    };

    vm.outcomeTeamChanged = function () {
      vm.showSpinner = true;
      vm.displayedValues.splice(0, vm.displayedValues.length);
      SquadsService.query({outcomeTeamId: vm.outcomeTeam._id}).$promise.then(function (data) {
        for (var i = 0; i < data.length; i++) {
          var tableEntry = {};
          var eachSquad = data[ i ];

          tableEntry[ 0 ] = eachSquad.name;
          tableEntry[ 1 ] = eachSquad.squadOwner.name;
          tableEntry[ 2 ] = eachSquad.outcomeTeam.name;
          tableEntry._id = eachSquad._id;
          vm.displayedValues.push(tableEntry);
        }
        $rootScope.$broadcast('RefreshSearchTable');
        vm.showSpinner = false;
      });
    };

    function squadTeamListMenuCallback(action, tableEntry) {
      if (action === 'View') {
        $state.go('squads.view', {
          squadId: tableEntry._id
        });
      }
      if (action === 'Edit') {
        $state.go('squads.edit', {
          squadId: tableEntry._id
        });
      }
    }

    function openSquadView(tableEntry) {
      $state.go('squads.view', {
        squadId: tableEntry._id
      });

    }
  }
})();
