(function () {
  'use strict';

  // Opportunitynotes controller
  angular
    .module('opportunitynotes')
    .controller('OpportunitynotesController', OpportunitynotesController);

  OpportunitynotesController.$inject = [ '$scope', '$state', 'Authentication', 'opportunitynoteResolve', 'OpportunitiesService', '$stateParams' ];

  function OpportunitynotesController($scope, $state, Authentication, opportunitynote, OpportunitiesService, $stateParams) {
    var vm = this;

    vm.authentication = Authentication;
    vm.opportunitynote = opportunitynote;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.opportunity = OpportunitiesService.get({opportunityId: $stateParams.opportunityId});
    // Remove existing Opportunitynote
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.opportunitynote.$remove($state.go('opportunitynotes.list'));
      }
    }

    // Save Opportunitynote
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.opportunitynoteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.opportunitynote._id) {
        vm.opportunitynote.$update(successCallback, errorCallback);
      } else {
        vm.opportunitynote.opportunity = vm.opportunity;
        vm.opportunitynote.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('opportunitynotes.list', {
          opportunityId: vm.opportunity._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
