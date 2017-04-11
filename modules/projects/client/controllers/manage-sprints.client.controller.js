(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ManageSprintsController', ManageSprintsController);

  ManageSprintsController.$inject = [ '$scope', '$rootScope', 'SquadsService', '$uibModal', 'projectResolve', '$filter' ];

  function ManageSprintsController($scope, $rootScope, SquadsService, $uibModal, project, $filter) {
    var vm = this;

    // Manage sprints controller logic

    init();

    function init() {
      vm.valuesTitles = [ 'Squad Name', 'Squad allocation', 'Start Date', 'Sprint Duration', 'Story Points', 'Sprint Cost', 'Cost Per Story Point' ];
      vm.displayedValues = [];
      vm.sprintsMenuCallback = sprintsMenuCallback;
      vm.squads = SquadsService.query();
      vm.openSprintDetailModal = openSprintDetailModal;
      vm.project = project;
      vm.refreshDisplayedValues = refreshDisplayedValues;
      refreshDisplayedValues();
    }

    function sprintsMenuCallback(action, tableEntry) {
      if (action === 'Remove') {
        if (confirm('Are you sure you want to delete the sprint?')) {
          vm.project.sprints.splice(tableEntry._id, 1);
          vm.project.$update(function (res) {
            refreshDisplayedValues();
          }, function (res) {
            vm.error = res.data.message;

          });
        }
      }
    }


    function refreshDisplayedValues() {
      if (!vm.project.sprints)
        vm.project.sprints = [];
      vm.displayedValues.splice(0, vm.displayedValues.length);
      vm.project.sprints = $filter('orderBy')(vm.project.sprints, 'startDate');

      for (var i = 0; i < vm.project.sprints.length; i++) {
        var tableEntry = {};
        var eachSprint = vm.project.sprints[ i ];
        tableEntry[ 0 ] = eachSprint.squadName;
        tableEntry[ 1 ] = eachSprint.allocatedSquadPercentage + '%';
        tableEntry[ 2 ] = $filter('date')(eachSprint.startDate, 'dd MMM yyyy');
        tableEntry[ 3 ] = eachSprint.sprintDuration;
        tableEntry[ 4 ] = Math.round(eachSprint.actualStoryPoints);
        tableEntry[ 5 ] = $filter('currency')(eachSprint.loadedSquadCost, '$', 0);
        tableEntry[ 6 ] = $filter('currency')(Math.round(eachSprint.loadedSquadCost / eachSprint.actualStoryPoints), '$', 0);
        vm.displayedValues.push(tableEntry);
        tableEntry._id = i; //store the index so it can be removed, see sprintsMenuCallback function above
      }
      $rootScope.$broadcast('RefreshSearchTable');
    }

    function openSprintDetailModal() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'manageSprint.html',
        controller: 'sprintFormController',
        controllerAs: 'vm',
        resolve: {
          project: function () {
            return vm.project;
          },
          parentViewModel: function () {
            return vm;
          }
        }
      });

    }
  }

  /*
   * show the confirmation modal popup
   */
  angular.module('projects').controller('sprintFormController', [ '$rootScope', '$scope', '$state',
    '$uibModalInstance', 'project', 'parentViewModel', 'SquadsService', 'CompaniesService',
    function sprintFormController($rootScope, $scope, $state,
                                  $uibModalInstance, project, parentViewModel, SquadsService, CompaniesService) {
      var vm = this;
      vm.sprint = {};
      vm.sprint.startDate = new Date(project.nextSprintStartDate);
      vm.project = project;
      vm.squadChanged = squadChanged;
      vm.calculateSquadCost = calculateSquadCost;
      vm.durationChanged = durationChanged;
      vm.sprint.sprintDuration = vm.project.sprintDuration;
      vm.format = 'dd-MMMM-yyyy';
      vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];

      SquadsService.query().$promise.then(function (squads) {
        vm.squads = [];
        for (var i = 0; i < squads.length; i++) {
          var eachSquad = squads[ i ];
          if (eachSquad.outcomeTeam._id === project.outcomeTeam._id)
            vm.squads.push(eachSquad);
        }
      });

      vm.openCalendar = function () {
        vm.isCalendarOpen = true;
      };

      $scope.confirmSprint = function (isValid) {

        function successCallback(res) {
          parentViewModel.refreshDisplayedValues();
          $uibModalInstance.close();
        }

        function errorCallback(res) {
          vm.error = res.data.message;
        }

        if (isValid) {
          vm.sprint.squadName = vm.squad.name;
          project.sprints.push(vm.sprint);
          vm.project.$update(successCallback, errorCallback);
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.close();
      };

      function squadChanged() {
        SquadsService.get(
          {
            squadId: vm.squad._id
          }).$promise.then(function (_squad) {
          vm.squad = _squad;
          CompaniesService.get(
            {
              companyId: vm.project.outcomeTeam.businessUnit.company._id
            }).$promise.then(function (company) {
            vm.company = company;
            calculateSquadCost();
          });
        });
      }

      function calculateSquadCost() {
        var percentageFactor = vm.sprint.allocatedSquadPercentage / 100;
        vm.sprint.loadedSquadCost = Math.round(vm.squad.loadedSquadCost * percentageFactor / vm.company.businessDaysInYear * vm.sprint.sprintDuration);
      }

      function durationChanged() {
        squadChanged();
      }


    }
  ]);

})();
