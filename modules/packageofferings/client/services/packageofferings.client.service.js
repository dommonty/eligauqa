//Packageofferings service used to communicate Packageofferings REST endpoints
(function () {
  'use strict';

  angular
    .module('packageofferings')
    .factory('PackageofferingsService', PackageofferingsService);

  PackageofferingsService.$inject = ['$resource'];

  function PackageofferingsService($resource) {
    return $resource('api/packageofferings/:packageofferingId', {
      packageofferingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
