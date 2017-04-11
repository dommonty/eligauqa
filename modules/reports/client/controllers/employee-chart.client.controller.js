(function () {
  'use strict';

  angular
    .module('reports')
    .controller('EmployeeChartController', EmployeeChartController);

  EmployeeChartController.$inject = [ '$scope', '$window', 'BusinessunitsService', '$filter', 'OutcometeamsService', 'SquadsService',
    'SquadallocationsService' ];

  function EmployeeChartController($scope, $window, BusinessunitsService, $filter, OutcometeamsService, SquadsService,
                                   SquadallocationsService) {
    var vm = this;
    vm.businessUnits = BusinessunitsService.query();
    vm.squads = SquadsService.query();
    vm.squadAllocations = SquadallocationsService.query();

    vm.businessUnitChanged = function () {
      vm.outcomeTeamNames = [];
      vm.squadsByTeam = [];
      vm.allocationsBySquad = [];
      OutcometeamsService.query().$promise.then(function (_teams) {
        vm.outcomeTeams = $filter('filter')(_teams, {
          businessUnit: {
            _id: vm.businessUnit._id
          }
        });
        angular.forEach(vm.outcomeTeams, function (eachTeam) {
          vm.outcomeTeamNames.push(eachTeam.name);
          vm.squadsByTeam[ eachTeam._id ] = $filter('filter')(vm.squads, {
            outcomeTeam: {
              _id: eachTeam._id
            }
          });
        });
        angular.forEach(vm.squads, function (eachSquad) {
          vm.allocationsBySquad[ eachSquad._id ] = $filter('filter')(vm.squadAllocations, {
            squad: {
              _id: eachSquad._id
            }
          });
        });
        init();
      });
    };

    function getSquadNamesForTeam(team) {
      var squadNames = [];
      for (var i = 0; i < vm.squadsByTeam[ team._id ].length; i++) {
        squadNames.push(vm.squadsByTeam[ team._id ][ i ].name);
      }
      return squadNames;
    }

    function getEmployeeNamesForSquad(squad) {
      var employeeNames = '';
      for (var i = 0; i < vm.allocationsBySquad[ squad._id ].length; i++) {
        employeeNames = employeeNames + vm.allocationsBySquad[ squad._id ][ i ].employee.name + '\n';
      }
      return employeeNames;
    }

    function drilldownForTeam(team) {
      var results = {};
      results.name = team.name;
      results.id = team.name;
      results.data = [];
      for (var i = 0; i < vm.squadsByTeam[ team._id ].length; i++) {
        results.data.push([ vm.squadsByTeam[ team._id ][ i ].name, getPercentageForSquad(vm.squadsByTeam[ team._id ][ i ], team)
        ]);
      }

      return results;
    }

    function getPercentageForTeam(outcomeTeam) {

      return (numberOfEmployeesInOutcomeTeam(outcomeTeam) / vm.squadAllocations.length).toFixed(1) * 100;
    }

    function numberOfEmployeesInOutcomeTeam(outcomeTeam) {
      var count = 0;
      for (var teamId in vm.squadsByTeam) {
        if (teamId === outcomeTeam._id) {
          for (var i = 0; i < vm.squadsByTeam[ teamId ].length; i++) {
            var squad = vm.squadsByTeam [ teamId ][ i ];
            count = count + vm.allocationsBySquad[ squad._id ].length;
          }
        }
      }
      return count;
    }

    function getPercentageForSquad(squad, outcomeTeam) {
      return (vm.allocationsBySquad[ squad._id ].length / numberOfEmployeesInOutcomeTeam(outcomeTeam)).toFixed(1) * 100;
    }

    function init() {
      var data = [],
        drilldown = [];

      for (var i = 0; i < vm.outcomeTeams.length; i++) {
        data.push({
          name: vm.outcomeTeams[ i ].name,
          y: getPercentageForTeam(vm.outcomeTeams[ i ]),
          drilldown: vm.outcomeTeams[ i ].name
        });
        drilldown.push(drilldownForTeam(vm.outcomeTeams[ i ]));
      }
      var chartData = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Team Sizes'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.y:.1f}%'
            }
          }
        },
        series: [ {
          type: 'pie',
          name: 'Outcome teams',
          data: data
        } ],
        drilldown: {
          series: drilldown
        }
      };
      $window.Highcharts.chart('employee-chart-container', chartData);
      console.log(chartData);

    }
  }
})();
