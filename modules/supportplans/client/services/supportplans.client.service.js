//Supportplans service used to communicate Supportplans REST endpoints
(function () {
  'use strict';

  angular
    .module('supportplans')
    .factory('SupportplansService', SupportplansService);

  SupportplansService.$inject = ['$resource'];

  function SupportplansService($resource) {
    return $resource('api/supportplans/:supportplanId', {
      supportplanId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
