(function () {
  'use strict';

  angular
    .module('reports')
    .controller('CustomersAnnuityChartController', CustomersAnnuityChartController);

  CustomersAnnuityChartController.$inject = [ '$scope', '$window', 'BusinessunitsService', '$filter', 'CustomersService' ];

  function CustomersAnnuityChartController($scope, $window, BusinessunitsService, $filter, CustomersService) {
    var vm = this;
    vm.businessUnits = BusinessunitsService.query();

    vm.businessUnitChanged = function () {
      vm.customers = [];
      vm.showSpinner = true;
      vm.totalAnnuity = 0;
      CustomersService.query(
        {
          populateForReporting: true,
          businessUnitId: vm.businessUnit._id
        }).$promise.then(function (customers) {
        for (var i = 0; i < customers.length; i++) {
          if (customers[ i ].annualRevenue > 0)
            vm.customers.push(customers[ i ]);
          vm.totalAnnuity = vm.totalAnnuity + customers[ i ].annualRevenue;
        }
        vm.showSpinner = false;
        init();
      });


    };


    function init() {
      var data = [];

      for (var i = 0; i < vm.customers.length; i++) {
        data.push(
          {
            name: vm.customers[ i ].name,
            y: vm.customers[ i ].annualRevenue
          });
      }

      var chartData = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Annual Revenue (total = ' + $filter('currency')(vm.totalAnnuity, '$', 0) + ' )'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '{point.name}: ${point.y:,.0f}'
            }
          }
        },
        series: [ {
          type: 'pie',
          name: 'Customers',
          data: data
        } ]
      };
      $window.Highcharts.chart('customers-annuity-chart-container', chartData);


    }
  }
})
();
