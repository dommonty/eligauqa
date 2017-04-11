(function () {
  'use strict';

  angular
    .module('businessoutcomes')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('businessoutcomes', {
        abstract: true,
        url: '/businessoutcomes',
        template: '<ui-view/>'
      })
      .state('businessoutcomes.list', {
        url: '/:businessunitId/list',
        templateUrl: 'modules/businessoutcomes/client/views/list-businessoutcomes.client.view.html',
        controller: 'BusinessoutcomesListController',
        controllerAs: 'vm',
        resolve: {
          businessUnitResolve: getBusinessunit
        },
        data: {
          pageTitle: 'Businessoutcomes List'
        }
      })
      .state('businessoutcomes.create', {
        url: '/:businessunitId/create',
        templateUrl: 'modules/businessoutcomes/client/views/form-businessoutcome.client.view.html',
        controller: 'BusinessoutcomesController',
        controllerAs: 'vm',
        resolve: {
          businessoutcomeResolve: newBusinessoutcome,
          businessUnitResolve: getBusinessunit
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Businessoutcomes Create'
        }
      })
      .state('businessoutcomes.edit', {
        url: '/:businessoutcomeId/edit/:businessunitId',
        templateUrl: 'modules/businessoutcomes/client/views/form-businessoutcome.client.view.html',
        controller: 'BusinessoutcomesController',
        controllerAs: 'vm',
        resolve: {
          businessoutcomeResolve: getBusinessoutcome,
          businessUnitResolve: getBusinessunit
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Businessoutcome {{ businessoutcomeResolve.name }}'
        }
      })
      .state('businessoutcomes.view', {
        url: '/:businessoutcomeId/:businessunitId',
        templateUrl: 'modules/businessoutcomes/client/views/view-businessoutcome.client.view.html',
        controller: 'BusinessoutcomesController',
        controllerAs: 'vm',
        resolve: {
          businessoutcomeResolve: getBusinessoutcome,
          businessUnitResolve: getBusinessunit
        },
        data: {
          pageTitle: 'Businessoutcome {{ articleResolve.name }}'
        }
      });
  }

  getBusinessoutcome.$inject = [ '$stateParams', 'BusinessoutcomesService' ];

  function getBusinessoutcome($stateParams, BusinessoutcomesService) {
    return BusinessoutcomesService.get({
      businessoutcomeId: $stateParams.businessoutcomeId
    }).$promise;
  }

  newBusinessoutcome.$inject = [ 'BusinessoutcomesService' ];

  function newBusinessoutcome(BusinessoutcomesService) {
    return new BusinessoutcomesService();
  }

  getBusinessunit.$inject = [ '$stateParams', 'BusinessunitsService' ];

  function getBusinessunit($stateParams, BusinessunitsService) {
    return BusinessunitsService.get({
      businessunitId: $stateParams.businessunitId
    }).$promise;
  }
})();
