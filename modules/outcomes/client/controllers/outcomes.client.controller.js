(function () {
  'use strict';

  // Outcomes controller
  angular
    .module('outcomes')
    .controller('OutcomesController', OutcomesController);

  OutcomesController.$inject = [ '$scope', '$state', 'Authentication', 'outcomeResolve', 'outcomeTeamResolve', 'PeriodsService', '$window' ];

  function OutcomesController($scope, $state, Authentication, outcome, outcomeTeamResolve, PeriodsService, $window) {
    var vm = this;

    vm.authentication = Authentication;
    vm.outcome = outcome;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.outcome.outcomeTeam = outcomeTeamResolve;
    vm.periods = PeriodsService.query();

    // Remove existing Outcome
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.outcome.$remove($state.go('outcomes.list', {
          outcometeamId: vm.outcome.outcomeTeam._id
        }));
      }
    }

    // Save Outcome
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.outcomeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.outcome._id) {
        vm.outcome.$update(successCallback, errorCallback);
      } else {
        vm.outcome.$save(successCallbackForCreate, errorCallback);
      }

      function successCallback(res) {
        $state.go('outcomes.list', {
          outcometeamId: vm.outcome.outcomeTeam._id
        });
      }

      function successCallbackForCreate(res) {
        $state.go('outcomes.list', {
          outcometeamId: vm.outcome.outcomeTeam
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    var gaugeOptions = {

      chart: {
        type: 'solidgauge'
      },

      title: null,

      pane: {
        center: [ '50%', '85%' ],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: ($window.Highcharts.theme && $window.Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },

      tooltip: {
        enabled: false
      },

      // the value axis
      yAxis: {
        stops: [
          [ 0.1, '#DF5353' ], // green
          [ 0.5, '#DDDF0D' ], // yellow
          [ 0.9, '#55BF3B' ] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    };

    var scoreChart = $window.Highcharts.chart('targetvsactualoutcomechart', $window.Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: vm.outcome.target,
        title: {
          text: 'Outcome measure'
        }
      },

      credits: {
        enabled: false
      },

      series: [ {
        name: 'Score',
        data: [ vm.outcome.actual ],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          (($window.Highcharts.theme && $window.Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">' + vm.outcome.measurementUnit + '</span></div>'
        },
        tooltip: {
          valueSuffix: '$'
        }
      } ]

    }));
  }
})();
