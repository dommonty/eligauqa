//Approvals service used to communicate Approvals REST endpoints
(function () {
  'use strict';

  angular
    .module('approvals')
    .factory('ApprovalsService', ApprovalsService);

  ApprovalsService.$inject = ['$resource'];

  function ApprovalsService($resource) {
    return $resource('api/approvals/:approvalId', {
      approvalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
