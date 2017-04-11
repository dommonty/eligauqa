(function () {
  'use strict';

  angular
    .module('squadallocations')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('squadallocations', {
        abstract: true,
        url: '/squadallocations?employeeId',
        template: '<ui-view/>'
      })
      .state('squadallocations.list', {
        url: '',
        templateUrl: 'modules/squadallocations/client/views/list-squadallocations.client.view.html',
        controller: 'SquadallocationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Squadallocations List'
        }
      })
      .state('squadallocations.create', {
        url: '/create',
        templateUrl: 'modules/squadallocations/client/views/form-squadallocation.client.view.html',
        controller: 'SquadallocationsController',
        controllerAs: 'vm',
        resolve: {
          squadallocationResolve: newSquadallocation
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Squadallocations Create'
        }
      })
      .state('squadallocations.edit', {
        url: '/:squadallocationId/edit',
        templateUrl: 'modules/squadallocations/client/views/form-squadallocation.client.view.html',
        controller: 'SquadallocationsController',
        controllerAs: 'vm',
        resolve: {
          squadallocationResolve: getSquadallocation
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Squadallocation {{ squadallocationResolve.name }}'
        }
      })
      .state('squadallocations.view', {
        url: '/:squadallocationId',
        templateUrl: 'modules/squadallocations/client/views/view-squadallocation.client.view.html',
        controller: 'SquadallocationsController',
        controllerAs: 'vm',
        resolve: {
          squadallocationResolve: getSquadallocation
        },
        data: {
          pageTitle: 'Squadallocation {{ articleResolve.name }}'
        }
      });
  }

  getSquadallocation.$inject = [ '$stateParams', 'SquadallocationsService' ];

  function getSquadallocation($stateParams, SquadallocationsService) {
    return SquadallocationsService.get({
      squadallocationId: $stateParams.squadallocationId
    }).$promise;
  }

  newSquadallocation.$inject = [ 'SquadallocationsService' ];

  function newSquadallocation(SquadallocationsService) {
    return new SquadallocationsService();
  }


})();
