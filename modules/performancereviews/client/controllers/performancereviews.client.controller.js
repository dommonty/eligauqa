(function () {
  'use strict';

  // Performancereviews controller
  angular
    .module('performancereviews')
    .controller('PerformancereviewsController', PerformancereviewsController);

  PerformancereviewsController.$inject = [ '$scope', '$state', 'Authentication', 'performancereviewResolve',
    'ReviewrequestsService', '$window', 'PerformancereviewsService' ];

  function PerformancereviewsController($scope, $state, Authentication, performancereview, ReviewrequestsService,
                                        $window, PerformancereviewsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.performancereview = performancereview;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.submitReview = submitReview;
    vm.canEdit = canEdit;
    vm.viewOnly = viewOnly;
    vm.canSubmit = canSubmit;
    vm.canViewRevieweeFeedback = canViewRevieweeFeedback;
    getRevieweeFormId();

    // Remove existing Performancereview
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        if (vm.performancereview.request)
          vm.performancereview.$remove($state.go('performancereviews.list', {
            reviewrequestId: vm.performancereview.request._id
          }));
        else
          vm.performancereview.$remove($state.go('performancereviews.list'));
      }
    }

    // Save Performancereview
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.performancereviewForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.performancereview._id) {
        vm.performancereview.$update(successCallback, errorCallback);
      } else {
        vm.performancereview.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('performancereviews.view', {
          performancereviewId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function submitReview() {
      for (var i = 0; i < vm.performancereview.outcomes.length; i++) {
        var eachOutcome = vm.performancereview.outcomes[ i ];
        if (eachOutcome.mandatory && !eachOutcome.score) {
          vm.error = 'All rating questions flagged as mandatory must be answered before submission';
          return;
        }
      }

      ReviewrequestsService.get({
        reviewrequestId: vm.performancereview.request._id
      }).$promise.then(function (data) {
        if (vm.performancereview.request.reviewee.systemUser === vm.authentication.user._id) {
          data.status = 'reviewee-completed';
        }
        else if (vm.performancereview.request.reviewer.systemUser === vm.authentication.user._id) {
          if (data.status === 'reviewee-completed')
            data.status = 'reviewer-completed';
          else if (data.status === 'reviewer-completed')
            data.status = 'both-reviews-completed';
        }
        data.performanceReviewId = vm.performancereview.request._id;
        data.$update(function (res) {
          vm.message = 'Thank you, your feedback has been submitted for review';
          $window.location.reload();
        }, function (res) {
          vm.error = res.data.message;
        });
        vm.performancereview.immutable = true;
        save(true);
      });


    }

    function canEdit() {
      if (vm.performancereview.assignee._id !== vm.authentication.user._id)
        return false;

      return !vm.performancereview.immutable;

    }

    function viewOnly() {
      return vm.performancereview.immutable;
    }

    function canSubmit() {
      if (vm.performancereview.assignee._id === vm.authentication.user._id) {
        if (vm.performancereview.request.reviewee.systemUser === vm.authentication.user._id) {
          switch (vm.performancereview.request.status) {
            case 'open':
              return false;
            case 'submitted':
              return true;
            case 'both-reviews-completed':
              return false;
            case 'reviewee-completed':
              return false;
            case 'reviewer-completed':
              return false;
          }
          return false;
        }
        else if (vm.performancereview.request.reviewer.systemUser === vm.authentication.user._id) {
          switch (vm.performancereview.request.status) {
            case 'open':
              return false;
            case 'submitted':
              return false;
            case 'both-reviews-completed':
              return false;
            case 'reviewee-completed':
              return true;
            case 'reviewer-completed':
              return true;
          }
          return false;

        }

      }
    }

    function canViewRevieweeFeedback() {
      return vm.performancereview.request.reviewer.systemUser === vm.authentication.user._id &&
        (vm.performancereview.request.status === 'reviewee-completed' ||
        vm.performancereview.request.status === 'reviewer-completed' ||
        vm.performancereview.request.status === 'both-reviews-completed');
    }

    function getRevieweeFormId() {
      PerformancereviewsService.query({
        reviewRequestId: vm.performancereview.request._id,
        assigneeId: vm.performancereview.request.reviewee.systemUser
      }).$promise.then(function (reviews) {
        if (reviews.length > 0)
          vm.revieweeReview = reviews[ 0 ];
      });
    }
  }
})
();

