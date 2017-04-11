(function () {
  'use strict';

  // Squadoutcomes controller
  angular
    .module('squadoutcomes')
    .controller('SquadoutcomesController', SquadoutcomesController);

  SquadoutcomesController.$inject = [ '$scope', '$state', 'Authentication', 'squadoutcomeResolve', 'squadResolve', 'PeriodsService', '$window' ];

  function SquadoutcomesController($scope, $state, Authentication, squadoutcome, squadResolve, PeriodsService, $window) {
    var vm = this;
    vm.squad = squadResolve;

    vm.authentication = Authentication;
    vm.squadoutcome = squadoutcome;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.squadoutcome.squad = vm.squad;
    vm.periods = PeriodsService.query();

    // Remove existing Squadoutcome
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.squadoutcome.$remove($state.go('squadoutcomes.list', {
          squadId: vm.squadoutcome.squad._id
        }));
      }
    }

    // Save Squadoutcome
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.squadoutcomeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.squadoutcome._id) {
        vm.squadoutcome.$update(successCallback, errorCallback);
      } else {
        vm.squadoutcome.$save(successCallbackForCreate, errorCallback);
      }

      function successCallback(res) {
        $state.go('squadoutcomes.list', {
          squadId: vm.squadoutcome.squad._id
        });
      }

      function successCallbackForCreate(res) {

        console.log(vm.squadoutcome.squad);
        $state.go('squadoutcomes.list', {
          squadId: vm.squadoutcome.squad
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

    var scoreChart = $window.Highcharts.chart('targetvsactualsquadoutcomechart', $window.Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: vm.squadoutcome.target,
        title: {
          text: 'Outcome measure'
        }
      },

      credits: {
        enabled: false
      },

      series: [ {
        name: 'Score',
        data: [ vm.squadoutcome.actual ],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          (($window.Highcharts.theme && $window.Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">' + vm.squadoutcome.measurementUnit + '</span></div>'
        },
        tooltip: {
          valueSuffix: '$'
        }
      } ]

    }));
  }
})();


