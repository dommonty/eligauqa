(function () {
  'use strict';

  angular
    .module('packageofferings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('packageofferings', {
        abstract: true,
        url: '/packageofferings',
        template: '<ui-view/>'
      })
      .state('packageofferings.list', {
        url: '',
        templateUrl: 'modules/packageofferings/client/views/list-packageofferings.client.view.html',
        controller: 'PackageofferingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Packageofferings List'
        }
      })
      .state('packageofferings.create', {
        url: '/create',
        templateUrl: 'modules/packageofferings/client/views/form-packageoffering.client.view.html',
        controller: 'PackageofferingsController',
        controllerAs: 'vm',
        resolve: {
          packageofferingResolve: newPackageoffering
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Packageofferings Create'
        }
      })
      .state('packageofferings.edit', {
        url: '/:packageofferingId/edit',
        templateUrl: 'modules/packageofferings/client/views/form-packageoffering.client.view.html',
        controller: 'PackageofferingsController',
        controllerAs: 'vm',
        resolve: {
          packageofferingResolve: getPackageoffering
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Packageoffering {{ packageofferingResolve.name }}'
        }
      })
      .state('packageofferings.view', {
        url: '/:packageofferingId',
        templateUrl: 'modules/packageofferings/client/views/view-packageoffering.client.view.html',
        controller: 'PackageofferingsController',
        controllerAs: 'vm',
        resolve: {
          packageofferingResolve: getPackageoffering
        },
        data:{
          pageTitle: 'Packageoffering {{ articleResolve.name }}'
        }
      });
  }

  getPackageoffering.$inject = ['$stateParams', 'PackageofferingsService'];

  function getPackageoffering($stateParams, PackageofferingsService) {
    return PackageofferingsService.get({
      packageofferingId: $stateParams.packageofferingId
    }).$promise;
  }

  newPackageoffering.$inject = ['PackageofferingsService'];

  function newPackageoffering(PackageofferingsService) {
    return new PackageofferingsService();
  }
})();
