(function () {
  'use strict';

  angular
    .module('supportplans')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('supportplans', {
        abstract: true,
        url: '/supportplans',
        template: '<ui-view/>'
      })
      .state('supportplans.list', {
        url: '',
        templateUrl: 'modules/supportplans/client/views/list-supportplans.client.view.html',
        controller: 'SupportplansListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Supportplans List'
        }
      })
      .state('supportplans.create', {
        url: '/create',
        templateUrl: 'modules/supportplans/client/views/form-supportplan.client.view.html',
        controller: 'SupportplansController',
        controllerAs: 'vm',
        resolve: {
          supportplanResolve: newSupportplan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Supportplans Create'
        }
      })
      .state('supportplans.edit', {
        url: '/:supportplanId/edit',
        templateUrl: 'modules/supportplans/client/views/form-supportplan.client.view.html',
        controller: 'SupportplansController',
        controllerAs: 'vm',
        resolve: {
          supportplanResolve: getSupportplan
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Supportplan {{ supportplanResolve.name }}'
        }
      })
      .state('supportplans.view', {
        url: '/:supportplanId',
        templateUrl: 'modules/supportplans/client/views/view-supportplan.client.view.html',
        controller: 'SupportplansController',
        controllerAs: 'vm',
        resolve: {
          supportplanResolve: getSupportplan
        },
        data:{
          pageTitle: 'Supportplan {{ articleResolve.name }}'
        }
      });
  }

  getSupportplan.$inject = ['$stateParams', 'SupportplansService'];

  function getSupportplan($stateParams, SupportplansService) {
    return SupportplansService.get({
      supportplanId: $stateParams.supportplanId
    }).$promise;
  }

  newSupportplan.$inject = ['SupportplansService'];

  function newSupportplan(SupportplansService) {
    return new SupportplansService();
  }
})();
