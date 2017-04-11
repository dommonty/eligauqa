(function () {
  'use strict';

  angular
    .module('businessunits')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('businessunits', {
        abstract: true,
        url: '/businessunits',
        template: '<ui-view/>'
      })
      .state('businessunits.list', {
        url: '',
        templateUrl: 'modules/businessunits/client/views/list-businessunits.client.view.html',
        controller: 'BusinessunitsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Businessunits List'
        }
      })
      .state('businessunits.create', {
        url: '/create',
        templateUrl: 'modules/businessunits/client/views/form-businessunit.client.view.html',
        controller: 'BusinessunitsController',
        controllerAs: 'vm',
        resolve: {
          businessunitResolve: newBusinessunit
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Businessunits Create'
        }
      })
      .state('businessunits.edit', {
        url: '/:businessunitId/edit',
        templateUrl: 'modules/businessunits/client/views/form-businessunit.client.view.html',
        controller: 'BusinessunitsController',
        controllerAs: 'vm',
        resolve: {
          businessunitResolve: getBusinessunit
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Businessunit {{ businessunitResolve.name }}'
        }
      })
      .state('businessunits.import', {
        url: '/:businessunitId/import',
        templateUrl: 'modules/businessunits/client/views/import-businessunit.client.view.html',
        controller: 'BusinessunitsImportController',
        controllerAs: 'vm',
        resolve: {
          businessunitResolve: getBusinessunit
        }
      })
      .state('businessunits.view', {
        url: '/:businessunitId',
        templateUrl: 'modules/businessunits/client/views/view-businessunit.client.view.html',
        controller: 'BusinessunitsController',
        controllerAs: 'vm',
        resolve: {
          businessunitResolve: getBusinessunit
        }
      });
  }

  getBusinessunit.$inject = [ '$stateParams', 'BusinessunitsService' ];

  function getBusinessunit($stateParams, BusinessunitsService) {
    return BusinessunitsService.get({
      businessunitId: $stateParams.businessunitId
    }).$promise;
  }

  newBusinessunit.$inject = [ 'BusinessunitsService' ];

  function newBusinessunit(BusinessunitsService) {
    return new BusinessunitsService();
  }
})();
