(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = [ '$scope', '$state', 'Authentication', 'productResolve', '$filter', '$confirm',
    'BusinessunitsService', 'SquadsService' ];

  function ProductsController($scope, $state, Authentication, product, $filter, $confirm,
                              BusinessunitsService, SquadsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.product = product;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.showFeatures = false;
    vm.buildPricingTables = buildPricingTables;
    vm.businessUnits = BusinessunitsService.query();
    vm.updateSquadsList = updateSquadsList;

    SquadsService.query().$promise.then(function (squads) {
      vm.allSquads = squads;
      if (vm.product.businessUnit)
        updateSquadsList();
    });

    function updateSquadsList() {
      vm.squads = [];
      for (var i = 0; i < vm.allSquads.length; i++) {
        var eachSquad = vm.allSquads[ i ];
        if (eachSquad.outcomeTeam.businessUnit._id === vm.product.businessUnit._id)
          vm.squads.push(eachSquad);
      }
    }

    if (vm.product.priceDeterminant) {
      vm.buildPricingTables();
    }

    function buildPricingTables() {
      initGridProductOptions();
      initFeatureDefinitionOptions();
      vm.tableInitialised = true;
    }

    // Remove existing Product
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.product.$remove($state.go('products.list'));
      }
    }

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.product._id) {
        vm.product.$update(successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('products.list');
        // $confirm({
        //   text: 'Changes were successfully saved',
        //   title: 'Success'
        // });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    var resetData = [
      {
        tierName: 'Tier 6',
        exampleCustomers: 'Auswide, Arab Bank',
        fromNumberOfCustomers: 25000,
        toNumberOfCustomers: 50000,
        costPerCustomer: 5,
        totalPrice: (50000 * 5)
      },
      {
        tierName: 'Tier 5',
        exampleCustomers: 'NPBS, My State',
        fromNumberOfCustomers: 50000,
        toNumberOfCustomers: 100000,
        costPerCustomer: 4,
        totalPrice: (100000 * 4)
      },
      {
        tierName: 'Tier 4',
        exampleCustomers: 'CUA, ME Bank',
        fromNumberOfCustomers: 100000,
        toNumberOfCustomers: 200000,
        costPerCustomer: 3,
        totalPrice: (200000 * 3)
      },
      {
        tierName: 'Tier 3',
        exampleCustomers: 'AMP',
        fromNumberOfCustomers: 200000,
        toNumberOfCustomers: 300000,
        costPerCustomer: 2.5,
        totalPrice: (300000 * 2.5)
      },
      {
        tierName: 'Tier 2',
        exampleCustomers: 'Suncorp BOQ',
        fromNumberOfCustomers: 300000,
        toNumberOfCustomers: 750000,
        costPerCustomer: 2,
        totalPrice: (750000 * 2)
      },
      {
        tierName: 'Tier 1',
        exampleCustomers: 'ANZ, CBA, NAB, Westpac',
        fromNumberOfCustomers: 750000,
        toNumberOfCustomers: 1500000,
        costPerCustomer: 1.5,
        totalPrice: (1500000 * 1.5)
      } ];

    function initGridProductOptions() {
      vm.priceGridOptions = {};
      vm.priceGridOptions.enableRowSelection = true;
      vm.priceGridOptions.multiSelect = false;
      vm.priceGridOptions.onRegisterApi = function (gridApi) {
        vm.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          setFeatureOptions(row);
        });
      };

      function getFromDisplayDescription() {
        var results;
        switch (vm.product.priceDeterminant) {
          case 'registeredUsers':
            results = 'Customers from';
            break;
          case 'numberOfApplications':
            results = 'Applications from';
            break;
          case 'numberOfInternalUsers':
            results = 'Internal users from';
            break;
        }
        return results;
      }


      function getToDisplayDescription() {
        var results;
        switch (vm.product.priceDeterminant) {
          case 'registeredUsers':
            results = 'Customers to';
            break;
          case 'numberOfApplications':
            results = 'Applications to';
            break;
          case 'numberOfInternalUsers':
            results = 'Internal users to';
            break;
        }
        return results;
      }

      function getToUnitCostDescription() {
        var results;
        switch (vm.product.priceDeterminant) {
          case 'registeredUsers':
            results = 'Cost/User';
            break;
          case 'numberOfApplications':
            results = 'Cost/Application';
            break;
          case 'numberOfInternalUsers':
            results = 'Cost/User';
            break;
        }
        return results;
      }

      vm.priceGridOptions.columnDefs = [
        {
          name: 'tierName',
          displayName: 'Tier Name',
          enableCellEdit: true,
          width: '15%'
        },
        {
          name: 'exampleCustomers',
          displayName: 'Example Customers',
          enableCellEdit: true,
          width: '20%'
        },
        {
          name: 'fromNumberOfCustomers',
          displayName: getFromDisplayDescription(),
          enableCellEdit: true,
          width: '15%',
          cellFilter: 'number'
        },
        {
          name: 'toNumberOfCustomers',
          displayName: getToDisplayDescription(),
          enableCellEdit: true,
          width: '15%',
          cellFilter: 'number'
        },
        {
          name: 'costPerCustomer',
          displayName: getToUnitCostDescription(),
          enableCellEdit: true,
          width: '15%',
          cellFilter: 'number:2'
        },
        {
          name: 'totalPrice',
          displayName: 'Total Price (Core) ($)',
          enableCellEdit: false,
          width: '20%',
          cellFilter: 'number:2'
        }
      ];
      if (!vm.product.productTiers || !vm.product.productTiers.length) {
        vm.product.productTiers = [];
        vm.product.productTiers.push(
          {
            tierName: 'Tier 1',
            exampleCustomers: 'ANZ, NAB',
            fromNumberOfCustomers: 750000,
            toNumberOfCustomers: 1500000,
            costPerCustomer: 1.5,
            totalPrice: (1500000 * 1.5)
          }
        );
      }
      vm.product.productTiers = $filter('orderBy')(vm.product.productTiers, 'fromNumberOfCustomers');
      vm.priceGridOptions.data = vm.product.productTiers;
    }

    vm.addRow = function () {
      vm.product.productTiers.push(
        {

          tierName: '',
          exampleCustomers: '',
          fromNumberOfCustomers: 0,
          toNumberOfCustomers: 0,
          costPerCustomer: 0,
          totalPrice: 0

        });

      vm.product.productTiers = $filter('orderBy')(vm.product.productTiers, 'fromNumberOfCustomers');
      vm.priceGridOptions.data = vm.product.productTiers;
    };

    vm.removeSelectedTier = function () {
      for (var i = 0; i < vm.product.productTiers.length; i++) {
        if (vm.product.productTiers[ i ].tierName === vm.selectedTier.tierName)
          vm.product.productTiers.splice(i, 1);
      }
      vm.showFeatures = false;

    };

    vm.reset = function () {
      vm.product.productTiers = angular.copy(resetData);
      vm.priceGridOptions.data = vm.product.productTiers;

    };

    vm.calculateTotalPrice = function () {
      angular.forEach(vm.product.productTiers, function (eachTier) {
        eachTier.totalPrice = eachTier.costPerCustomer * eachTier.toNumberOfCustomers;
      });
      vm.priceGridOptions.data = [];
      vm.priceGridOptions.data = vm.product.productTiers;
    };

    vm.deleteSelectedFeature = function () {
      for (var i = 0; i < vm.selectedTier.features.length; i++) {
        if (vm.selectedTier.features[ i ].featureName === vm.selectedFeature.featureName)
          vm.selectedTier.features.splice(i, 1);
      }
    };

    function setFeatureOptions(selectedRow) {

      vm.featureGridOptions = {};
      vm.featureGridOptions.enableRowSelection = true;
      vm.featureGridOptions.multiSelect = false;
      vm.featureGridOptions.onRegisterApi = function (gridApi) {
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected)
            vm.selectedFeature = row.entity;
          else
            vm.selectedFeature = null;
        });
      };
      vm.showFeatures = selectedRow.isSelected;
      vm.selectedTier = selectedRow.entity;

      vm.featureGridOptions.columnDefs = [
        {
          name: 'featureName',
          displayName: 'Product Feature Name',
          enableCellEdit: false,
          width: '30%'
        },
        {
          name: 'featurePricePercentage',
          displayName: 'Cost Percentage',
          enableCellEdit: true,
          width: '30%',
          cellFilter: 'number'
        },
        {
          name: 'featurePrice',
          displayName: 'Optional Feature Price',
          enableCellEdit: false,
          width: '40%',
          cellFilter: 'number'
        } ];
      vm.featureGridOptions.data = vm.selectedTier.features;

    }


    vm.resetFeatures = function () {
      vm.selectedTier.features = [];
      angular.forEach(vm.product.featureDefinitions, function (eachDefinition) {
        vm.selectedTier.features.push({
          productName: vm.product.name,
          featureName: eachDefinition.featureName,
          featurePricePercentage: eachDefinition.recommendedCostPercentage,
          featurePrice: eachDefinition.recommendedCostPercentage * vm.selectedTier.totalPrice * 0.01
        });
      });
      vm.featureGridOptions.data = [];
      vm.featureGridOptions.data = vm.selectedTier.features;

    };

    vm.updateFeatures = function () {
      for (var i = 0; i < vm.product.featureDefinitions.length; i++) {
        var eachDefinition = vm.product.featureDefinitions[ i ];
        var featureAlreadyExists = false;
        for (var j = 0; j < vm.selectedTier.features.length; j++) {
          var eachProductFeature = vm.selectedTier.features[ j ];
          if (eachProductFeature.featureName === eachDefinition.featureName)
            featureAlreadyExists = true;
        }
        if (!featureAlreadyExists)
          vm.selectedTier.features.push({
            productName: vm.product.name,
            featureName: eachDefinition.featureName,
            featurePricePercentage: eachDefinition.recommendedCostPercentage,
            featurePrice: eachDefinition.recommendedCostPercentage * vm.selectedTier.totalPrice * 0.01
          });
      }

      vm.featureGridOptions.data = [];
      vm.featureGridOptions.data = vm.selectedTier.features;

    };

    vm.calculateFeaturePrices = function () {
      angular.forEach(vm.selectedTier.features, function (eachFeature) {
        eachFeature.featurePrice = eachFeature.featurePricePercentage * vm.selectedTier.totalPrice * 0.01;
      });
      vm.featureGridOptions.data = [];
      vm.featureGridOptions.data = vm.selectedTier.features;
    };


    function initFeatureDefinitionOptions() {
      vm.featureDefinitionOptions = {};
      vm.featureDefinitionOptions.enableRowSelection = true;
      vm.featureDefinitionOptions.multiSelect = false;
      vm.featureDefinitionOptions.onRegisterApi = function (gridApi) {
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
          if (row.isSelected)
            vm.selectedTemplateFeature = row.entity;
          else
            vm.selectedTemplateFeature = null;
        });
      };

      vm.featureDefinitionOptions.columnDefs = [
        {
          name: 'featureName',
          displayName: 'Product Feature Name (Optional)',
          enableCellEdit: true,
          width: '30%'
        },
        {
          name: 'featureDescription',
          displayName: 'Feature Description',
          enableCellEdit: true,
          width: '50%'
        },
        {
          name: 'recommendedCostPercentage',
          displayName: 'Recommended Cost %',
          enableCellEdit: true,
          width: '20%',
          cellFilter: 'number'
        } ];

      if (!vm.product.featureDefinitions || !vm.product.featureDefinitions.length) {
        vm.product.featureDefinitions = [];
      }
      vm.product.featureDefinitions = $filter('orderBy')(vm.product.featureDefinitions, 'featureName');
      vm.featureDefinitionOptions.data = vm.product.featureDefinitions;

    }

    vm.removeSelectedTemplateFeature = function () {
      for (var i = 0; i < vm.product.featureDefinitions.length; i++) {
        if (vm.product.featureDefinitions[ i ].featureName === vm.selectedTemplateFeature.featureName)
          vm.product.featureDefinitions.splice(i, 1);
      }
    };

    vm.addFeatureDefinitionRow = function () {
      vm.product.featureDefinitions.push(
        {
          featureName: 'Enter a unique feature name',
          featureDescription: 'Enter feature description',
          recommendedCostPercentage: 0
        });
    };
  }

})();
