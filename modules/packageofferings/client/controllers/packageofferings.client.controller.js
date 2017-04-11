(function () {
  'use strict';

  // Packageofferings controller
  angular
    .module('packageofferings')
    .controller('PackageofferingsController', PackageofferingsController);

  PackageofferingsController.$inject = [ '$scope', '$state', 'Authentication', 'packageofferingResolve' ];

  function PackageofferingsController($scope, $state, Authentication, packageoffering) {
    var vm = this;

    vm.authentication = Authentication;
    vm.packageoffering = packageoffering;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    initPackageOfferingForm();

    // Remove existing Packageoffering
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.packageoffering.$remove($state.go('packageofferings.list'));
      }
    }

    // Save Packageoffering
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.packageofferingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.packageoffering._id) {
        vm.packageoffering.$update(successCallback, errorCallback);
      } else {
        vm.packageoffering.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('packageofferings.view', {
          packageofferingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function initPackageOfferingForm() {
      var nameField = {
        key: 'name',
        className: 'col-xs-4',
        type: 'input',
        templateOptions: {
          label: 'Package Name',
          required: true
        }
      };
      var discountField = {
        key: 'discount',
        className: 'col-xs-4',
        type: 'input',
        templateOptions: {
          type: 'Number',
          label: 'Discount (%)',
          required: true
        }
      };
      var descriptionField = {
        key: 'description',
        className: 'col-xs-4',
        type: 'input',
        templateOptions: {
          type: 'Text',
          label: 'Short Description',
          required: true
        }
      };

      vm.packageOfferingFields = [
        {
          className: 'row',
          fieldGroup: [ nameField, descriptionField, discountField]
        } ];
    }
  }
})();
