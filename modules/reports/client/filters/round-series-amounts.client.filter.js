(function () {
  'use strict';

  angular
    .module('reports')
    .filter('roundSeriesAmounts', roundSeriesAmounts);

  roundSeriesAmounts.$inject = [ /*Example: '$state', '$window' */ ];

  function roundSeriesAmounts(/*Example: $state, $window */) {
    return function (series) {
      // Round series amounts directive logic
      // ...

      var results = [];

      for (var i = 0; i < series.length; i++)
        results.push(Math.round(series[ i ]));

      return results;

    };
  }
})();
