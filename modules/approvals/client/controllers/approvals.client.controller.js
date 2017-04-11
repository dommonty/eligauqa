(function () {
  'use strict';

  // Approvals controller
  angular
    .module('approvals')
    .controller('ApprovalsController', ApprovalsController);

  ApprovalsController.$inject = [ '$scope', '$state', 'Authentication', 'approvalResolve', 'EmployeesService', 'quoteResolve' ];

  function ApprovalsController($scope, $state, Authentication, approval, EmployeesService, quote) {
    var vm = this;

    vm.authentication = Authentication;
    vm.approval = approval;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.quote = quote;

    vm.statuses = [
      {
        key: 'approved', description: 'Approved'
      },
      {
        key: 'approved-referred', description: 'Approved and referred back'
      },
      {
        key: 'rejected', description: 'Rejected'
      },
      {
        key: 'moreInfoRequired', description: 'More info required'
      },
      {
        key: 'sentToCustomer', description: 'Sent to Customer'
      },
      {
        key: 'requested', description: 'Approval Requested'
      } ];

    vm.format = 'dd-MMMM-yyyy';
    vm.altInputFormats = [ 'd!/M!/yyyy', 'dd.MM.yyyy' ];

    vm.openCalendar = function () {
      vm.isCalendarOpen = true;
    };

    if (vm.approval._id) {
      vm.approval.dueBy = new Date(vm.approval.dueBy); //ui-date-picker expects a JS Date not a string
      angular.forEach(vm.statuses, function (eachStatus) {
        if (eachStatus.key === vm.approval.status)
          vm.approval.status = eachStatus;
      });
    }
    else
      vm.approval.status = {
        key: 'requested', description: 'Approval Requested'
      };

    vm.approvers = EmployeesService.query({
      quoteAuthorityLevel: 1000
    });

// Remove existing Approval
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.approval.$remove($state.go('approvals.list'));
      }
    }

// Save Approval
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.approvalForm');
        return false;
      }

      if (vm.approval.status.key === 'approved' && vm.approval.approver.quoteEstimateAuthorityLevel < vm.quote.totalPrice) {
        vm.error = "You don't have the right authority level to approve this quote, you need to refer it to an authorised employee";
        return false;
      }

      vm.approval.status = vm.approval.status.key;
      vm.approval.quote = vm.quote;

      // TODO: move create/update logic to service
      if (vm.approval._id) {
        vm.approval.$update(successCallback, errorCallback);

      } else {
        vm.approval.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('approvals.view', {
          approvalId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})
();
