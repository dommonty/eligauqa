(function () {
  'use strict';

  //Setting up route
  angular
    .module('reports')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    // Reports state routing
    $stateProvider
      .state('reports-profit-loss', {
        url: '/reports-profit-loss',
        templateUrl: 'modules/reports/client/views/reports-profit-loss.client.view.html',
        controller: 'ReportsProfitLossController',
        controllerAs: 'vm'
      })
      .state('reports-employee-chart', {
        url: '/employee-chart',
        templateUrl: 'modules/reports/client/views/employee-chart.client.view.html',
        controller: 'EmployeeChartController',
        controllerAs: 'vm'
      })
      .state('reports', {
        url: '/reports',
        template: '<ui-view/>'
      })
      .state('reports.opportunities', {
        url: '/reports-opportunities',
        templateUrl: 'modules/reports/client/views/report-opportunity.client.view.html',
        controller: 'ReportsOpportunityController',
        controllerAs: 'vm'
      })
      .state('reports.costs', {
        url: '/reports-costs',
        templateUrl: 'modules/reports/client/views/report-cost.client.view.html',
        controller: 'ReportsCostController',
        controllerAs: 'vm'
      })
      .state('reports.squadCosts', {
        url: '/reports-squads-cost',
        templateUrl: 'modules/reports/client/views/report-squads-cost.client.view.html',
        controller: 'ReportSquadsCostController',
        controllerAs: 'vm'
      })
      .state('reports.team-structure', {
        url: '/reports-team-structure',
        templateUrl: 'modules/reports/client/views/report-team-structure.client.view.html',
        controller: 'ReportTeamStructureController',
        controllerAs: 'vm'
      })
      .state('reports.customer-risk', {
        url: '/reports-customer-risk',
        templateUrl: 'modules/reports/client/views/report-customer-risk.client.view.html',
        controller: 'ReportCustomerRiskController',
        controllerAs: 'vm'
      })
      .state('reports.customers-annuity', {
        url: '/reports-customers-annuity',
        templateUrl: 'modules/reports/client/views/customers-annuity-chart.client.view.html',
        controller: 'CustomersAnnuityChartController',
        controllerAs: 'vm'
      })
      .state('reports.projects', {
        url: '/reports-projects',
        templateUrl: 'modules/reports/client/views/report-projects.client.view.html',
        controller: 'ProjectsReportController',
        controllerAs: 'vm'
      })
      .state('reports.reviews', {
        url: '/reports-reviews',
        templateUrl: 'modules/reports/client/views/report-reviews.client.view.html',
        controller: 'OutcomeReviewsReportController',
        controllerAs: 'vm'
      })
      .state('reports.business-unit', {
        url: '/reports-business-unit',
        templateUrl: 'modules/reports/client/views/report-business-unit.client.view.html',
        controller: 'ReportBusinessUnitController',
        controllerAs: 'vm'
      });


  }
})();


