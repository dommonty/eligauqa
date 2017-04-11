(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportTeamStructureController', ReportTeamStructureController);

  ReportTeamStructureController.$inject = [ '$scope', 'BusinessunitsService', 'OutcometeamsService', 'OutcomesService',
    'SquadsService', 'EmployeesService', 'SquadoutcomesService', 'Authentication', 'SquadallocationsService', 'BusinessoutcomesService' ];

  function ReportTeamStructureController($scope, BusinessunitsService, OutcometeamsService, OutcomesService,
                                         SquadsService, EmployeesService, SquadoutcomesService, Authentication, SquadallocationsService, BusinessoutcomesService) {
    var vm = this;
    vm.businessUnits = BusinessunitsService.query();
    vm.allOutcomes = OutcomesService.query();
    vm.businessUnitChanged = businessUnitChanged;

    vm.allEmployees = EmployeesService.query();
    vm.allSquadOutcomes = SquadoutcomesService.query();
    vm.authentication = Authentication;
    vm.probability = 0;
    vm.showOutcomeTeam = [];
    vm.hideSquads = true;

    vm.toggleOutcomeTeam = function (outcomeTeam) {
      vm.showOutcomeTeam[ outcomeTeam._id ] = true;
      angular.forEach(vm.outcomeTeams, function (eachOutcomeTeam) {
        if (eachOutcomeTeam._id !== outcomeTeam._id) {
          vm.showOutcomeTeam[ eachOutcomeTeam._id ] = !vm.showOutcomeTeam[ eachOutcomeTeam._id ];
          if (vm.showOutcomeTeam[ eachOutcomeTeam._id ])
            vm.hideSquads = true;
          else
            vm.hideSquads = false;
        }
      });
    };

    function initializeOutcomeTeamToggles() {
      angular.forEach(vm.outcomeTeams, function (eachOutcomeTeam) {
        vm.showOutcomeTeam[ eachOutcomeTeam._id ] = true;
      });
    }


    SquadallocationsService.query().$promise.then(function (data) {
      vm.allocations = data;
    });


    function businessUnitChanged() {
      vm.showReport = true;
      vm.outcomeTeams = [];
      vm.outcomes = [];
      vm.businessUnitOutcomes = [];

      BusinessoutcomesService.query().$promise.then(function (buOutcomes) {
        angular.forEach(buOutcomes, function (eachBUOutcome) {
          if (eachBUOutcome.businessUnit._id === vm.businessUnit._id)
            vm.businessUnitOutcomes.push(eachBUOutcome);
        });
      });
      SquadsService.query({
        probability: vm.probability
      }).$promise.then(function (data) {
        vm.allSquads = data;
        vm.squads = [];
        vm.squadMembers = [];
        populateOutcomeTeams(function () {
          populateOutcomes();
          populateSquads();
          populateSquadMembers();
          populateSquadOutcomes();
          initializeOutcomeTeamToggles();
        });
      });
    }

    function populateOutcomeTeams(cb) {
      vm.outcomeTeams = [];
      OutcometeamsService.query({
        probability: vm.probability
      }).$promise.then(function (teams) {
        angular.forEach(teams, function (eachTeam) {
          if (eachTeam.businessUnit._id === vm.businessUnit._id) {
            vm.outcomeTeams.push(eachTeam);
          }
        });
        cb();
      });

    }

    //group the outcomes by outcome team id
    function populateOutcomes() {
      vm.outcomes = [];
      angular.forEach(vm.outcomeTeams, function (eachTeam) {
        angular.forEach(vm.allOutcomes, function (eachOutcome) {
          if (!vm.outcomes[ eachTeam._id ])
            vm.outcomes[ eachTeam._id ] = [];
          if (eachOutcome.outcomeTeam && eachTeam._id === eachOutcome.outcomeTeam._id)
            vm.outcomes[ eachTeam._id ].push(eachOutcome);
        });
      });
    }

    //do not use loop with call back as next function relies on results from this function
    function populateSquads() {
      for (var i = 0; i < vm.outcomeTeams.length; i++) {
        var eachTeam = vm.outcomeTeams[ i ];
        for (var j = 0; j < vm.allSquads.length; j++) {
          var eachSquad = vm.allSquads[ j ];
          if (!vm.squads[ eachTeam._id ])
            vm.squads[ eachTeam._id ] = [];
          if (eachSquad.outcomeTeam._id === eachTeam._id) {
            vm.squads[ eachTeam._id ].push(eachSquad);
          }
        }
      }
    }

    function populateSquadMembers() {
      angular.forEach(vm.allSquads, function (eachSquad) {
        angular.forEach(vm.allocations, function (eachAllocation) {
          if (!vm.squadMembers[ eachAllocation.squad._id ])
            vm.squadMembers[ eachAllocation.squad._id ] = [];
          if (eachAllocation.squad && eachAllocation.squad._id === eachSquad._id)
            vm.squadMembers[ eachSquad._id ].push(eachAllocation);
        });
      });
    }

    //group the outcomes by squad  id
    function populateSquadOutcomes() {
      vm.squadOutcomes = [];
      angular.forEach(vm.allSquads, function (eachSquad) {
        angular.forEach(vm.allSquadOutcomes, function (eachOutcome) {
          if (!vm.squadOutcomes[ eachSquad._id ])
            vm.squadOutcomes[ eachSquad._id ] = [];
          if (eachSquad._id === eachOutcome.squad._id)
            vm.squadOutcomes[ eachSquad._id ].push(eachOutcome);
        });
      });
    }
  }
})();
