(function () {
  'use strict';

  angular
    .module('projects')
    .config(routeConfig);

  routeConfig.$inject = [ '$stateProvider' ];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('projects', {
        abstract: true,
        url: '/projects',
        template: '<ui-view/>'
      })
      .state('projects.list', {
        url: '',
        templateUrl: 'modules/projects/client/views/list-projects.client.view.html',
        controller: 'ProjectsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Projects List'
        }
      })
      .state('projects.statistics', {
        url: '/statistics',
        templateUrl: 'modules/projects/client/views/statistics-projects.client.view.html',
        controller: 'ProjectStatisticsController',
        controllerAs: 'vm'
      })
      .state('projects.create', {
        url: '/create',
        templateUrl: 'modules/projects/client/views/form-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: newProject
        },
        data: {
          roles: [ 'user', 'admin', 'user-restricted' ],
          pageTitle: 'Projects Create'
        }
      })
      .state('projects.edit', {
        url: '/:projectId/edit',
        templateUrl: 'modules/projects/client/views/form-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        },
        data: {
          roles: [ 'user', 'admin', 'user-restricted' ],
          pageTitle: 'Edit Project {{ projectResolve.name }}'
        }
      })
      .state('projects.manage', {
        url: '/:projectId/manage',
        templateUrl: 'modules/projects/client/views/manage-projects.client.view.html',
        controller: 'ManageSprintsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        },
        data: {
          pageTitle: 'Sprints List'
        }
      })
      .state('projects.view', {
        url: '/:projectId',
        templateUrl: 'modules/projects/client/views/view-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        },
        data: {
          pageTitle: 'Project {{ articleResolve.name }}'
        }
      })
      .state('projects.revenues', {
        url: '/revenues/:projectId',
        templateUrl: 'modules/projects/client/views/project-revenue-opportunities.client.view.html',
        controller: 'OpportunityRevenuesController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        }
      });
  }

  getProject.$inject = [ '$stateParams', 'ProjectsService' ];

  function getProject($stateParams, ProjectsService) {
    return ProjectsService.get({
      projectId: $stateParams.projectId
    }).$promise;
  }

  newProject.$inject = [ 'ProjectsService' ];

  function newProject(ProjectsService) {
    return new ProjectsService();
  }
})();
