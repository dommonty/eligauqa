(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ProjectsReportController', ProjectsReportController);

  ProjectsReportController.$inject = [ 'ProjectsService', '$filter', '$rootScope', '$state', 'BusinessunitsService' ];

  function ProjectsReportController(ProjectsService, $filter, $rootScope, $state, BusinessunitsService) {
    var vm = this;

    vm.projectListMenuCallback = projectListMenuCallback;
    vm.displayedValues = [];
    vm.projectListTitles = [ 'Project Name', 'Project Leader', 'Customer', 'Budget', 'Total Anticipated Revenue', 'Project Outcomes', 'Anticipated Completion Date', 'Key Milestones', 'Project Status and Notes', 'Date Status Updated' ];
    vm.businessUnits = BusinessunitsService.query();
    vm.businessUnitChanged = function () {
      vm.projectType = "";
    };
    vm.projectTypeChanged = function () {
      generateExcelEntries();
      vm.displayedValues.splice(0, vm.displayedValues.length);
      vm.showSpinner = true;
      vm.projectsToExport = [];

      ProjectsService.query(
        {
          projectType: vm.projectType,
          businessUnitId: vm.businessUnit ? vm.businessUnit._id : null
        }).$promise.then(function (data) {
        for (var i = 0; i < data.length; i++) {
          var tableEntry = {};
          var eachProject = data[ i ];
          var excelEntry = {};
          tableEntry[ 0 ] = eachProject.name;
          excelEntry.projectName = eachProject.name;
          var pm = eachProject.projectManager ? eachProject.projectManager.name : 'Not provided';
          tableEntry[ 1 ] = pm;
          excelEntry.projectLeader = pm;
          var cust = eachProject.customer ? eachProject.customer.name : 'deleted';
          tableEntry[ 2 ] = cust;
          excelEntry.customer = cust;
          var budget = $filter('currency')(eachProject.budget, '$', 0);
          tableEntry[ 3 ] = budget;
          excelEntry.budget = budget;
          var totalAnticipatedRevenue = $filter('currency')(eachProject.totalAnticipatedRevenue, '$', 0);
          tableEntry[ 4 ] = totalAnticipatedRevenue;
          excelEntry.totalAnticipatedRevenue = totalAnticipatedRevenue;
          tableEntry[ 5 ] = eachProject.researchAndDevelopmentProjectOutcomes;
          excelEntry.researchAndDevelopmentProjectOutcomes = eachProject.researchAndDevelopmentProjectOutcomes;
          var anticipatedCompletionDate = $filter('date')(eachProject.endDate, 'mediumDate');
          tableEntry[ 6 ] = anticipatedCompletionDate;
          excelEntry.anticipatedCompletionDate = anticipatedCompletionDate;
          tableEntry[ 7 ] = eachProject.keyMilestonesDescription;
          excelEntry.keyMilestones = eachProject.keyMilestonesDescription;
          var projectStatusAndNotes = eachProject.latestRiskStatus + '(' + eachProject.latestStatusUpdatedNotes + ')';
          tableEntry[ 8 ] = projectStatusAndNotes;
          excelEntry.projectStatusAndNotes = projectStatusAndNotes;
          var dateStatusUpdated = $filter('date')(eachProject.latestStatusUpdatedDate, 'mediumDate');
          tableEntry[ 9 ] = dateStatusUpdated;
          excelEntry.dateStatusUpdated = dateStatusUpdated;

          vm.displayedValues.push(tableEntry);
          vm.projectsToExport.push(excelEntry);
        }
        $rootScope.$broadcast('RefreshSearchTable');
        vm.showSpinner = false;
      });
    };

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
    }

    function generateExcelEntries() {
      vm.reportHeader = {
        projectName: 'Project Name',
        projectLeader: 'Project Leader',
        customer: 'Customer',
        budget: 'Budget',
        totalAnticipatedRevenue: 'Total Anticipated Revenue',
        researchAndDevelopmentProjectOutcomes: ' Project Outcomes',
        anticipatedCompletionDate: 'Anticipated Completion Date',
        keyMilestones: 'Key Milestones',
        projectStatusAndNotes: 'Project Status and Notes',
        dateStatusUpdated: 'Date Status Updated'
      };
    }
  }
})();
