(function () {
  'use strict';

  angular
    .module('riskactions')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('riskactions', {
        abstract: true,
        url: '/riskactions?customerId:businessUnitId',
        template: '<ui-view/>'
      })
      .state('riskactions.list', {
        url: '',
        templateUrl: 'modules/riskactions/client/views/list-riskactions.client.view.html',
        controller: 'RiskactionsListController',
        controllerAs: 'vm',
        resolve: {
          customerResolve: getCustomer
        },
        data: {
          pageTitle: 'Riskactions List'
        }
      })
      .state('riskactions.create', {
        url: '/create',
        templateUrl: 'modules/riskactions/client/views/form-riskaction.client.view.html',
        controller: 'RiskactionsController',
        controllerAs: 'vm',
        resolve: {
          riskactionResolve: newRiskaction,
          customerResolve: getCustomer
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Riskactions Create'
        }
      })
      .state('riskactions.edit', {
        url: '/:riskactionId/edit',
        templateUrl: 'modules/riskactions/client/views/form-riskaction.client.view.html',
        controller: 'RiskactionsController',
        controllerAs: 'vm',
        resolve: {
          riskactionResolve: getRiskaction,
          customerResolve: getCustomer
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Riskaction {{ riskactionResolve.name }}'
        }
      })
      .state('riskactions.view', {
        url: '/:riskactionId',
        templateUrl: 'modules/riskactions/client/views/view-riskaction.client.view.html',
        controller: 'RiskactionsController',
        controllerAs: 'vm',
        resolve: {
          riskactionResolve: getRiskaction,
          customerResolve: getCustomer
        },
        data: {
          pageTitle: 'Riskaction {{ articleResolve.name }}'
        }
      });
  }

  getRiskaction.$inject = [ '$stateParams', 'RiskactionsService' ];

  function getRiskaction($stateParams, RiskactionsService) {
    return RiskactionsService.get({
      riskactionId: $stateParams.riskactionId
    }).$promise;
  }

  newRiskaction.$inject = [ 'RiskactionsService' ];

  function newRiskaction(RiskactionsService) {
    return new RiskactionsService();
  }

  getCustomer.$inject = [ '$stateParams', 'CustomersService' ];

  function getCustomer($stateParams, CustomersService) {
    return CustomersService.get({
      customerId: $stateParams.customerId,
      populateForReporting: true,
      businessUnitId: $stateParams.businessUnitId
    }).$promise;
  }

})();
