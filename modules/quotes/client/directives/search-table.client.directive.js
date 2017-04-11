(function () {
  'use strict';

  angular
    .module('quotes')
    .directive('searchTable', searchTable);

  searchTable.$inject = [ '$filter', '$rootScope', '$localStorage' ];

  function searchTable($filter, $rootScope, $localStorage) {
    var controller = function () {
      var vm1 = this;
      vm1.figureOutItemsToDisplay = figureOutItemsToDisplay;
      console.log(vm1.lsKey);
      if (vm1.lsKey && $localStorage[ vm1.lsKey ]) {
        vm1.search = $localStorage[ vm1.lsKey ];
        figureOutItemsToDisplay();
      }


      vm1.menuClicked = function (menuItem, rowEntry) {
        $localStorage[ vm1.lsKey ] = vm1.search;
        vm1.menuCallback()(menuItem, rowEntry);
      };

      vm1.viewLinkClicked = function (rowEntry) {
        $localStorage[ vm1.lsKey ] = vm1.search;
        vm1.viewLinkCallback()(rowEntry);
      };

      vm1.buildPager = function () {
        vm1.pagedItems = [];
        vm1.itemsPerPage = 15;
        vm1.currentPage = 1;
        vm1.figureOutItemsToDisplay();
      };

      vm1.isImage = function (key) {
        console.log('search key = ' + key);
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

      vm1.buildPager();

      $rootScope.$on('RefreshSearchTable', function (event) {
        vm1.buildPager();
      });
    };

    return {
      templateUrl: 'modules/quotes/client/directives/search-table.client.view.html',
      restrict: 'E',
      controller: controller,
      controllerAs: 'vm1',
      bindToController: true,
      scope: {
        titles: '=',
        entries: '=',
        menuCallback: '&',
        viewLinkCallback: '&',
        menuItemLabels: '=',
        lsKey: '@'
      }

    };
  }
})();
