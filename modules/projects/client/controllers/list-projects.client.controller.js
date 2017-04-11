(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectsListController', ProjectsListController);

  ProjectsListController.$inject = [ 'ProjectsService', '$filter', '$rootScope', '$localStorage', '$state', 'BusinessunitsService' ];

  function ProjectsListController(ProjectsService, $filter, $rootScope, $localStorage, $state, BusinessunitsService) {
    var vm = this;

    vm.projectListMenuCallback = projectListMenuCallback;
    vm.displayedValues = [];
    vm.projectListTitles = [ 'Name', 'Status', 'Customer', 'Business Unit', 'Team', 'Forecast Profit', 'Planned Start Date', 'Planned End Date', 'Forecast End Date' ];
    vm.openProjectView = openProjectView;
    vm.businessUnits = BusinessunitsService.query();
    vm.projectTypeChanged = projectTypeChanged;

    if ($localStorage.projectBusinessUnit && $localStorage.projectType) {
      vm.businessUnit = $localStorage.projectBusinessUnit;
      vm.projectType = $localStorage.projectType;
      projectTypeChanged();
    }
    vm.businessUnitChanged = function () {
      vm.projectType = "";
    };


    function projectTypeChanged() {
      vm.displayedValues.splice(0, vm.displayedValues.length);
      vm.showSpinner = true;

      ProjectsService.query({
        projectType: vm.projectType,
        businessUnitId: vm.businessUnit ? vm.businessUnit._id : null
      }).$promise.then(function (data) {
        for (var i = 0; i < data.length; i++) {
          var tableEntry = {};
          var eachProject = data[ i ];

          tableEntry[ 0 ] = eachProject.name;
          tableEntry[ 1 ] = eachProject.statusDescription;
          tableEntry[ 2 ] = eachProject.customer ? eachProject.customer.name : 'deleted';
          tableEntry[ 3 ] = eachProject.businessUnit ? eachProject.businessUnit.name : 'deleted';
          tableEntry[ 4 ] = eachProject.outcomeTeam ? eachProject.outcomeTeam.name : 'deleted';
          tableEntry[ 5 ] = $filter('currency')(eachProject.projectForecastProfitability, '$', 0);
          tableEntry[ 6 ] = $filter('date')(eachProject.startDate, 'mediumDate');
          tableEntry[ 7 ] = $filter('date')(eachProject.endDate, 'mediumDate');
          tableEntry[ 8 ] = $filter('date')(eachProject.projectForecastEndDate, 'mediumDate');
          tableEntry._id = eachProject._id;
          if (eachProject.projectForecastProfitability < 0)
            tableEntry.showError = true;
          vm.displayedValues.push(tableEntry);
        }
        $rootScope.$broadcast('RefreshSearchTable');
        vm.showSpinner = false;
      });
    }

    function projectListMenuCallback(action, tableEntry) {
      if (action === 'View') {
        $state.go('projects.view', {
          projectId: tableEntry._id
        });
      }
      if (action === 'Edit') {
        $state.go('projects.edit', {
          projectId: tableEntry._id
        });
      }

      $localStorage.projectBusinessUnit = vm.businessUnit;
      $localStorage.projectType = vm.projectType;

    }

    function openProjectView(tableEntry) {
      $state.go('projects.view', {
        projectId: tableEntry._id
      });
    }
  }
})();
