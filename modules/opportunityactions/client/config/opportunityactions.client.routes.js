(function () {
  'use strict';

  angular
    .module('opportunityactions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('opportunityactions', {
        abstract: true,
        url: '/opportunityactions?opportunityId:assigneeId',
        template: '<ui-view/>'
      })
      .state('opportunityactions.list', {
        url: '',
        templateUrl: 'modules/opportunityactions/client/views/list-opportunityactions.client.view.html',
        controller: 'OpportunityactionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Opportunityactions List'
        }
      })
      .state('opportunityactions.create', {
        url: '/create',
        templateUrl: 'modules/opportunityactions/client/views/form-opportunityaction.client.view.html',
        controller: 'OpportunityactionsController',
        controllerAs: 'vm',
        resolve: {
          opportunityactionResolve: newOpportunityaction
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Opportunityactions Create'
        }
      })
      .state('opportunityactions.edit', {
        url: '/:opportunityactionId/edit',
        templateUrl: 'modules/opportunityactions/client/views/form-opportunityaction.client.view.html',
        controller: 'OpportunityactionsController',
        controllerAs: 'vm',
        resolve: {
          opportunityactionResolve: getOpportunityaction
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Opportunityaction {{ opportunityactionResolve.name }}'
        }
      })
      .state('opportunityactions.view', {
        url: '/:opportunityactionId',
        templateUrl: 'modules/opportunityactions/client/views/view-opportunityaction.client.view.html',
        controller: 'OpportunityactionsController',
        controllerAs: 'vm',
        resolve: {
          opportunityactionResolve: getOpportunityaction
        },
        data:{
          pageTitle: 'Opportunityaction {{ articleResolve.name }}'
        }
      });
  }

  getOpportunityaction.$inject = ['$stateParams', 'OpportunityactionsService'];

  function getOpportunityaction($stateParams, OpportunityactionsService) {
    return OpportunityactionsService.get({
      opportunityactionId: $stateParams.opportunityactionId
    }).$promise;
  }

  newOpportunityaction.$inject = ['OpportunityactionsService'];

  function newOpportunityaction(OpportunityactionsService) {
    return new OpportunityactionsService();
  }
})();
