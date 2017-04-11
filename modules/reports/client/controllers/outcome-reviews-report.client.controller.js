(function () {
  'use strict';

  angular
    .module('reports')
    .controller('OutcomeReviewsReportController', OutcomeReviewsReportController);

  OutcomeReviewsReportController.$inject = [ '$rootScope', '$scope', '$state', 'BusinessunitsService', 'OutcometeamsService', 'SquadsService',
    'PeriodsService', 'SquadallocationsService', 'ReviewrequestsService', '$filter' ];

  function OutcomeReviewsReportController($rootScope, $scope, $state, BusinessunitsService, OutcometeamsService, SquadsService,
                                          PeriodsService, SquadallocationsService, ReviewrequestsService, $filter) {
    var vm = this;


    init();

    function init() {
      vm.businessUnitChanged = businessUnitChanged;
      vm.outcomeTeamChanged = outcomeTeamChanged;
      vm.generateReport = generateReport;
      vm.showReviewRequest = showReviewRequest;
      vm.reportEntries = [];

      vm.businessUnits = BusinessunitsService.query();
      vm.periods = PeriodsService.query();

      vm.reportTitle = [ 'Reviewee', 'Reviewer', 'Review Status', 'Due by' ];
    }

    function businessUnitChanged() {
      vm.outcomeTeams = OutcometeamsService.query(
        {
          businessUnitId: vm.businessUnit._id
        });
    }

    function outcomeTeamChanged() {
      vm.squads = SquadsService.query(
        {
          outcomeTeamId: vm.outcomeTeam._id
        });

    }

    function generateReport() {
      vm.reportEntries = [];
      SquadallocationsService.query({
        squadId: vm.squad._id
      }).$promise.then(function (allocations) {
        vm.allocations = allocations;
        angular.forEach(allocations, function (eachAllocation) {
          vm.reportEntries.push({
            _id: eachAllocation._id,
            0: eachAllocation.employee.name,
            1: 'No review allocated!',
            2: 'Please follow up',
            3: '',
            storedObject: true //flat to indicate that review not yet allocated
          });
          ReviewrequestsService.query({
            revieweeId: eachAllocation.employee._id,
            businessPeriodId: vm.period._id
          }).$promise.then(function (reviews) {
            angular.forEach(reviews, function (eachReview) {
              for (var i = 0; i < vm.reportEntries.length; i++) {
                if (vm.reportEntries[ i ].storedObject && vm.reportEntries[ i ][ 0 ] === eachReview.reviewee.name) {
                  vm.reportEntries.splice(i, 1);
                }
              }
              vm.reportEntries.push({
                _id: eachReview._id,
                0: eachReview.reviewee.name,
                1: eachReview.reviewer.name,
                2: eachReview.statusDescription,
                3: $filter('date')(eachReview.dueBy, 'mediumDate')
              });
              $rootScope.$broadcast('RefreshSearchTable');
            });
          });
        });
      });
    }

    function showReviewRequest(tableEntry) {
      $state.go('reviewrequests.view', {
        reviewrequestId: tableEntry._id
      });
    }
  }


})();
