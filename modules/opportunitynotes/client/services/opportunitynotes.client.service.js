//Opportunitynotes service used to communicate Opportunitynotes REST endpoints
(function () {
  'use strict';

  angular
    .module('opportunitynotes')
    .factory('OpportunitynotesService', OpportunitynotesService);

  OpportunitynotesService.$inject = ['$resource'];

  function OpportunitynotesService($resource) {
    return $resource('api/opportunitynotes/:opportunitynoteId', {
      opportunitynoteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
