(function () {
  'use strict';

  angular
    .module('opportunityactions')
    .controller('OpportunityactionsListController', OpportunityactionsListController);

  OpportunityactionsListController.$inject = [ 'OpportunityactionsService', 'OpportunitiesService', '$stateParams' ];

  function OpportunityactionsListController(OpportunityactionsService, OpportunitiesService, $stateParams) {
    var vm = this;
    vm.assigneeId = $stateParams.assigneeId;
    var assignedActions = OpportunityactionsService.query({
      opportunityId: $stateParams.opportunityId,
      assigneeId: $stateParams.assigneeId
    });
    var allActions = OpportunityactionsService.query();

    vm.opportunityactions = assignedActions;

    if ($stateParams.opportunityId) {
      vm.opportunity = OpportunitiesService.get({
        opportunityId: $stateParams.opportunityId
      });
    }

    vm.filterStatus = function (action) {
      if (vm.hideClosed) {
        return (action.status !== 'closed');
      } else
        return true;
    };

    vm.allActionsChanged = function () {
      if (vm.showAllActions)
        vm.opportunityactions = allActions;
      else
        vm.opportunityactions = assignedActions;
    };
  }
})();
