(function () {
  'use strict';

  angular
    .module('costs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('costs', {
        abstract: true,
        url: '/costs',
        template: '<ui-view/>'
      })
      .state('costs.list', {
        url: '',
        templateUrl: 'modules/costs/client/views/list-costs.client.view.html',
        controller: 'CostsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Costs List'
        }
      })
      .state('costs.create', {
        url: '/create',
        templateUrl: 'modules/costs/client/views/form-cost.client.view.html',
        controller: 'CostsController',
        controllerAs: 'vm',
        resolve: {
          costResolve: newCost
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Costs Create'
        }
      })
      .state('costs.edit', {
        url: '/:costId/edit',
        templateUrl: 'modules/costs/client/views/form-cost.client.view.html',
        controller: 'CostsController',
        controllerAs: 'vm',
        resolve: {
          costResolve: getCost
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Cost {{ costResolve.name }}'
        }
      })
      .state('costs.import', {
        url: '/costs-import',
        templateUrl: 'modules/costs/client/views/import-actuals-cost.client.view.html',
        controller: 'ImportCostActualsController',
        controllerAs: 'vm'
      })
      .state('costs.view', {
        url: '/:costId',
        templateUrl: 'modules/costs/client/views/view-cost.client.view.html',
        controller: 'CostsController',
        controllerAs: 'vm',
        resolve: {
          costResolve: getCost
        },
        data:{
          pageTitle: 'Cost {{ articleResolve.name }}'
        }
      });
  }

  getCost.$inject = ['$stateParams', 'CostsService'];

  function getCost($stateParams, CostsService) {
    return CostsService.get({
      costId: $stateParams.costId
    }).$promise;
  }

  newCost.$inject = ['CostsService'];

  function newCost(CostsService) {
    return new CostsService();
  }
})();
