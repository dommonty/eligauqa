//Opportunities service used to communicate Opportunities REST endpoints
(function () {
  'use strict';

  angular
    .module('opportunities')
    .factory('OpportunitiesService', OpportunitiesService);

  OpportunitiesService.$inject = ['$resource'];

  function OpportunitiesService($resource) {
    return $resource('api/opportunities/:opportunityId', {
      opportunityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
