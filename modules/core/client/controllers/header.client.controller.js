'use strict';

angular.module('core').controller('HeaderController', [ '$rootScope', '$scope', '$state', 'Authentication', 'Menus',
  'OpportunityactionsService', 'BusinessunitsService',
  function ($rootScope, $scope, $state, Authentication, Menus, OpportunityactionsService, BusinessunitsService) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;


    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    updateOpportunityActionsCount();

    function updateOpportunityActionsCount() {
      OpportunityactionsService.query({assigneeId: $scope.authentication.user._id}, function (opportunityActions) {
        $scope.actionCount = 0;
        angular.forEach(opportunityActions, function (eachAction) {
          if (eachAction.assignee._id === $scope.authentication.user._id && eachAction.status !== 'closed')
            $scope.actionCount++;
        });

      });
    }

    function setHelpLink() {
      BusinessunitsService.get({
        businessunitId: $scope.authentication.user.defaultBusinessUnit
      }).$promise.then(function (bu) {
        if (bu)
          $scope.company = bu.company;
      });
    }

    //user has signed in , refresh the count now
    $rootScope.$on('userSignedIn', function (event, signedInUser) {
      updateOpportunityActionsCount();
      setHelpLink();
    });
  }
]);
