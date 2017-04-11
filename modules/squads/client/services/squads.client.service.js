//Squads service used to communicate Squads REST endpoints
(function () {
  'use strict';

  angular
    .module('squads')
    .factory('SquadsService', SquadsService);

  SquadsService.$inject = ['$resource'];

  function SquadsService($resource) {
    return $resource('api/squads/:squadId', {
      squadId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
