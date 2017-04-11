(function () {
  'use strict';

  // Projects controller
  angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = [ '$scope', '$state', 'Authentication', 'projectResolve', 'CustomersService',
    'OutcometeamsService', '$window', 'BusinessunitsService', 'SquadsService' ];

  function ProjectsController($scope, $state, Authentication, project, CustomersService,
                              OutcometeamsService, $window, BusinessunitsService, SquadsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.project = project;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.customers = CustomersService.query();
    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];
    vm.allOutcomeTeams = vm.outcomeTeams = OutcometeamsService.query();
    var storyPointsScale, chartSeries;
    vm.updateOutcomeTeamsList = updateOutcomeTeamsList;
    vm.outcomeTeamChanged = outcomeTeamChanged;

    vm.businessUnits = BusinessunitsService.query();

    function updateOutcomeTeamsList() {
      vm.outcomeTeams = [];
      for (var i = 0; i < vm.allOutcomeTeams.length; i++) {
        var eachTeam = vm.allOutcomeTeams[ i ];
        if (eachTeam.businessUnit._id === vm.project.businessUnit._id)
          vm.outcomeTeams.push(eachTeam);
      }
    }

    function outcomeTeamChanged() {
      vm.projectManagers = [];
      SquadsService.query({outcomeTeamId: vm.project.outcomeTeam._id}).$promise.then(function (squads) {
        angular.forEach(squads, function (eachSquad) {
          vm.projectManagers.push(eachSquad.squadOwner);
        });
      });
    }

    if (vm.project._id) {
      outcomeTeamChanged();
      vm.project.startDate = new Date(vm.project.startDate); //ui-date-picker expects a JS Date not a string
      vm.project.endDate = new Date(vm.project.endDate);
      if (project.advisoryCommitteeApprovalDate)
        vm.project.advisoryCommitteeApprovalDate = new Date(vm.project.advisoryCommitteeApprovalDate);
    }

    calculateChartAxisData();

    // Remove existing Project
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.project.$remove($state.go('projects.list'));
      }
    }

    // Save Project
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.projectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.project._id) {
        vm.project.$update(successCallback, errorCallback);
      } else {
        vm.project.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('projects.view', {
          projectId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.openStartCalendar = function () {
      vm.isStartCalendarOpen = true;
    };

    vm.openEndCalendar = function () {
      vm.isEndCalendarOpen = true;
    };

    vm.openAdvisoryCalendar = function () {
      vm.isAdvisoryCalendarOpen = true;
    };

    function calculateChartAxisData() {
      storyPointsScale = [];
      chartSeries = [
        {
          name: 'Estimated',
          data: []
        },
        {
          name: 'Actual',
          data: []
        }
      ];

      if (vm.project.plannedSprints > 0) {
        var pointsPerStoryPoint = Math.round(vm.project.estimatedStoryPoints / vm.project.plannedSprints);
        var storyPointsLeft = vm.project.estimatedStoryPoints;
        var sprintCount = 0;
        var actualStoryPointsLeft = vm.project.estimatedStoryPoints;
        for (var i = 1; i <= vm.project.plannedSprints + 1; i++) {
          storyPointsScale.push(sprintCount);
          chartSeries[ 0 ].data.push(Math.round(storyPointsLeft));
          chartSeries[ 1 ].data.push(Math.round(actualStoryPointsLeft));
          storyPointsLeft = storyPointsLeft - pointsPerStoryPoint;
          if (vm.project.sprints.length >= i)
            actualStoryPointsLeft = actualStoryPointsLeft - vm.project.sprints[ i - 1 ].actualStoryPoints;
          sprintCount = i;
        }
      }

    }

    $window.Highcharts.chart('burndown-container', {
      chart: {
        type: 'area',
        inverted: false
      },
      title: {
        text: 'Project Burn Down Chart'
      },
      subtitle: {
        style: {
          position: 'absolute',
          right: '0px',
          bottom: '10px'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor: ($window.Highcharts.theme && $window.Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
      },
      xAxis: {
        categories: storyPointsScale,
        title: {
          text: 'Sprint Number'
        }
      },
      yAxis: {
        title: {
          text: 'Story Points'
        },
        labels: {
          formatter: function () {
            return this.value;
          }
        },
        min: 0
      },
      plotOptions: {
        area: {
          fillOpacity: 0.5
        }
      },
      series: chartSeries
    });
  }
})();
