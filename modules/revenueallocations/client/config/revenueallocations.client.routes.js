(function () {
  'use strict';

  angular
    .module('revenueallocations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('revenueallocations', {
        abstract: true,
        url: '/revenueallocations?productId',
        template: '<ui-view/>'
      })
      .state('revenueallocations.list', {
        url: '',
        templateUrl: 'modules/revenueallocations/client/views/list-revenueallocations.client.view.html',
        controller: 'RevenueallocationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Revenueallocations List'
        }
      })
      .state('revenueallocations.create', {
        url: '/create',
        templateUrl: 'modules/revenueallocations/client/views/form-revenueallocation.client.view.html',
        controller: 'RevenueallocationsController',
        controllerAs: 'vm',
        resolve: {
          revenueallocationResolve: newRevenueallocation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Revenueallocations Create'
        }
      })
      .state('revenueallocations.edit', {
        url: '/:revenueallocationId/edit',
        templateUrl: 'modules/revenueallocations/client/views/form-revenueallocation.client.view.html',
        controller: 'RevenueallocationsController',
        controllerAs: 'vm',
        resolve: {
          revenueallocationResolve: getRevenueallocation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Revenueallocation {{ revenueallocationResolve.name }}'
        }
      })
      .state('revenueallocations.view', {
        url: '/:revenueallocationId',
        templateUrl: 'modules/revenueallocations/client/views/view-revenueallocation.client.view.html',
        controller: 'RevenueallocationsController',
        controllerAs: 'vm',
        resolve: {
          revenueallocationResolve: getRevenueallocation
        },
        data:{
          pageTitle: 'Revenueallocation {{ articleResolve.name }}'
        }
      });
  }

  getRevenueallocation.$inject = ['$stateParams', 'RevenueallocationsService'];

  function getRevenueallocation($stateParams, RevenueallocationsService) {
    return RevenueallocationsService.get({
      revenueallocationId: $stateParams.revenueallocationId
    }).$promise;
  }

  newRevenueallocation.$inject = ['RevenueallocationsService'];

  function newRevenueallocation(RevenueallocationsService) {
    return new RevenueallocationsService();
  }
})();
