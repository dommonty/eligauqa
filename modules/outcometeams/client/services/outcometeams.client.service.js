//Outcometeams service used to communicate Outcometeams REST endpoints
(function () {
  'use strict';

  angular
    .module('outcometeams')
    .factory('OutcometeamsService', OutcometeamsService);

  OutcometeamsService.$inject = ['$resource'];

  function OutcometeamsService($resource) {
    return $resource('api/outcometeams/:outcometeamId', {
      outcometeamId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
