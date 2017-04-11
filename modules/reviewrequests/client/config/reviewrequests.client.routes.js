(function () {
  'use strict';

  angular
    .module('reviewrequests')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reviewrequests', {
        abstract: true,
        url: '/reviewrequests',
        template: '<ui-view/>'
      })
      .state('reviewrequests.list', {
        url: '',
        templateUrl: 'modules/reviewrequests/client/views/list-reviewrequests.client.view.html',
        controller: 'ReviewrequestsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reviewrequests List'
        }
      })
      .state('reviewrequests.create', {
        url: '/create',
        templateUrl: 'modules/reviewrequests/client/views/form-reviewrequest.client.view.html',
        controller: 'ReviewrequestsController',
        controllerAs: 'vm',
        resolve: {
          reviewrequestResolve: newReviewrequest
        },
        data: {
          roles: ['user', 'admin', 'user-restricted'],
          pageTitle : 'Reviewrequests Create'
        }
      })
      .state('reviewrequests.edit', {
        url: '/:reviewrequestId/edit',
        templateUrl: 'modules/reviewrequests/client/views/form-reviewrequest.client.view.html',
        controller: 'ReviewrequestsController',
        controllerAs: 'vm',
        resolve: {
          reviewrequestResolve: getReviewrequest
        },
        data: {
          pageTitle: 'Edit Reviewrequest {{ reviewrequestResolve.name }}'
        }
      })
      .state('reviewrequests.view', {
        url: '/:reviewrequestId',
        templateUrl: 'modules/reviewrequests/client/views/view-reviewrequest.client.view.html',
        controller: 'ReviewrequestsController',
        controllerAs: 'vm',
        resolve: {
          reviewrequestResolve: getReviewrequest
        },
        data:{
          pageTitle: 'Reviewrequest {{ articleResolve.name }}'
        }
      });
  }

  getReviewrequest.$inject = ['$stateParams', 'ReviewrequestsService'];

  function getReviewrequest($stateParams, ReviewrequestsService) {
    return ReviewrequestsService.get({
      reviewrequestId: $stateParams.reviewrequestId
    }).$promise;
  }

  newReviewrequest.$inject = ['ReviewrequestsService'];

  function newReviewrequest(ReviewrequestsService) {
    return new ReviewrequestsService();
  }
})();
