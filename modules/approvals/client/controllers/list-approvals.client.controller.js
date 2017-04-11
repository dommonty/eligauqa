(function () {
  'use strict';

  angular
    .module('approvals')
    .controller('ApprovalsListController', ApprovalsListController);

  ApprovalsListController.$inject = [ 'ApprovalsService', 'quoteResolve' ];

  function ApprovalsListController(ApprovalsService, quote) {
    var vm = this;
    vm.quote = quote;
    vm.approvals = ApprovalsService.query({ quoteId: quote._id });
  }
})();
