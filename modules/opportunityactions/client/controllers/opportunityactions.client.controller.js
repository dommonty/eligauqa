(function () {
  'use strict';

  // Opportunityactions controller
  angular
    .module('opportunityactions')
    .controller('OpportunityactionsController', OpportunityactionsController);

  OpportunityactionsController.$inject = [ '$scope', '$state', 'Authentication', 'opportunityactionResolve',
    'OpportunitiesService', '$stateParams', 'Admin', '$window' ];

  function OpportunityactionsController($scope, $state, Authentication, opportunityaction,
                                        OpportunitiesService, $stateParams, Admin, $window) {
    var vm = this;

    vm.authentication = Authentication;
    vm.opportunityaction = opportunityaction;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.currentDate = new Date();

    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];

    if (vm.opportunityaction._id)
      vm.opportunityaction.dueBy = new Date(vm.opportunityaction.dueBy); //ui-date-picker expects a JS Date not a string

    vm.users = Admin.query();

    vm.opportunity = OpportunitiesService.get({opportunityId: $stateParams.opportunityId});

    // Remove existing Opportunityaction
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.opportunityaction.$remove($state.go('opportunityactions.list'));
      }
    }

    // Save Opportunityaction
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.opportunityactionForm');
        return false;
      }

      vm.opportunityaction.user = vm.opportunityaction.assignee;

      // TODO: move create/update logic to service
      if (vm.opportunityaction._id) {
        vm.opportunityaction.$update(successCallback, errorCallback);
      } else {
        vm.opportunityaction.opportunity = vm.opportunity;
        vm.opportunityaction.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('opportunityactions.list', {
          opportunityId: vm.opportunity._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.openCalendar = function () {
      vm.isCalendarOpen = true;
    };

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

    var scoreChart = $window.Highcharts.chart('progresschart', $window.Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Action progress'
        }
      },

      credits: {
        enabled: false
      },

      series: [ {
        name: 'Score',
        data: [ vm.opportunityaction.progress ],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color:' +
          (($window.Highcharts.theme && $window.Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
          '<span style="font-size:12px;color:silver">Percentage</span></div>'
        },
        tooltip: {
          valueSuffix: '$'
        }
      } ]

    }));
  }
})();
