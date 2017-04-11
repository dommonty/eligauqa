(function () {
  'use strict';

  angular
    .module('opportunitynotes')
    .controller('OpportunitynotesListController', OpportunitynotesListController);

  OpportunitynotesListController.$inject = [ 'OpportunitynotesService', 'OpportunitiesService', '$stateParams', '$filter' ];

  function OpportunitynotesListController(OpportunitynotesService, OpportunitiesService, $stateParams, $filter) {
    var vm = this;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    buildPager();

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 8;
      vm.currentPage = 1;
    }


    vm.opportunity = OpportunitiesService.get({ opportunityId: $stateParams.opportunityId });
    OpportunitynotesService.query({ opportunityId: $stateParams.opportunityId }, function (data) {
      vm.opportunitynotes = data;
      figureOutItemsToDisplay();
    });

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.opportunitynotes, {
        $: vm.search
      });

      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      figureOutItemsToDisplay();
    }
  }
})();
