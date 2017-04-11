(function () {
  'use strict';

  angular
    .module('outcomes')
    .controller('OutcomesListController', OutcomesListController);

  OutcomesListController.$inject = [ 'OutcomesService', 'outcomeTeamResolve', 'Authentication' ];

  function OutcomesListController(OutcomesService, outcomeTeamResolve, Authentication) {
    var vm = this;
    vm.outcomeTeam = outcomeTeamResolve;
    vm.outcomes = [];
    vm.authentication = Authentication;

    OutcomesService.query().$promise.then(function (allOutcomes) {
      angular.forEach(allOutcomes, function (eachOutcome) {
        if (eachOutcome.outcomeTeam._id === vm.outcomeTeam._id)
          vm.outcomes.push(eachOutcome);
      });
    });


  }
})();
