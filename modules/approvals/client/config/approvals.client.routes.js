(function () {
  'use strict';

  angular
    .module('approvals')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('approvals', {
        abstract: true,
        url: '/approvals?quoteId',
        template: '<ui-view/>'
      })
      .state('approvals.list', {
        url: '',
        templateUrl: 'modules/approvals/client/views/list-approvals.client.view.html',
        controller: 'ApprovalsListController',
        controllerAs: 'vm',
        resolve: {
          quoteResolve: getQuote
        },
        data: {
          pageTitle: 'Approvals List'
        }
      })
      .state('approvals.create', {
        url: '/create',
        templateUrl: 'modules/approvals/client/views/form-approval.client.view.html',
        controller: 'ApprovalsController',
        controllerAs: 'vm',
        resolve: {
          approvalResolve: newApproval,
          quoteResolve: getQuote
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Approvals Create'
        }
      })
      .state('approvals.edit', {
        url: '/:approvalId/edit',
        templateUrl: 'modules/approvals/client/views/form-approval.client.view.html',
        controller: 'ApprovalsController',
        controllerAs: 'vm',
        resolve: {
          approvalResolve: getApproval,
          quoteResolve: getQuote
        },
        data: {
          roles: [ 'user', 'admin' ],
          pageTitle: 'Edit Approval {{ approvalResolve.name }}'
        }
      })
      .state('approvals.view', {
        url: '/:approvalId',
        templateUrl: 'modules/approvals/client/views/view-approval.client.view.html',
        controller: 'ApprovalsController',
        controllerAs: 'vm',
        resolve: {
          approvalResolve: getApproval,
          quoteResolve: getQuote
        },
        data: {
          pageTitle: 'Approval {{ articleResolve.name }}'
        }
      });
  }

  getApproval.$inject = [ '$stateParams', 'ApprovalsService' ];

  function getApproval($stateParams, ApprovalsService) {
    return ApprovalsService.get({
      approvalId: $stateParams.approvalId
    }).$promise;
  }

  newApproval.$inject = [ 'ApprovalsService' ];

  function newApproval(ApprovalsService) {
    return new ApprovalsService();
  }

  getQuote.$inject = [ '$stateParams', 'QuotesService' ];

  function getQuote($stateParams, QuotesService) {
    return QuotesService.get({
      quoteId: $stateParams.quoteId
    }).$promise;
  }
})();
