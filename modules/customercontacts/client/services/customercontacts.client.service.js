//Customercontacts service used to communicate Customercontacts REST endpoints
(function () {
  'use strict';

  angular
    .module('customercontacts')
    .factory('CustomercontactsService', CustomercontactsService);

  CustomercontactsService.$inject = ['$resource'];

  function CustomercontactsService($resource) {
    return $resource('api/customercontacts/:customercontactId', {
      customercontactId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
