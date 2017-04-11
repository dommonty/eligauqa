//Opportunityactions service used to communicate Opportunityactions REST endpoints
(function () {
  'use strict';

  angular
    .module('opportunityactions')
    .factory('OpportunityactionsService', OpportunityactionsService);

  OpportunityactionsService.$inject = ['$resource'];

  function OpportunityactionsService($resource) {
    return $resource('api/opportunityactions/:opportunityactionId', {
      opportunityactionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
