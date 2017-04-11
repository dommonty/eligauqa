(function () {
  'use strict';

  // Performancereviews controller
  angular
    .module('performancereviews')
    .controller('EditPerformancereviewsController', EditPerformancereviewsController);

  EditPerformancereviewsController.$inject = [ '$scope', '$state', 'Authentication', 'performancereviewResolve',
    'ReviewrequestsService', '$window' ];

  function EditPerformancereviewsController($scope, $state, Authentication, performancereview, ReviewrequestsService,
                                            $window) {
    var vm = this;

    vm.authentication = Authentication;
    vm.performancereview = performancereview;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.showSave = showSave;
    vm.updateScoreGauge = updateScoreGauge;

    vm.goBack = function () {
      $state.go('performancereviews.view', {
        performancereviewId: vm.performancereview._id
      });
    };

    if (vm.performancereview._id)
      vm.score = vm.performancereview.employeeScore;
    else
      vm.score = 0;

    // Save Performancereview
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.performancereviewForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.performancereview._id) {
        vm.performancereview.$update(successCallback, errorCallback);
      } else {
        vm.performancereview.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('performancereviews.view', {
          performancereviewId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    function showSave() {
      if (vm.performancereview.immutable)
        return false;
      return vm.performancereview.assignee._id === vm.authentication.user._id;
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
    // The speed gauge

    var scoreChart = $window.Highcharts.chart('container-speed', $window.Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: vm.performancereview.maximumPossibleScore,
        title: {
          text: 'Review Score'
        }
      },

      credits: {
        enabled: false
      },

      series: [ {
        name: 'Score',
        data: [ vm.score ],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          (($window.Highcharts.theme && $window.Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">Points</span></div>'
        },
        tooltip: {
          valueSuffix: 'Points'
        }
      } ]

    }));

    function updateScoreGauge() {
      vm.score = 0;
      for (var i = 0; i < vm.performancereview.outcomes.length; i++) {
        if (vm.performancereview.outcomes[ i ].usedForScoring)
          vm.score = vm.score + Number(vm.performancereview.outcomes[ i ].score);
      }
      scoreChart.series[ 0 ].setData([ vm.score ], true);
    }
  }


})
();
