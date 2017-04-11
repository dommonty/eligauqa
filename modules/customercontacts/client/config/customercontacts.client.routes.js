(function () {
  'use strict';

  angular
    .module('customercontacts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('customercontacts', {
        abstract: true,
        url: '/customercontacts?customerId',
        template: '<ui-view/>'
      })
      .state('customercontacts.list', {
        url: '',
        templateUrl: 'modules/customercontacts/client/views/list-customercontacts.client.view.html',
        controller: 'CustomercontactsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Customercontacts List'
        }
      })
      .state('customercontacts.create', {
        url: '/create',
        templateUrl: 'modules/customercontacts/client/views/form-customercontact.client.view.html',
        controller: 'CustomercontactsController',
        controllerAs: 'vm',
        resolve: {
          customercontactResolve: newCustomercontact
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Customercontacts Create'
        }
      })
      .state('customercontacts.edit', {
        url: '/:customercontactId/edit',
        templateUrl: 'modules/customercontacts/client/views/form-customercontact.client.view.html',
        controller: 'CustomercontactsController',
        controllerAs: 'vm',
        resolve: {
          customercontactResolve: getCustomercontact
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Customercontact {{ customercontactResolve.name }}'
        }
      })
      .state('customercontacts.view', {
        url: '/:customercontactId',
        templateUrl: 'modules/customercontacts/client/views/view-customercontact.client.view.html',
        controller: 'CustomercontactsController',
        controllerAs: 'vm',
        resolve: {
          customercontactResolve: getCustomercontact
        },
        data:{
          pageTitle: 'Customercontact {{ articleResolve.name }}'
        }
      });
  }

  getCustomercontact.$inject = ['$stateParams', 'CustomercontactsService'];

  function getCustomercontact($stateParams, CustomercontactsService) {
    return CustomercontactsService.get({
      customercontactId: $stateParams.customercontactId
    }).$promise;
  }

  newCustomercontact.$inject = ['CustomercontactsService'];

  function newCustomercontact(CustomercontactsService) {
    return new CustomercontactsService();
  }
})();
