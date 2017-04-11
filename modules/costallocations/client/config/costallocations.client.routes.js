(function () {
  'use strict';

  angular
    .module('costallocations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('costallocations', {
        abstract: true,
        url: '/costallocations?costId',
        template: '<ui-view/>'
      })
      .state('costallocations.list', {
        url: '',
        templateUrl: 'modules/costallocations/client/views/list-costallocations.client.view.html',
        controller: 'CostallocationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Costallocations List'
        }
      })
      .state('costallocations.create', {
        url: '/create',
        templateUrl: 'modules/costallocations/client/views/form-costallocation.client.view.html',
        controller: 'CostallocationsController',
        controllerAs: 'vm',
        resolve: {
          costallocationResolve: newCostallocation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Costallocations Create'
        }
      })
      .state('costallocations.edit', {
        url: '/:costallocationId/edit',
        templateUrl: 'modules/costallocations/client/views/form-costallocation.client.view.html',
        controller: 'CostallocationsController',
        controllerAs: 'vm',
        resolve: {
          costallocationResolve: getCostallocation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Costallocation {{ costallocationResolve.name }}'
        }
      })
      .state('costallocations.view', {
        url: '/:costallocationId',
        templateUrl: 'modules/costallocations/client/views/view-costallocation.client.view.html',
        controller: 'CostallocationsController',
        controllerAs: 'vm',
        resolve: {
          costallocationResolve: getCostallocation
        },
        data:{
          pageTitle: 'Costallocation {{ articleResolve.name }}'
        }
      })
      .state('costallocations.actuals', {
        url: '/:costallocationId/actuals',
        templateUrl: 'modules/costallocations/client/views/actuals-costallocation.client.view.html',
        controller: 'ActualCostController',
        controllerAs: 'vm',
        resolve: {
          costallocationResolve: getCostallocation
        },
        data:{
          pageTitle: 'Costallocation {{ articleResolve.name }}'
        }
      });
  }

  getCostallocation.$inject = ['$stateParams', 'CostallocationsService'];

  function getCostallocation($stateParams, CostallocationsService) {
    return CostallocationsService.get({
      costallocationId: $stateParams.costallocationId
    }).$promise;
  }

  newCostallocation.$inject = ['CostallocationsService'];

  function newCostallocation(CostallocationsService) {
    return new CostallocationsService();
  }
})();
