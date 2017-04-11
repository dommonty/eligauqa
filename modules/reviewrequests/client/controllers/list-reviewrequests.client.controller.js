(function () {
  'use strict';

  angular
    .module('reviewrequests')
    .controller('ReviewrequestsListController', ReviewrequestsListController);

  ReviewrequestsListController.$inject = [ 'ReviewrequestsService', '$filter' ];

  function ReviewrequestsListController(ReviewrequestsService, $filter) {
    var vm = this;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 8;
      vm.currentPage = 1;
      figureOutItemsToDisplay();
    }

    ReviewrequestsService.query(function(data) {
      vm.reviewrequests = data;
      buildPager();
    });


    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.reviewrequests, {
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
