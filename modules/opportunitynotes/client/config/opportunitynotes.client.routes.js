(function () {
  'use strict';

  angular
    .module('opportunitynotes')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('opportunitynotes', {
        abstract: true,
        url: '/opportunitynotes?opportunityId',
        template: '<ui-view/>'
      })
      .state('opportunitynotes.list', {
        url: '',
        templateUrl: 'modules/opportunitynotes/client/views/list-opportunitynotes.client.view.html',
        controller: 'OpportunitynotesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Opportunitynotes List'
        }
      })
      .state('opportunitynotes.timeline', {
        url: '/:customerId/timeline',
        templateUrl: 'modules/opportunitynotes/client/views/time-line-opportunitynotes.client.view.html',
        controller: 'OpportunityNotesTimeLineController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer
        }
      })
      .state('opportunitynotes.create', {
        url: '/create',
        templateUrl: 'modules/opportunitynotes/client/views/form-opportunitynote.client.view.html',
        controller: 'OpportunitynotesController',
        controllerAs: 'vm',
        resolve: {
          opportunitynoteResolve: newOpportunitynote
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Opportunitynotes Create'
        }
      })
      .state('opportunitynotes.edit', {
        url: '/:opportunitynoteId/edit',
        templateUrl: 'modules/opportunitynotes/client/views/form-opportunitynote.client.view.html',
        controller: 'OpportunitynotesController',
        controllerAs: 'vm',
        resolve: {
          opportunitynoteResolve: getOpportunitynote
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Opportunitynote {{ opportunitynoteResolve.name }}'
        }
      })
      .state('opportunitynotes.view', {
        url: '/:opportunitynoteId',
        templateUrl: 'modules/opportunitynotes/client/views/view-opportunitynote.client.view.html',
        controller: 'OpportunitynotesController',
        controllerAs: 'vm',
        resolve: {
          opportunitynoteResolve: getOpportunitynote
        },
        data: {
          pageTitle: 'Opportunitynote {{ articleResolve.name }}'
        }
      });
  }

  getOpportunitynote.$inject = [ '$stateParams', 'OpportunitynotesService' ];

  function getOpportunitynote($stateParams, OpportunitynotesService) {
    return OpportunitynotesService.get({
      opportunitynoteId: $stateParams.opportunitynoteId
    }).$promise;
  }

  newOpportunitynote.$inject = [ 'OpportunitynotesService' ];

  function newOpportunitynote(OpportunitynotesService) {
    return new OpportunitynotesService();
  }

  getCustomer.$inject = ['$stateParams', 'CustomersService'];

  function getCustomer($stateParams, CustomersService) {
    return CustomersService.get({
      customerId: $stateParams.customerId
    }).$promise;
  }
})();
