(function () {
  'use strict';

  angular
    .module('squadoutcomes')
    .controller('SquadoutcomesListController', SquadoutcomesListController);

  SquadoutcomesListController.$inject = [ 'SquadoutcomesService', 'squadResolve', 'Authentication' ];

  function SquadoutcomesListController(SquadoutcomesService, squadResolve, Authentication) {
    var vm = this;
    vm.squad = squadResolve;
    vm.authentication = Authentication;

    SquadoutcomesService.query().$promise.then(function (outcomes) {
      vm.squadoutcomes = [];
      angular.forEach(outcomes, function (eachOutcome) {
        if (eachOutcome.squad._id === vm.squad._id)
          vm.squadoutcomes.push(eachOutcome);
      });
    });
  }
})();
