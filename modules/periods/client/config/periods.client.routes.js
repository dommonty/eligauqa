(function () {
  'use strict';

  angular
    .module('periods')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('periods', {
        abstract: true,
        url: '/periods',
        template: '<ui-view/>'
      })
      .state('periods.list', {
        url: '',
        templateUrl: 'modules/periods/client/views/list-periods.client.view.html',
        controller: 'PeriodsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Periods List'
        }
      })
      .state('periods.create', {
        url: '/create',
        templateUrl: 'modules/periods/client/views/form-period.client.view.html',
        controller: 'PeriodsController',
        controllerAs: 'vm',
        resolve: {
          periodResolve: newPeriod
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Periods Create'
        }
      })
      .state('periods.edit', {
        url: '/:periodId/edit',
        templateUrl: 'modules/periods/client/views/form-period.client.view.html',
        controller: 'PeriodsController',
        controllerAs: 'vm',
        resolve: {
          periodResolve: getPeriod
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Period {{ periodResolve.name }}'
        }
      })
      .state('periods.view', {
        url: '/:periodId',
        templateUrl: 'modules/periods/client/views/view-period.client.view.html',
        controller: 'PeriodsController',
        controllerAs: 'vm',
        resolve: {
          periodResolve: getPeriod
        },
        data:{
          pageTitle: 'Period {{ articleResolve.name }}'
        }
      });
  }

  getPeriod.$inject = ['$stateParams', 'PeriodsService'];

  function getPeriod($stateParams, PeriodsService) {
    return PeriodsService.get({
      periodId: $stateParams.periodId
    }).$promise;
  }

  newPeriod.$inject = ['PeriodsService'];

  function newPeriod(PeriodsService) {
    return new PeriodsService();
  }
})();
