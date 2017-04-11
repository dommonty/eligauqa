(function () {
  'use strict';

  angular
    .module('performancereviews')
    .controller('PerformancereviewsListController', PerformancereviewsListController);

  PerformancereviewsListController.$inject = [ 'PerformancereviewsService', '$stateParams', 'Authentication' ];

  function PerformancereviewsListController(PerformancereviewsService, $stateParams, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    if (vm.authentication.user.isAdmin || vm.authentication.user.isHRAdmin)
      vm.performancereviews = PerformancereviewsService.query(
        {
          reviewRequestId: $stateParams.reviewrequestId,
        });
    else
      vm.performancereviews = PerformancereviewsService.query(
        {
          reviewRequestId: $stateParams.reviewrequestId,
          assigneeId: $stateParams.assigneeId ? $stateParams.assigneeId : vm.authentication.user._id
        });
  }
})();
