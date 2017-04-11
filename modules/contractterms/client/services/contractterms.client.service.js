//Contractterms service used to communicate Contractterms REST endpoints
(function () {
  'use strict';

  angular
    .module('contractterms')
    .factory('ContracttermsService', ContracttermsService);

  ContracttermsService.$inject = ['$resource'];

  function ContracttermsService($resource) {
    return $resource('api/contractterms/:contracttermId', {
      contracttermId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
