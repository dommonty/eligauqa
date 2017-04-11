//Businessunits service used to communicate Businessunits REST endpoints
(function () {
  'use strict';

  angular
    .module('businessunits')
    .factory('BusinessunitsService', BusinessunitsService);

  BusinessunitsService.$inject = ['$resource'];

  function BusinessunitsService($resource) {
    return $resource('api/businessunits/:businessunitId', {
      businessunitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
