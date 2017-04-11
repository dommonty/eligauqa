(function () {
  'use strict';

  angular
    .module('quotes')
    .controller('QuotesListController', QuotesListController);

  QuotesListController.$inject = [ 'QuotesService', '$state', '$filter' ];

  function QuotesListController(QuotesService, $state, $filter) {
    var vm = this;

    vm.quotesMenuCallback = quoteMenuCallback;

    QuotesService.query(function (quotes) {
      vm.displayedQuotes = [];
      angular.forEach(quotes, function (eachQuote) {
        var tableEntry = {};
        tableEntry[ 0 ] = eachQuote.customer.name;
        tableEntry[ 1 ] = eachQuote.name;
        tableEntry[ 2 ] = $filter('currency')(eachQuote.totalPrice, '$', 0);
        tableEntry[ 3 ] = eachQuote.accountOwner ? eachQuote.accountOwner.displayName : 'deleted user';
        tableEntry[ 4 ] = eachQuote.region.name;
        tableEntry[ 5 ] = eachQuote.status;
        tableEntry._id = eachQuote._id;
        vm.displayedQuotes.push(tableEntry);
      });
    });

    vm.quoteTitles = [ 'Customer', 'Description', 'Quote Price', 'Account Owner', 'Region', 'Approval Status' ];


    function quoteMenuCallback(action, tableEntry) {
      if (action === 'View Quote') {
        $state.go('quotes.view', {quoteId: tableEntry._id});
      }
      if (action === 'Approvals') {
        $state.go('approvals.list', {quoteId: tableEntry._id});
      }

    }
  }
})();


