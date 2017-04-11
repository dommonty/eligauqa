(function () {
  'use strict';

  // Quotes controller
  angular
    .module('quotes')
    .controller('QuotesViewController', QuotesViewController);

  QuotesViewController.$inject = [ '$scope', '$state', 'Authentication', 'quoteResolve' ];

  function QuotesViewController($scope, $state, Authentication, quote) {
    var vm = this;

    vm.authentication = Authentication;
    vm.quote = quote;

    vm.remove = remove;

    // Remove existing Quote
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.quote.$remove($state.go('quotes.list'));
      }
    }

    vm.discountedPrice = function (price) {
      var contractDiscount = (price * vm.quote.contractPeriod.discount / 100);
      var ceoDiscount = (price * vm.quote.ceoDiscount.discount / 100);
      return vm.priceWithSupport(price) - contractDiscount - ceoDiscount;
    };

    vm.priceWithSupport = function (price) {
      var supportCharge = (price * vm.quote.supportPlan.premium / 100);
      return price + supportCharge;
    };

  }
})();


