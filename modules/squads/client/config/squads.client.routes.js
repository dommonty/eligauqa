(function () {
  'use strict';

  angular
    .module('squads')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('squads', {
        abstract: true,
        url: '/squads',
        template: '<ui-view/>'
      })
      .state('squads.list', {
        url: '',
        templateUrl: 'modules/squads/client/views/list-squads.client.view.html',
        controller: 'SquadsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Squads List'
        }
      })
      .state('squads.create', {
        url: '/create',
        templateUrl: 'modules/squads/client/views/form-squad.client.view.html',
        controller: 'SquadsController',
        controllerAs: 'vm',
        resolve: {
          squadResolve: newSquad
        },
        data: {
          roles: ['hradmin', 'admin', 'user'],
          pageTitle : 'Squads Create'
        }
      })
      .state('squads.edit', {
        url: '/:squadId/edit',
        templateUrl: 'modules/squads/client/views/form-squad.client.view.html',
        controller: 'SquadsController',
        controllerAs: 'vm',
        resolve: {
          squadResolve: getSquad
        },
        data: {
          roles: ['hradmin', 'admin', 'user'],
          pageTitle: 'Edit Squad {{ squadResolve.name }}'
        }
      })
      .state('squads.view', {
        url: '/:squadId',
        templateUrl: 'modules/squads/client/views/view-squad.client.view.html',
        controller: 'SquadsController',
        controllerAs: 'vm',
        resolve: {
          squadResolve: getSquad
        },
        data:{
          pageTitle: 'Squad {{ articleResolve.name }}'
        }
      });
  }

  getSquad.$inject = ['$stateParams', 'SquadsService'];

  function getSquad($stateParams, SquadsService) {
    return SquadsService.get({
      squadId: $stateParams.squadId
    }).$promise;
  }

  newSquad.$inject = ['SquadsService'];

  function newSquad(SquadsService) {
    return new SquadsService();
  }
})();
