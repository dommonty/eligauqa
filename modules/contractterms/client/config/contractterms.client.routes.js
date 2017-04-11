(function () {
  'use strict';

  angular
    .module('contractterms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contractterms', {
        abstract: true,
        url: '/contractterms',
        template: '<ui-view/>'
      })
      .state('contractterms.list', {
        url: '',
        templateUrl: 'modules/contractterms/client/views/list-contractterms.client.view.html',
        controller: 'ContracttermsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contractterms List'
        }
      })
      .state('contractterms.create', {
        url: '/create',
        templateUrl: 'modules/contractterms/client/views/form-contractterm.client.view.html',
        controller: 'ContracttermsController',
        controllerAs: 'vm',
        resolve: {
          contracttermResolve: newContractterm
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Contractterms Create'
        }
      })
      .state('contractterms.edit', {
        url: '/:contracttermId/edit',
        templateUrl: 'modules/contractterms/client/views/form-contractterm.client.view.html',
        controller: 'ContracttermsController',
        controllerAs: 'vm',
        resolve: {
          contracttermResolve: getContractterm
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Contractterm {{ contracttermResolve.name }}'
        }
      })
      .state('contractterms.view', {
        url: '/:contracttermId',
        templateUrl: 'modules/contractterms/client/views/view-contractterm.client.view.html',
        controller: 'ContracttermsController',
        controllerAs: 'vm',
        resolve: {
          contracttermResolve: getContractterm
        },
        data:{
          pageTitle: 'Contractterm {{ articleResolve.name }}'
        }
      });
  }

  getContractterm.$inject = ['$stateParams', 'ContracttermsService'];

  function getContractterm($stateParams, ContracttermsService) {
    return ContracttermsService.get({
      contracttermId: $stateParams.contracttermId
    }).$promise;
  }

  newContractterm.$inject = ['ContracttermsService'];

  function newContractterm(ContracttermsService) {
    return new ContracttermsService();
  }
})();
