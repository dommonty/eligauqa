//Squadoutcomes service used to communicate Squadoutcomes REST endpoints
(function () {
  'use strict';

  angular
    .module('squadoutcomes')
    .factory('SquadoutcomesService', SquadoutcomesService);

  SquadoutcomesService.$inject = ['$resource'];

  function SquadoutcomesService($resource) {
    return $resource('api/squadoutcomes/:squadoutcomeId', {
      squadoutcomeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
