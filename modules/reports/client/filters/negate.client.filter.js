(function () {
  'use strict';

  angular
    .module('reports')
    .filter('negateActualAmount', negateActualAmount);

  negateActualAmount.$inject = [ /*Example: '$state', '$window' */ ];

  function negateActualAmount(/*Example: $state, $window */) {
    return function (actuals) {
      //input must be an array of actuals
      var negatedActuals = [];
      for (var i = 0; i < actuals.length; i++) {
        negatedActuals.push({
          dateCreated: actuals[ i ].dateCreated,
          amount: actuals[ i ].amount * -1,
          description: actuals[ i ].description
        });
      }
      return negatedActuals;
    };
  }
})();
