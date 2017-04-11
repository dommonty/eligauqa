//Ceodiscounts service used to communicate Ceodiscounts REST endpoints
(function () {
  'use strict';

  angular
    .module('ceodiscounts')
    .factory('CeodiscountsService', CeodiscountsService);

  CeodiscountsService.$inject = ['$resource'];

  function CeodiscountsService($resource) {
    return $resource('api/ceodiscounts/:ceodiscountId', {
      ceodiscountId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
