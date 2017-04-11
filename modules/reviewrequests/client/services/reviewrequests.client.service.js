//Reviewrequests service used to communicate Reviewrequests REST endpoints
(function () {
  'use strict';

  angular
    .module('reviewrequests')
    .factory('ReviewrequestsService', ReviewrequestsService);

  ReviewrequestsService.$inject = ['$resource'];

  function ReviewrequestsService($resource) {
    return $resource('api/reviewrequests/:reviewrequestId', {
      reviewrequestId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
