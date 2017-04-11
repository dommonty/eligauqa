(function () {
  'use strict';

  // Businessoutcomes controller
  angular
    .module('businessoutcomes')
    .controller('BusinessoutcomesController', BusinessoutcomesController);

  BusinessoutcomesController.$inject = [ '$scope', '$state', 'Authentication', 'businessoutcomeResolve', 'businessUnitResolve', 'PeriodsService', '$window' ];

  function BusinessoutcomesController($scope, $state, Authentication, businessoutcome, businessUnitResolve, PeriodsService, $window) {
    var vm = this;

    vm.authentication = Authentication;
    vm.businessoutcome = businessoutcome;
    vm.businessUnit = businessUnitResolve;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.businessoutcome.businessUnit = vm.businessUnit;
    vm.periods = PeriodsService.query();

    // Remove existing Businessoutcome
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.businessoutcome.$remove($state.go('businessoutcomes.list', {
          businessunitId: vm.businessUnit._id
        }));
      }
    }

    // Save Businessoutcome
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.businessoutcomeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.businessoutcome._id) {
        vm.businessoutcome.$update(successCallback, errorCallback);
      } else {
        vm.businessoutcome.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('businessoutcomes.list', {
          businessunitId: vm.businessUnit._id
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

    var scoreChart = $window.Highcharts.chart('targetvsactualchart', $window.Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: vm.businessoutcome.target,
        title: {
          text: 'Outcome measure'
        }
      },

      credits: {
        enabled: false
      },

      series: [ {
        name: 'Score',
        data: [ vm.businessoutcome.actual ],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          (($window.Highcharts.theme && $window.Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">' + vm.businessoutcome.measurementUnit + '</span></div>'
        },
        tooltip: {
          valueSuffix: '$'
        }
      } ]

    }));
  }
})();

