(function () {
  'use strict';

  angular
    .module('projects')
    .controller('ProjectStatisticsController', ProjectStatisticsController);

  ProjectStatisticsController.$inject = [ '$scope', 'ProjectsService', 'Authentication', 'BusinessunitsService' ];

  function ProjectStatisticsController($scope, ProjectsService, Authentication, BusinessunitsService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.businessUnits = BusinessunitsService.query();
    init();

    vm.businessUnitChanged = function () {
      if (vm.businessUnit) {
        ProjectsService.query({
          status: "progress",
          businessUnitId: vm.businessUnit ? vm.businessUnit._id : null
        }).$promise.then(function (data) {
          vm.projects = data;
        });
      }
    };

    function init() {
      BusinessunitsService.get({
        businessunitId: vm.authentication.user.defaultBusinessUnit
      }).$promise.then(function (bu) {
        vm.businessUnit = bu;
        vm.businessUnitChanged();
      });
    }
  }
})();
