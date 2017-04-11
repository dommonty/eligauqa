(function () {
  'use strict';

  angular
    .module('squadoutcomes')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('squadoutcomes', {
        abstract: true,
        url: '/squadoutcomes',
        template: '<ui-view/>'
      })
      .state('squadoutcomes.list', {
        url: '/:squadId/list',
        templateUrl: 'modules/squadoutcomes/client/views/list-squadoutcomes.client.view.html',
        controller: 'SquadoutcomesListController',
        controllerAs: 'vm',
        resolve: {
          squadResolve: getSquad
        },
        data: {
          pageTitle: 'Squadoutcomes List'
        }
      })
      .state('squadoutcomes.create', {
        url: '/:squadId/create',
        templateUrl: 'modules/squadoutcomes/client/views/form-squadoutcome.client.view.html',
        controller: 'SquadoutcomesController',
        controllerAs: 'vm',
        resolve: {
          squadoutcomeResolve: newSquadoutcome,
          squadResolve: getSquad
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Squadoutcomes Create'
        }
      })
      .state('squadoutcomes.edit', {
        url: '/:squadoutcomeId/edit/:squadId',
        templateUrl: 'modules/squadoutcomes/client/views/form-squadoutcome.client.view.html',
        controller: 'SquadoutcomesController',
        controllerAs: 'vm',
        resolve: {
          squadoutcomeResolve: getSquadoutcome,
          squadResolve: getSquad
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Squadoutcome {{ squadoutcomeResolve.name }}'
        }
      })
      .state('squadoutcomes.view', {
        url: '/:squadoutcomeId/:squadId',
        templateUrl: 'modules/squadoutcomes/client/views/view-squadoutcome.client.view.html',
        controller: 'SquadoutcomesController',
        controllerAs: 'vm',
        resolve: {
          squadoutcomeResolve: getSquadoutcome,
          squadResolve: getSquad
        },
        data: {
          pageTitle: 'Squadoutcome {{ articleResolve.name }}'
        }
      });
  }

  getSquadoutcome.$inject = [ '$stateParams', 'SquadoutcomesService' ];

  function getSquadoutcome($stateParams, SquadoutcomesService) {
    return SquadoutcomesService.get({
      squadoutcomeId: $stateParams.squadoutcomeId
    }).$promise;
  }

  newSquadoutcome.$inject = [ 'SquadoutcomesService' ];

  function newSquadoutcome(SquadoutcomesService) {
    return new SquadoutcomesService();
  }

  getSquad.$inject = [ '$stateParams', 'SquadsService' ];

  function getSquad($stateParams, SquadsService) {
    return SquadsService.get({
      squadId: $stateParams.squadId
    }).$promise;
  }

})();
