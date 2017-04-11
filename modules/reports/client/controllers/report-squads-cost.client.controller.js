(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportSquadsCostController', ReportSquadsCostController);

  ReportSquadsCostController.$inject = [ '$rootScope', '$state', 'SquadsService', 'BusinessunitsService' ];

  function ReportSquadsCostController($rootScope, $state, SquadsService, BusinessunitsService) {
    var vm = this;
    vm.squadCostListMenuCallback = squadCostListMenuCallback;

    vm.squadsGroupedByOutcomeTeams = [];

    SquadsService.query({
      probability: 0,
      deepPopulate: true
    }).$promise.then(function (data) {

      var entriesGroupedByOutcomeTeamId = [];
      for (var i = 0; i < data.length; i++) {
        var group = entriesGroupedByOutcomeTeamId[ data[ i ].outcomeTeam._id ];
        if (!group) {
          group = {
            groupEntries: [],
            groupName: data[ i ].outcomeTeam.name
          };
          entriesGroupedByOutcomeTeamId[ data[ i ].outcomeTeam._id ] = group;
        }
        populateSquad(data[ i ], group);
      }
      for (var outcomeId in entriesGroupedByOutcomeTeamId) {
        vm.squadsGroupedByOutcomeTeams.push(entriesGroupedByOutcomeTeamId[ outcomeId ]);
      }
    });

    function populateSquad(squad, group) {
      BusinessunitsService.get({
        businessunitId: squad.outcomeTeam.businessUnit._id
      }).$promise.then(function (businessUnit) {
        group.groupEntries.push({
          name: squad.name,
          businessUnit: businessUnit,
          probability: 100,
          actuals: squad.actuals,
          series: [ {
            date: squad.created,
            amount: squad.baseSquadCost / 12,
            repeat: 'monthly'
          } ],
          term: 5,
          _id: squad._id
        });
        //$rootScope.$broadcast('RefreshSmartAmountsTable');
      });
    }

    function squadCostListMenuCallback(action, tableEntry) {
      $state.go('squads.view', {
        squadId: tableEntry._id
      });

    }

  }
})();

