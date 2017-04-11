'use strict';

angular.module('users').controller('EditProfileController', [ '$scope', '$http', '$location', 'Users',
  'Authentication', 'BusinessunitsService',
  function ($scope, $http, $location, Users,
            Authentication, BusinessunitsService) {
    $scope.user = Authentication.user;
    $scope.businessUnits = BusinessunitsService.query();

    if ($scope.user.defaultBusinessUnit)
      BusinessunitsService.get({ businessunitId: $scope.user.defaultBusinessUnit }).$promise.then(function (bu) {
        $scope.user.defaultBusinessUnit = bu;
      });

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      //$scope.user.defaultBusinessUnit = $scope.user.defaultBusinessUnit._id;
      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');
        $scope.success = true;
        Authentication.user = response;

      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);
