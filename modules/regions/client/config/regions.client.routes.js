(function () {
  'use strict';

  angular
    .module('regions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('regions', {
        abstract: true,
        url: '/regions',
        template: '<ui-view/>'
      })
      .state('regions.list', {
        url: '',
        templateUrl: 'modules/regions/client/views/list-regions.client.view.html',
        controller: 'RegionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Regions List'
        }
      })
      .state('regions.create', {
        url: '/create',
        templateUrl: 'modules/regions/client/views/form-region.client.view.html',
        controller: 'RegionsController',
        controllerAs: 'vm',
        resolve: {
          regionResolve: newRegion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Regions Create'
        }
      })
      .state('regions.edit', {
        url: '/:regionId/edit',
        templateUrl: 'modules/regions/client/views/form-region.client.view.html',
        controller: 'RegionsController',
        controllerAs: 'vm',
        resolve: {
          regionResolve: getRegion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Region {{ regionResolve.name }}'
        }
      })
      .state('regions.view', {
        url: '/:regionId',
        templateUrl: 'modules/regions/client/views/view-region.client.view.html',
        controller: 'RegionsController',
        controllerAs: 'vm',
        resolve: {
          regionResolve: getRegion
        },
        data:{
          pageTitle: 'Region {{ articleResolve.name }}'
        }
      });
  }

  getRegion.$inject = ['$stateParams', 'RegionsService'];

  function getRegion($stateParams, RegionsService) {
    return RegionsService.get({
      regionId: $stateParams.regionId
    }).$promise;
  }

  newRegion.$inject = ['RegionsService'];

  function newRegion(RegionsService) {
    return new RegionsService();
  }
})();
