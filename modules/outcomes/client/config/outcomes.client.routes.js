(function () {
  'use strict';

  angular
    .module('outcomes')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('outcomes', {
        abstract: true,
        url: '/outcomes',
        template: '<ui-view/>'
      })
      .state('outcomes.list', {
        url: '/:outcometeamId/list',
        templateUrl: 'modules/outcomes/client/views/list-outcomes.client.view.html',
        controller: 'OutcomesListController',
        controllerAs: 'vm',
        resolve: {
          outcomeTeamResolve: getOutcomeTeam
        },
        data: {
          pageTitle: 'Outcomes List'
        }
      })
      .state('outcomes.create', {
        url: '/:outcometeamId/create',
        templateUrl: 'modules/outcomes/client/views/form-outcome.client.view.html',
        controller: 'OutcomesController',
        controllerAs: 'vm',
        resolve: {
          outcomeResolve: newOutcome,
          outcomeTeamResolve: getOutcomeTeam
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Outcomes Create'
        }
      })
      .state('outcomes.edit', {
        url: '/:outcomeId/edit/:outcometeamId',
        templateUrl: 'modules/outcomes/client/views/form-outcome.client.view.html',
        controller: 'OutcomesController',
        controllerAs: 'vm',
        resolve: {
          outcomeResolve: getOutcome,
          outcomeTeamResolve: getOutcomeTeam
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Outcome {{ outcomeResolve.name }}'
        }
      })
      .state('outcomes.view', {
        url: '/:outcomeId/:outcometeamId',
        templateUrl: 'modules/outcomes/client/views/view-outcome.client.view.html',
        controller: 'OutcomesController',
        controllerAs: 'vm',
        resolve: {
          outcomeResolve: getOutcome,
          outcomeTeamResolve: getOutcomeTeam
        },
        data: {
          pageTitle: 'Outcome {{ articleResolve.name }}'
        }
      });
  }

  getOutcome.$inject = [ '$stateParams', 'OutcomesService' ];

  function getOutcome($stateParams, OutcomesService) {
    return OutcomesService.get({
      outcomeId: $stateParams.outcomeId
    }).$promise;
  }

  function getOutcomeTeam($stateParams, OutcometeamsService) {
    return OutcometeamsService.get({
      outcometeamId: $stateParams.outcometeamId
    }).$promise;
  }

  newOutcome.$inject = [ 'OutcomesService' ];

  function newOutcome(OutcomesService) {
    return new OutcomesService();
  }
})();
