(function () {
  'use strict';

  angular
    .module('quotes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('quotes', {
        abstract: true,
        url: '/quotes',
        template: '<ui-view/>'
      })
      .state('quotes.list', {
        url: '',
        templateUrl: 'modules/quotes/client/views/list-quotes.client.view.html',
        controller: 'QuotesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Quotes List'
        }
      })
      .state('quotes.create', {
        url: '/create',
        templateUrl: 'modules/quotes/client/views/form-quote.client.view.html',
        controller: 'QuotesController',
        controllerAs: 'vm',
        resolve: {
          quoteResolve: newQuote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Quotes Create'
        }
      })
      .state('quotes.edit', {
        url: '/:quoteId/edit',
        templateUrl: 'modules/quotes/client/views/form-quote.client.view.html',
        controller: 'QuotesController',
        controllerAs: 'vm',
        resolve: {
          quoteResolve: getQuote
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Quote {{ quoteResolve.name }}'
        }
      })
      .state('quotes.view', {
        url: '/:quoteId',
        templateUrl: 'modules/quotes/client/views/view-quote.client.view.html',
        controller: 'QuotesViewController',
        controllerAs: 'vm',
        resolve: {
          quoteResolve: getQuote
        },
        data:{
          pageTitle: 'Quote {{ articleResolve.name }}'
        }
      });
  }

  getQuote.$inject = ['$stateParams', 'QuotesService'];

  function getQuote($stateParams, QuotesService) {
    return QuotesService.get({
      quoteId: $stateParams.quoteId
    }).$promise;
  }

  newQuote.$inject = ['QuotesService'];

  function newQuote(QuotesService) {
    return new QuotesService();
  }
})();
