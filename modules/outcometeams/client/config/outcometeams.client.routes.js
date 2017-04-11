(function () {
  'use strict';

  angular
    .module('outcometeams')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('outcometeams', {
        abstract: true,
        url: '/outcometeams?probability',
        template: '<ui-view/>'
      })
      .state('outcometeams.list', {
        url: '',
        templateUrl: 'modules/outcometeams/client/views/list-outcometeams.client.view.html',
        controller: 'OutcometeamsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Outcometeams List'
        }
      })
      .state('outcometeams.create', {
        url: '/create',
        templateUrl: 'modules/outcometeams/client/views/form-outcometeam.client.view.html',
        controller: 'OutcometeamsController',
        controllerAs: 'vm',
        resolve: {
          outcometeamResolve: newOutcometeam
        },
        data: {
          roles: [ 'hradmin', 'admin', 'user' ],
          pageTitle: 'Outcometeams Create'
        }
      })
      .state('outcometeams.edit', {
        url: '/:outcometeamId/edit',
        templateUrl: 'modules/outcometeams/client/views/form-outcometeam.client.view.html',
        controller: 'OutcometeamsController',
        controllerAs: 'vm',
        resolve: {
          outcometeamResolve: getOutcometeam
        },
        data: {
          roles: [ 'hradmin', 'admin', 'user' ],
          pageTitle: 'Edit Outcometeam {{ outcometeamResolve.name }}'
        }
      })
      .state('outcometeams.view', {
        url: '/:outcometeamId',
        templateUrl: 'modules/outcometeams/client/views/view-outcometeam.client.view.html',
        controller: 'OutcometeamsController',
        controllerAs: 'vm',
        resolve: {
          outcometeamResolve: getOutcometeam
        },
        data: {
          pageTitle: 'Outcometeam {{ articleResolve.name }}'
        }
      });
  }

  getOutcometeam.$inject = [ '$stateParams', 'OutcometeamsService' ];

  function getOutcometeam($stateParams, OutcometeamsService) {
    return OutcometeamsService.get({
      outcometeamId: $stateParams.outcometeamId,
      probability: $stateParams.probability
    }).$promise;
  }

  newOutcometeam.$inject = [ 'OutcometeamsService' ];

  function newOutcometeam(OutcometeamsService) {
    return new OutcometeamsService();
  }
})();
