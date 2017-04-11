//Quotes service used to communicate Quotes REST endpoints
(function () {
  'use strict';

  angular
    .module('quotes')
    .factory('QuotesService', QuotesService);

  QuotesService.$inject = ['$resource'];

  function QuotesService($resource) {
    return $resource('api/quotes/:quoteId', {
      quoteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
