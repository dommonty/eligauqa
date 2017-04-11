(function () {
  'use strict';

  angular
    .module('locations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('locations', {
        abstract: true,
        url: '/locations',
        template: '<ui-view/>'
      })
      .state('locations.list', {
        url: '',
        templateUrl: 'modules/locations/client/views/list-locations.client.view.html',
        controller: 'LocationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Locations List'
        }
      })
      .state('locations.create', {
        url: '/create',
        templateUrl: 'modules/locations/client/views/form-location.client.view.html',
        controller: 'LocationsController',
        controllerAs: 'vm',
        resolve: {
          locationResolve: newLocation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Locations Create'
        }
      })
      .state('locations.edit', {
        url: '/:locationId/edit',
        templateUrl: 'modules/locations/client/views/form-location.client.view.html',
        controller: 'LocationsController',
        controllerAs: 'vm',
        resolve: {
          locationResolve: getLocation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Location {{ locationResolve.name }}'
        }
      })
      .state('locations.view', {
        url: '/:locationId',
        templateUrl: 'modules/locations/client/views/view-location.client.view.html',
        controller: 'LocationsController',
        controllerAs: 'vm',
        resolve: {
          locationResolve: getLocation
        },
        data:{
          pageTitle: 'Location {{ articleResolve.name }}'
        }
      });
  }

  getLocation.$inject = ['$stateParams', 'LocationsService'];

  function getLocation($stateParams, LocationsService) {
    return LocationsService.get({
      locationId: $stateParams.locationId
    }).$promise;
  }

  newLocation.$inject = ['LocationsService'];

  function newLocation(LocationsService) {
    return new LocationsService();
  }
})();
