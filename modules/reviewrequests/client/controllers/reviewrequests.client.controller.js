(function () {
  'use strict';

  // Reviewrequests controller
  angular
    .module('reviewrequests')
    .controller('ReviewrequestsController', ReviewrequestsController);

  ReviewrequestsController.$inject = [ '$scope', '$state', 'Authentication', 'reviewrequestResolve', 'EmployeesService',
    'SquadsService', 'SquadallocationsService', 'PerformancereviewsService', 'SquadoutcomesService', 'PeriodsService' ];

  function ReviewrequestsController($scope, $state, Authentication, reviewrequest, EmployeesService,
                                    SquadsService, SquadallocationsService, PerformancereviewsService, SquadoutcomesService, PeriodsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.reviewrequest = reviewrequest;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.revieweeSelected = revieweeSelected;
    vm.assignToReviewerAndReviewee = assignToReviewerAndReviewee;
    vm.canRemove = canRemove;
    vm.canEdit = canEdit;
    vm.periods = PeriodsService.query();

    vm.squads = [];

    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];

    if (vm.reviewrequest._id) {
      vm.reviewrequest.periodFrom = new Date(vm.reviewrequest.periodFrom); //ui-date-picker expects a JS Date not a string
      vm.reviewrequest.periodTo = new Date(vm.reviewrequest.periodTo);
      vm.reviewrequest.dueBy = new Date(vm.reviewrequest.dueBy);
      revieweeSelected();
    }
    else
      vm.reviewrequest.status = 'open';

    vm.reviewers = [];
    vm.reviewees = [];
    EmployeesService.query(function (data) {
      vm.reviewees = data;
      angular.forEach(data, function (eachEmployee) {
        if (eachEmployee.reviewer)
          vm.reviewers.push(eachEmployee);
      });
    });

    function revieweeSelected() {
      vm.squads = [];
      SquadallocationsService.query(
        {
          employeeId: vm.reviewrequest.reviewee._id
        },
        function (allocations) {
          angular.forEach(allocations, function (eachAllocation) {
            vm.squads.push(eachAllocation.squad);
          });
        });

    }


    // Remove existing Reviewrequest
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.reviewrequest.$remove($state.go('reviewrequests.list'));
      }
    }

    // Save Reviewrequest
    function save(isValid) {
      if (!reviewrequest.reviewer.systemUser) {
        vm.error = 'Please add the system user in the employee entry for ' + reviewrequest.reviewer.name;
        return false;
      }
      if (!reviewrequest.reviewee.systemUser) {
        vm.error = 'Please add the system user in the employee entry for ' + reviewrequest.reviewee.name;
        return false;
      }
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reviewrequestForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.reviewrequest._id) {
        vm.reviewrequest.$update(successCallback, errorCallback);
      } else {
        vm.reviewrequest.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('reviewrequests.view', {
          reviewrequestId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.openCalendar = function () {
      vm.isCalendarOpen = true;
    };
    vm.openCalendar1 = function () {
      vm.isCalendarOpen1 = true;
    };

    vm.openCalendar2 = function () {
      vm.isCalendarOpen2 = true;
    };

    function assignToReviewerAndReviewee() {
      assign(vm.reviewrequest.reviewee, 'submitted');
      assign(vm.reviewrequest.reviewer);

    }

    function assign(assignee, status) {
      var review = new PerformancereviewsService();
      review.request = vm.reviewrequest;
      review.name = vm.reviewrequest.name;
      review.outcomes = [];
      review.assignee = assignee.systemUser;
      SquadoutcomesService.query({
        squadId: vm.reviewrequest.outcomeSquad._id
      }, function (outcomes) {
        for (var i = 0; i < outcomes.length; i++) {
          review.outcomes.push({
            description: outcomes[ i ].name,
            mandatory: outcomes[ i ].core,
            usedForScoring: outcomes[ i ].usedForScoring
          });
        }
        review.$save(successCallback, errorCallback);
        function successCallback(res) {
          vm.message = 'Feedback reviews submitted';
          if (status) {
            vm.reviewrequest.status = status;
            vm.reviewrequest.performanceReviewId = review._id;
            save(true);
          }
        }

        function errorCallback(res) {
          vm.message = res.data.message;
        }
      });
    }

    function canRemove() {
      return vm.authentication.user.isAdmin || vm.authentication.user.isHRAdmin || vm.reviewrequest.status === 'open' || vm.reviewrequest.status === 'both-reviews-completed';
    }

    function canEdit() {
      return vm.reviewrequest.status === 'open';
    }
  }
})();
