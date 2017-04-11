(function () {
  'use strict';

  angular
    .module('reports')
    .directive('smartAmountsTable', smartAmountsTable);

  smartAmountsTable.$inject = [ '$filter', '$rootScope', '$moment', 'BusinessunitsService', '$window', 'roundSeriesAmountsFilter' ];

  function smartAmountsTable($filter, $rootScope, $moment, BusinessunitsService, $window, roundSeriesAmountsFilter) {
    var controller = function () {
      var vm1 = this,
        chartSeries;
      vm1.showChart = true;
      vm1.businessUnits = BusinessunitsService.query();
      vm1.setDateHeading = setDateHeading;
      vm1.setDateChanged = setDateChanged;
      vm1.buildPager = buildPager;
      vm1.figureOutItemsToDisplay = figureOutItemsToDisplay;
      vm1.greaterThanProbability = 60;
      vm1.lessThanProbability = 100;
      vm1.monthsForward = 12;


      vm1.repeatOptions = [];
      vm1.repeatOptions.push({value: 'once', description: 'Once only'});
      vm1.repeatOptions.push({value: 'monthly', description: 'Monthly'});
      vm1.repeatOptions.push({value: 'quarterly', description: 'Quarterly'});
      vm1.repeatOptions.push({value: 'half yearly', description: 'Half Yearly'});
      vm1.repeatOptions.push({value: 'yearly', description: 'Yearly'});

      vm1.startDate = Date.now();
      vm1.displayMonthIsPriorToToday = displayMonthIsPriorToToday;
      setChartDateHeading();

      function setDateChanged() {
        vm1.showSpinner = true;
        setDateHeading();
        setChartDateHeading();
        populateTableData();
        vm1.buildPager();
        drawChart();

      }

      function copyArray(anArray, numEntries) {
        var results = [];
        for (var i = 0; i < Math.min(anArray.length, numEntries); i++) {
          results[ i ] = anArray [ i ];
        }
        return results;
      }

      /*
       *returns true if the month for a column of values to be displayed is before today.
       */
      function displayMonthIsPriorToToday(monthIndex) {

        if (monthIndex === '0') //don't grey out header row
          return false;
        var _startDate = $moment(vm1.startDate);
        var _today = $moment(new Date());
        var _index = monthIndex;

        switch (_index) {
          case '99':
            _index = 10;
            break;
          case '999':
            _index = 11;
            break;
          case '9999':
            _index = 12;
            break;
          default:
            _index = _index;
        }

        var monthsDiff = _today.diff(_startDate, 'months');

        return _index <= monthsDiff;

      }

      function setDateHeading() {
        var rollingDate = $moment(vm1.startDate);
        vm1.titles = [];
        vm1.titles[ 0 ] = 'Description';
        for (var i = 1; i < vm1.monthsForward + 1; i++) {
          vm1.titles[ i ] = (rollingDate.format('MMM YY'));
          rollingDate.add(1, 'M');
        }

      }

      function setChartDateHeading() {
        vm1.chartTitles = [];
        var rollingDate = $moment(vm1.startDate);
        for (var i = 0; i < vm1.monthsForward; i++) {
          vm1.chartTitles[ i ] = (rollingDate.format('MMM YY'));
          rollingDate.add(1, 'M');
        }
      }

      function populateTableData() {
        vm1.entries = [];
        vm1.monthsTotals = [];
        vm1.cumulativeMonthsTotals = [];
        vm1.cumulativeMonthsTotals[ 0 ] = 0;
        vm1.grandTotal = 0;
        chartSeries = [];
        // vm1.tableCategories = [];
        for (var i1 = 0; i1 < vm1.monthsForward; i1++)
          vm1.monthsTotals[ i1 ] = 0;

        angular.forEach(vm1.rules,
          function (rulesObj) {
            populateTableDataForRules(rulesObj);
          });
        for (var i2 = 0; i2 < vm1.monthsTotals.length; i2++)
          vm1.grandTotal = vm1.grandTotal + vm1.monthsTotals[ i2 ];

        chartSeries.push(
          {
            name: 'Total',
            data: roundSeriesAmountsFilter(copyArray(vm1.monthsTotals, vm1.monthsForward))
          });

        chartSeries.push(
          {
            name: 'Cumulative Total',
            data: roundSeriesAmountsFilter(copyArray(vm1.cumulativeMonthsTotals, vm1.monthsForward))
          });


      }

      function amountEntryMatchesRepeatSelection(amountSeries) {
        for (var i = 0; i < amountSeries.length; i++) {
          if (amountSeries[ i ].repeat === vm1.repeat.value)
            return true;
        }
        return false;
      }

      function populateTableDataForRules(rulesObj) {
        var subTotals = [];
        for (var i1 = 0; i1 < vm1.monthsForward; i1++)
          subTotals[ i1 ] = 0;

        if (rulesObj.groupName) {
          var groupHeaderEntry = {
            series: {}
          };
          groupHeaderEntry.series[ 0 ] = rulesObj.groupName;
          for (var g = 1; g < 12; g++)
            groupHeaderEntry.series[ g ] = '';
          groupHeaderEntry.header = true;
          vm1.entries.push(groupHeaderEntry);
        }

        for (var i = 0; i < rulesObj.groupEntries.length; i++) {
          var eachAmountEntry = rulesObj.groupEntries[ i ];

          if (!vm1.businessUnit || (vm1.businessUnit && vm1.businessUnit._id === eachAmountEntry.businessUnit._id))
            if (!vm1.greaterThanProbability || (vm1.greaterThanProbability && eachAmountEntry.probability >= vm1.greaterThanProbability))
              if (!vm1.lessThanProbability || (vm1.lessThanProbability && eachAmountEntry.probability <= vm1.lessThanProbability))
                if (!vm1.repeat || (vm1.repeat && amountEntryMatchesRepeatSelection(eachAmountEntry.series))) {
                  var tableEntry = {
                    series: {}
                  };
                  tableEntry.series[ 0 ] = eachAmountEntry.name;
                  var amountSeries = getAmounts(vm1.startDate, vm1.monthsForward, eachAmountEntry.series, eachAmountEntry.term, eachAmountEntry.actuals);
                  for (var j = 0; j < 9; j++) {
                    tableEntry.series[ (j + 1) ] = $filter('currency')(amountSeries[ j ], '$', 0);
                    vm1.monthsTotals[ j ] = vm1.monthsTotals[ j ] + amountSeries[ j ];
                    if (j === 0)
                      vm1.cumulativeMonthsTotals[ j ] = vm1.monthsTotals[ j ];
                    else
                      vm1.cumulativeMonthsTotals[ j ] = vm1.cumulativeMonthsTotals[ j - 1 ] + vm1.monthsTotals[ j ];
                    subTotals[ j ] = subTotals[ j ] + amountSeries[ j ];
                  }
                  //index with 99 and 999 to ensure cell order is preserved
                  tableEntry.series[ 99 ] = $filter('currency', 0)(amountSeries[ 9 ], '$', 0);
                  vm1.monthsTotals[ 9 ] = vm1.monthsTotals[ 9 ] + amountSeries[ 9 ];
                  vm1.cumulativeMonthsTotals[ 9 ] = vm1.cumulativeMonthsTotals[ 8 ] + vm1.monthsTotals[ 9 ];
                  subTotals[ 9 ] = subTotals[ 9 ] + amountSeries[ 9 ];
                  tableEntry.series[ 999 ] = $filter('currency', 0)(amountSeries[ 10 ], '$', 0);
                  vm1.monthsTotals[ 10 ] = vm1.monthsTotals[ 10 ] + amountSeries[ 10 ];
                  vm1.cumulativeMonthsTotals[ 10 ] = vm1.cumulativeMonthsTotals[ 9 ] + vm1.monthsTotals[ 10 ];
                  subTotals[ 10 ] = subTotals[ 10 ] + amountSeries[ 10 ];
                  tableEntry.series[ 9999 ] = $filter('currency', 0)(amountSeries[ 11 ], '$', 0);
                  vm1.monthsTotals[ 11 ] = vm1.monthsTotals[ 11 ] + amountSeries[ 11 ];
                  vm1.cumulativeMonthsTotals[ 11 ] = vm1.cumulativeMonthsTotals[ 10 ] + vm1.monthsTotals[ 11 ];
                  subTotals[ 11 ] = subTotals[ 11 ] + amountSeries[ 11 ];
                  tableEntry.series[ 99999 ] = $filter('currency', 0)(amountSeries[ 12 ], '$', 0); //row total
                  tableEntry._id = eachAmountEntry._id;
                  vm1.entries.push(tableEntry);
                }
        }


        var groupTotal = {
          series: {}
        };
        var subTotalsSum = 0;
        groupTotal.series[ 0 ] = 'Sub Total';
        for (var t = 0; t < 9; t++) {
          groupTotal.series[ t + 1 ] = $filter('currency', 0)(subTotals[ t ], '$', 0);
          subTotalsSum = subTotalsSum + subTotals[ t ];
        }
        //index with 99 and 999 to ensure cell order is preserved
        groupTotal.series[ 99 ] = $filter('currency', 0)(subTotals[ 9 ], '$', 0);
        subTotalsSum = subTotalsSum + subTotals[ 9 ];
        groupTotal.series[ 999 ] = $filter('currency', 0)(subTotals[ 10 ], '$', 0);
        subTotalsSum = subTotalsSum + subTotals[ 10 ];
        groupTotal.series[ 9999 ] = $filter('currency', 0)(subTotals[ 11 ], '$', 0);
        subTotalsSum = subTotalsSum + subTotals[ 11 ];
        groupTotal.series[ 99999 ] = $filter('currency', 0)(subTotalsSum, '$', 0);

        groupTotal.bold = true;
        vm1.entries.push(groupTotal);

        if (subTotalsSum !== 0)
          chartSeries.push(
            {
              name: rulesObj.groupName,
              data: roundSeriesAmountsFilter(copyArray(subTotals, vm1.monthsForward))
            })
          ;

      }

      //assume amountSeries is [{date, amount, description, repeat}]  -  seeopportunity.server.model.js
      //returns an array of amounts [amount].  Assumes months are consecutive
      //actuals optional.  If actuals exist then no forcast data displayed in the past
      function getAmounts(startDate, monthsForward, amountSeries, term, actuals) {
        var amountResults = [];
        var rollingDate = $moment(startDate);
        var rowTotal = 0;

        for (var j = 0; j < monthsForward; j++) {
          var monthlyAmount = 0;
          if (actuals && actuals.length > 0 && rollingDate.isBefore(Date.now(), 'month')) {
            for (var a = 0; a < actuals.length; a++) {
              var eachActual = actuals[ a ];
              if (rollingDate.isSame(eachActual.dateCreated, 'month'))
                monthlyAmount = monthlyAmount + eachActual.amount;
            }
          } else {
            for (var i = 0; i < amountSeries.length; i++) {
              var amountObj = amountSeries[ i ];
              var amountObjDate = new Date(amountObj.date);
              var maxDate = $moment(amountObjDate).add(term, 'Y');
              switch (amountObj.repeat) {
                case 'once':
                  if (rollingDate.get('month') === amountObjDate.getMonth() && rollingDate.get('year') === amountObjDate.getFullYear()) {
                    monthlyAmount = monthlyAmount + amountObj.amount;
                  }
                  break;
                case 'monthly':
                  if (rollingDate.isSameOrAfter(amountObjDate, 'month') && rollingDate.isSameOrBefore(maxDate, 'month')) {
                    monthlyAmount = monthlyAmount + amountObj.amount;
                  }
                  break;
                case 'quarterly':
                  if (rollingDate.isSameOrAfter(amountObjDate, 'month') && rollingDate.isSameOrBefore(maxDate, 'month')) {
                    if (rollingDate.diff(amountObjDate, 'months') % 3 === 0)
                      monthlyAmount = monthlyAmount + amountObj.amount;
                  }
                  break;
                case 'half yearly':
                  if (rollingDate.isSameOrAfter(amountObjDate, 'month') && rollingDate.isSameOrBefore(maxDate, 'month')) {
                    if (rollingDate.diff(amountObjDate, 'months') % 6 === 0)
                      monthlyAmount = monthlyAmount + amountObj.amount;
                  }
                  break;
                case 'yearly':
                  if (rollingDate.isSameOrAfter(amountObjDate, 'month') && rollingDate.isSameOrBefore(maxDate, 'month')) {
                    if (rollingDate.diff(amountObjDate, 'months') % 12 === 0)
                      monthlyAmount = monthlyAmount + amountObj.amount;
                  }
                  break;
                default:
                  monthlyAmount = monthlyAmount;
              }
            }
          }
          amountResults.push(monthlyAmount);
          rollingDate.add(1, 'M');
          rowTotal = rowTotal + monthlyAmount;
        }
        amountResults.push(rowTotal);
        return amountResults;
      }

      vm1.menuClicked = function (menuItem, rowEntry) {
        vm1.menuCallback()(menuItem, rowEntry);
      };

      vm1.openCalendar = function () {
        vm1.isCalendarOpen = true;
      };

      function buildPager() {
        vm1.pagedItems = [];
        vm1.itemsPerPage = 10000;
        vm1.currentPage = 1;
        vm1.figureOutItemsToDisplay();
      }

      vm1.isImage = function (key) {
        return key === 'imageSrc';
      };

      function figureOutItemsToDisplay() {
        vm1.filteredItems = $filter('filter')(vm1.entries, {
          $: vm1.search
        });
        vm1.filterLength = vm1.filteredItems.length;
        var begin = ((vm1.currentPage - 1) * vm1.itemsPerPage);
        var end = begin + vm1.itemsPerPage;
        vm1.pagedItems = vm1.filteredItems.slice(begin, end);

      }

      vm1.pageChanged = function () {
        vm1.figureOutItemsToDisplay();
      };

      vm1.toggleChart = function () {
        vm1.showChart = !vm1.showChart;
      };

      $rootScope.$on('RefreshSmartAmountsTable', function (event) {
        setDateChanged();
      });

      function drawChart() {
        $window.Highcharts.chart('report-container', {
          chart: {
            type: 'areaspline'
          },
          title: {
            text: ''
          },
          legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: false,
            borderWidth: 1,
            backgroundColor: ($window.Highcharts.theme && $window.Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
          },
          xAxis: {
            categories: vm1.chartTitles,
            // plotBands: [ {
            //   from: 4.5,
            //   to: 6.5,
            //   color: 'rgba(68, 170, 213, .2)'
            // } ]
          },
          yAxis: {
            title: {
              text: 'Amounts ($)'
            }
          },
          tooltip: {
            shared: true,
            valuePrefix: '$ '
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            areaspline: {
              fillOpacity: 0.3
            }
          },
          series: chartSeries
        });
        vm1.showSpinner = false;
      }
    };


    return {
      templateUrl: 'modules/reports/client/directives/smart-amounts-table.client.view.html',
      restrict: 'E',
      controller: controller,
      controllerAs: 'vm1',
      bindToController: true,
      scope: {
        rules: '=',  //rules = [{name: 'name', businessUnit, series: [{date, amount, repeat}]]
        menuCallback: '&',
        menuItemLabels: '='
      }

    };
  }
})();


