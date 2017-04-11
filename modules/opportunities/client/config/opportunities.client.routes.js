(function () {
  'use strict';

  angular
    .module('opportunities')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('opportunities', {
        abstract: true,
        url: '/opportunities',
        template: '<ui-view/>'
      })
      .state('opportunities.list', {
        url: '',
        templateUrl: 'modules/opportunities/client/views/list-opportunities.client.view.html',
        controller: 'OpportunitiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Opportunities List'
        }
      })
      .state('opportunities.create', {
        url: '/create',
        templateUrl: 'modules/opportunities/client/views/form-opportunity.client.view.html',
        controller: 'OpportunitiesController',
        controllerAs: 'vm',
        resolve: {
          opportunityResolve: newOpportunity
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Opportunities Create'
        }
      })
      .state('opportunities.edit', {
        url: '/:opportunityId/edit',
        templateUrl: 'modules/opportunities/client/views/form-opportunity.client.view.html',
        controller: 'OpportunitiesController',
        controllerAs: 'vm',
        resolve: {
          opportunityResolve: getOpportunity
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Opportunity {{ opportunityResolve.name }}'
        }
      })
      .state('opportunities.actuals', {
        url: '/:opportunityId/actuals',
        templateUrl: 'modules/opportunities/client/views/actuals-opportunity.client.view.html',
        controller: 'OpportunitiesActualsController',
        controllerAs: 'vm',
        resolve: {
          opportunityResolve: getOpportunity
        }
      })
      .state('opportunities.view', {
        url: '/:opportunityId',
        templateUrl: 'modules/opportunities/client/views/view-opportunity.client.view.html',
        controller: 'OpportunitiesController',
        controllerAs: 'vm',
        resolve: {
          opportunityResolve: getOpportunity
        },
        data: {
          pageTitle: 'Opportunity {{ articleResolve.name }}'
        }
      })
      .state('opportunities-import', {
        url: '/opportunities-import',
        templateUrl: 'modules/opportunities/client/views/import-actuals-opportunity.client.view.html',
        controller: 'ImportOpportunityActualsController',
        controllerAs: 'vm'
      });
  }

  getOpportunity.$inject = [ '$stateParams', 'OpportunitiesService' ];

  function getOpportunity($stateParams, OpportunitiesService) {
    return OpportunitiesService.get({
      opportunityId: $stateParams.opportunityId
    }).$promise;
  }

  newOpportunity.$inject = [ 'OpportunitiesService' ];

  function newOpportunity(OpportunitiesService) {
    return new OpportunitiesService();
  }
})();
