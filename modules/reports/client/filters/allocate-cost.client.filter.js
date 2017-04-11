(function () {
  'use strict';

  angular
    .module('reports')
    .filter('allocateCost', allocateCost);

  allocateCost.$inject = [ /*Example: '$state', '$window' */ ];

  function allocateCost(/*Example: $state, $window */) {
    return function (costAllocation) {

      return {
        date: costAllocation.cost.forecastSeries.date,
        amount: costAllocation.cost.forecastSeries.amount * costAllocation.allocation / 100,
        description: costAllocation.cost.forecastSeries.description,
        repeat: costAllocation.cost.forecastSeries.repeat
      };

    };
  }
})();

