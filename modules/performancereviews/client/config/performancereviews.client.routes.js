(function () {
  'use strict';

  angular
    .module('performancereviews')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('performancereviews', {
        abstract: true,
        url: '/performancereviews?reviewrequestId&assigneeId',
        template: '<ui-view/>'
      })
      .state('performancereviews.list', {
        url: '',
        templateUrl: 'modules/performancereviews/client/views/list-performancereviews.client.view.html',
        controller: 'PerformancereviewsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Performancereviews List'
        }
      })
      .state('performancereviews.create', {
        url: '/create',
        templateUrl: 'modules/performancereviews/client/views/form-performancereview.client.view.html',
        controller: 'EditPerformancereviewsController',
        controllerAs: 'vm',
        resolve: {
          performancereviewResolve: newPerformancereview
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Performancereviews Create'
        }
      })
      .state('performancereviews.edit', {
        url: '/:performancereviewId/edit',
        templateUrl: 'modules/performancereviews/client/views/form-performancereview.client.view.html',
        controller: 'EditPerformancereviewsController',
        controllerAs: 'vm',
        resolve: {
          performancereviewResolve: getPerformancereview
        },
        data: {
          pageTitle: 'Edit Performancereview {{ performancereviewResolve.name }}'
        }
      })
      .state('performancereviews.view', {
        url: '/:performancereviewId',
        templateUrl: 'modules/performancereviews/client/views/view-performancereview.client.view.html',
        controller: 'PerformancereviewsController',
        controllerAs: 'vm',
        resolve: {
          performancereviewResolve: getPerformancereview
        },
        data:{
          pageTitle: 'Performancereview {{ articleResolve.name }}'
        }
      });
  }

  getPerformancereview.$inject = ['$stateParams', 'PerformancereviewsService'];

  function getPerformancereview($stateParams, PerformancereviewsService) {
    return PerformancereviewsService.get({
      performancereviewId: $stateParams.performancereviewId
    }).$promise;
  }

  newPerformancereview.$inject = ['PerformancereviewsService'];

  function newPerformancereview(PerformancereviewsService) {
    return new PerformancereviewsService();
  }
})();
