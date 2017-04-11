(function () {
  'use strict';

  angular
    .module('ceodiscounts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ceodiscounts', {
        abstract: true,
        url: '/ceodiscounts',
        template: '<ui-view/>'
      })
      .state('ceodiscounts.list', {
        url: '',
        templateUrl: 'modules/ceodiscounts/client/views/list-ceodiscounts.client.view.html',
        controller: 'CeodiscountsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Ceodiscounts List'
        }
      })
      .state('ceodiscounts.create', {
        url: '/create',
        templateUrl: 'modules/ceodiscounts/client/views/form-ceodiscount.client.view.html',
        controller: 'CeodiscountsController',
        controllerAs: 'vm',
        resolve: {
          ceodiscountResolve: newCeodiscount
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Ceodiscounts Create'
        }
      })
      .state('ceodiscounts.edit', {
        url: '/:ceodiscountId/edit',
        templateUrl: 'modules/ceodiscounts/client/views/form-ceodiscount.client.view.html',
        controller: 'CeodiscountsController',
        controllerAs: 'vm',
        resolve: {
          ceodiscountResolve: getCeodiscount
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ceodiscount {{ ceodiscountResolve.name }}'
        }
      })
      .state('ceodiscounts.view', {
        url: '/:ceodiscountId',
        templateUrl: 'modules/ceodiscounts/client/views/view-ceodiscount.client.view.html',
        controller: 'CeodiscountsController',
        controllerAs: 'vm',
        resolve: {
          ceodiscountResolve: getCeodiscount
        },
        data:{
          pageTitle: 'Ceodiscount {{ articleResolve.name }}'
        }
      });
  }

  getCeodiscount.$inject = ['$stateParams', 'CeodiscountsService'];

  function getCeodiscount($stateParams, CeodiscountsService) {
    return CeodiscountsService.get({
      ceodiscountId: $stateParams.ceodiscountId
    }).$promise;
  }

  newCeodiscount.$inject = ['CeodiscountsService'];

  function newCeodiscount(CeodiscountsService) {
    return new CeodiscountsService();
  }
})();
