(function () {
  'use strict';

  // Quotes controller
  angular
    .module('quotes')
    .controller('QuotesController', QuotesController);

  QuotesController.$inject = [ '$scope', '$state', 'Authentication', 'quoteResolve', 'CustomersService', 'RegionsService',
    'Admin', 'CurrenciesService', 'SupportplansService', 'PackageofferingsService', 'CeodiscountsService',
    'ProductsService', 'ContracttermsService', '$window', '$filter' ];

  function QuotesController($scope, $state, Authentication, quote, CustomersService, RegionsService,
                            Admin, CurrenciesService, SupportplansService, PackageofferingsService, CeodiscountsService,
                            ProductsService, ContracttermsService, $window, $filter) {
    var vm = this;

    vm.authentication = Authentication;
    vm.quote = quote;

    if (vm.quote.currency)
      vm.quote.currency = vm.quote.currency._id; //customers drop down only expects the _id
    if (vm.quote.customer)
      vm.quote.customer = vm.quote.customer._id; //customers drop down only expects the _id
    if (vm.quote.accountOwner)
      vm.quote.accountOwner = vm.quote.accountOwner._id; //Account owner drop down only expects the _id
    if (vm.quote.supportPlan) { //Account owner drop down only expects the _id
      vm.quote.supportPlan = vm.quote.supportPlan._id;
    }

    if (vm.quote.ceoDiscount)
      vm.quote.ceoDiscount = vm.quote.ceoDiscount._id; //Account owner drop down only expects the _id
    if (vm.quote.contractPeriod) {
      vm.quote.contractPeriod = vm.quote.contractPeriod._id; //Account owner drop down only expects the _id
    }

    if (vm.quote.packageOffer)
      vm.quote.packageOffer = vm.quote.packageOffer._id; //Account owner drop down only expects the _id

    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.customers = CustomersService.query();
    vm.regions = RegionsService.query();
    vm.accountOwners = Admin.query();
    vm.currencies = CurrenciesService.query();
    vm.supportPlans = SupportplansService.query();
    vm.packageOffers = PackageofferingsService.query();
    vm.ceoDiscounts = CeodiscountsService.query();
    vm.contractTerms = ContracttermsService.query();
    var productCollapseStates = [];
    //vm.nextFromDiscountStep = populateDropDownModels;

    pricedByCustomers();
    pricedByApplications();
    pricedByInternalUsers();
    populateDropDownModels();


    ProductsService.query().$promise.then(function (data) {
      vm.products = data;
      initQuoteForm();
      initialiseProductCollapseStates();
    });

    if (!vm.quote.includedProducts)
      vm.quote.includedProducts = [];

    function initialiseProductCollapseStates() {

      angular.forEach(vm.products, function (eachProduct) {
        productCollapseStates[ eachProduct.name ] = false;
      });
    }

    vm.toggleCollapse = function (product) {
      productCollapseStates[ product.name ] = !productCollapseStates[ product.name ];
    };

    vm.isCollapsed = function (product) {
      return productCollapseStates[ product.name ];
    };

    //return all the quote items matching the product
    vm.quotedItemsForProduct = function (product) {
      var results = [];

      angular.forEach(vm.quote.quotedItems, function (eachQuoteItem) {
        if (eachQuoteItem.productName === product.name)
          results.push(eachQuoteItem);
      });
      return results;
    };


    //returns the product tier matching the number of customers
    function identifyProductTier(product, customerCount) {
      var result = {};
      for (var i = 0; i < product.productTiers.length; i++) {
        var eachProductTier = product.productTiers[ i ];
        if (customerCount >= eachProductTier.fromNumberOfCustomers &&
          customerCount <= eachProductTier.toNumberOfCustomers) {
          result = eachProductTier;
          break;
        }
      }
      return result;
    }

    vm.nextFromSizeAndProjection = function () {
      calculateTotal();
      initializeQuotedItems();
    };

    // the supportPlan Id is kept in the quote.  retrieve the supportPlan object and save it in the local scope so
    // that the pricing can be calculated
    function populateDropDownModels() {

      SupportplansService.get({
        supportplanId: vm.quote.supportPlan
      }, function (supportPlan) {
        vm.supportPlan = supportPlan;
      });

      CeodiscountsService.get({
        ceodiscountId: vm.quote.ceoDiscount
      }, function (ceoDiscount) {
        vm.ceoDiscount = ceoDiscount;
      });

      ContracttermsService.get({
        contracttermId: vm.quote.contractPeriod
      }, function (period) {
        vm.contractPeriod = period;
      });

    }


    function initializeQuotedItems() {
      if (!vm.quote.quotedItems)
        vm.quote.quotedItems = [];
      for (var i = 0; i < vm.quote.includedProducts.length; i++) {
        var eachProduct = vm.quote.includedProducts[ i ];
        var tieredProductFeatures = identifyProductTier(eachProduct, vm.quote.maxNumberOfCustomers).features;
        if (tieredProductFeatures) {
          for (var j = 0; j < tieredProductFeatures.length; j++) {
            var eachFeature = tieredProductFeatures[ j ];
            var found = false;
            for (var k = 0; k < vm.quote.quotedItems.length; k++) {
              if (vm.quote.quotedItems[ k ].featureName === eachFeature.featureName)
                found = true;
            }
            if (!found)
              vm.quote.quotedItems.push({
                productName: eachProduct.name,
                featureName: eachFeature.featureName,
                featurePrice: eachFeature.featurePrice,
                included: false
              });

          }
        }
      }
    }

    vm.featureCheckBoxChanged = function () {
      calculateTotal();
    };

    function calculateTotal() {
      vm.totalPrice = 0;
      vm.totalDiscountedPrice = 0;

      angular.forEach(vm.quote.quotedItems, function (eachQuotedItem) {
        if (eachQuotedItem.included) {
          vm.totalPrice = vm.totalPrice + vm.priceWithSupport(eachQuotedItem.featurePrice);
          vm.totalDiscountedPrice = vm.totalDiscountedPrice + vm.discountedPrice(eachQuotedItem.featurePrice);
        }
      });

    }

    vm.priceWithSupport = function (price) {
      var supportCharge = (price * vm.supportPlan.premium / 100);
      return price + supportCharge;
    };

    vm.discountedPrice = function (price) {
      var contractDiscount = (price * vm.contractPeriod.discount / 100);
      var ceoDiscount = (price * vm.ceoDiscount.discount / 100);
      return vm.priceWithSupport(price) - contractDiscount - ceoDiscount;
    };


    // Save Quote
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.quoteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.quote._id) {
        vm.quote.$update(successCallback, errorCallback);
      } else {
        vm.quote.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('quotes.view', {
          quoteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


    function initQuoteForm() {
      var quoteDescriptionField = {
        key: 'name',
        className: 'col-xs-6',
        type: 'input',
        templateOptions: {
          label: 'Quote Name',
          required: true
        }
      };
      var quoteNotesField = {
        key: 'notes',
        className: 'col-xs-6',
        type: 'textarea',
        templateOptions: {
          label: 'Quote Notes',
          required: true
        }
      };
      var regionField = {
        key: 'region',
        className: 'col-xs-6',
        type: 'select',
        templateOptions: {
          label: 'Region',
          valueProp: '_id',
          labelProp: 'name',
          options: vm.regions,
          required: true
        }
      };

      var customerNameField = {
        key: 'customer',
        className: 'col-xs-6',
        type: 'select',
        templateOptions: {
          label: 'Customer',
          valueProp: '_id',
          labelProp: 'name',
          options: vm.customers,
          required: true
        }
      };

      var accountOwnerField = {
        key: 'accountOwner',
        className: 'col-xs-6',
        type: 'select',
        templateOptions: {
          label: 'Account Owner',
          valueProp: '_id',
          labelProp: 'displayName',
          options: vm.accountOwners,
          required: true
        }
      };

      var maxNumberOfCustomersField = {
        key: 'maxNumberOfCustomers',
        className: 'col-xs-6',
        type: 'input',
        hideExpression: '!model.pricedByCustomers',
        templateOptions: {
          label: 'Max number of registered customers',
          type: 'Number',
          required: true,
          onChange: function (modelValue) {
            vm.quote.maxNumberOfCustomers = modelValue;
          }
        }
      };
      var maxNumberOfApplicationsField = {
        key: 'maxNumberOfApplications',
        className: 'col-xs-6',
        type: 'input',
        hideExpression: '!model.pricedByApplications',
        templateOptions: {
          label: 'Max number of successful applications ',
          type: 'Number',
          required: true,
          onChange: function (modelValue) {
            vm.quote.maxNumberOfApplications = modelValue;
          }
        }
      };
      var maxNumberOfInternalUsersField = {
        key: 'maxNumberOfInternalUsers',
        className: 'col-xs-6',
        type: 'input',
        hideExpression: '!model.pricedByInternalUsers',
        templateOptions: {
          label: 'Max number of internal users (e.g. branch users',
          type: 'Number',
          required: true,
          onChange: function (modelValue) {
            vm.quote.maxNumberOfInternalUsers = modelValue;
          }
        }
      };

      var currencyField = {
        key: 'currency',
        className: 'col-xs-6',
        type: 'select',
        templateOptions: {
          label: 'Currency',
          valueProp: '_id',
          labelProp: 'name',
          options: vm.currencies,
          required: true
        }
      };

      var supportPlanField = {
        key: 'supportPlan',
        className: 'col-xs-6',
        type: 'select',
        templateOptions: {
          label: 'Support Plan',
          valueProp: '_id',
          labelProp: 'name',
          options: vm.supportPlans,
          required: false,
          onChange: function (modelValue) {
            SupportplansService.get({
              supportplanId: modelValue
            }, function (supportPlan) {
              vm.supportPlan = supportPlan;
            });

          }
        }
      };


      var packageOfferField = {
        key: 'packageOffer',
        className: 'col-xs-6',
        type: 'select',
        templateOptions: {
          label: 'Package Offer',
          valueProp: '_id',
          labelProp: 'name',
          options: vm.packageOffers,
          required: true
        }
      };

      var ceoDiscountField = {
        key: 'ceoDiscount',
        className: 'col-xs-6',
        type: 'select',
        templateOptions: {
          label: 'CEO Discount',
          valueProp: '_id',
          labelProp: 'discount',
          options: vm.ceoDiscounts,
          required: true,
          onChange: function (modelValue) {
            CeodiscountsService.get({
              ceodiscountId: modelValue
            }, function (ceoDiscount) {
              vm.ceoDiscount = ceoDiscount;
            });

          }
        }
      };

      var contractTermField = {
        key: 'contractPeriod',
        className: 'col-xs-6',
        type: 'select',
        templateOptions: {
          label: 'Contract Term (Years)',
          valueProp: '_id',
          labelProp: 'contractTerm',
          options: vm.contractTerms,
          required: true,
          onChange: function (modelValue) {
            ContracttermsService.get({
              contracttermId: modelValue
            }, function (term) {
              vm.contractPeriod = term;
            });

          }
        }
      };

      vm.exitValidation = function (form) {
        return form && !form.$invalid;
      };


      var growthPercentageField = {
        key: 'yearlyGrowthPercentage',
        className: 'col-xs-6',
        type: 'input',
        hideExpression: '!model.pricedByCustomers',
        templateOptions: {
          label: 'Yearly Growth Percentage of registered Customers',
          type: 'Number'
        }
      };

      var yearlyGrowthPercentageApplicationsField = {
        key: 'yearlyGrowthPercentageApplications',
        className: 'col-xs-6',
        type: 'input',
        hideExpression: '!model.pricedByApplications',
        templateOptions: {
          label: 'Yearly Growth Percentage of successful applications',
          type: 'Number'
        }
      };
      var yearlyGrowthPercentageInternalUsersField = {
        key: 'yearlyGrowthPercentageInternalUsers',
        className: 'col-xs-6',
        type: 'input',
        hideExpression: '!model.pricedByInternalUsers',
        templateOptions: {
          label: 'Yearly Growth Percentage of internal users',
          type: 'Number'
        }
      };

      var costPerStoryPointField = {
        key: 'costPerStoryPoint',
        className: 'col-xs-6',
        type: 'input',
        templateOptions: {
          label: 'Cost Per Story Point ($)',
          type: 'Number'
        }
      };

      var teamVelocityField = {
        key: 'teamVelocity',
        className: 'col-xs-6',
        type: 'input',
        templateOptions: {
          label: 'Team Velocity (Story Points)',
          type: 'Number'
        }
      };

      var sprintDurationField = {
        key: 'sprintDuration',
        className: 'col-xs-6',
        type: 'input',
        templateOptions: {
          label: 'Sprint Duration (Story Points)',
          type: 'Number'
        }
      };

      var numberOfStoryPointsPurchasedField = {
        key: 'numberOfStoryPointsPurchased',
        className: 'col-xs-6',
        type: 'input',
        templateOptions: {
          label: 'Number of story points purchased',
          type: 'Number'
        }
      };

      var includedCalibrationSprintsField = {
        key: 'includedCalibrationSprints',
        className: 'col-xs-6',
        type: 'input',
        templateOptions: {
          label: 'Included calibration sprints',
          type: 'Number'
        }
      };


      var allocatedStoryPointsPerSprintField = {
        key: 'allocatedStoryPointsPerSprint',
        className: 'col-xs-6',
        type: 'input',
        templateOptions: {
          label: 'Allocated story points per sprint',
          type: 'Number'
        }
      };

      function includedProductsFields() {
        var results = [];
        angular.forEach(vm.products, function (eachProduct) {
          var includedProduct = {
            isIncluded: false
          };
          angular.forEach(vm.quote.includedProducts, function (eachIncludedProduct) {
            if (eachIncludedProduct._id === eachProduct._id) {
              includedProduct.isIncluded = true;
            }
          });

          results.push({
            key: 'isIncluded',
            model: includedProduct,
            className: 'col-xs-6',
            type: 'checkbox',
            templateOptions: {
              label: eachProduct.name,
              onChange: (function (event) {
                if (event)
                  vm.quote.includedProducts.push(eachProduct);
                else {
                  angular.forEach(vm.quote.includedProducts, function (eachIncludedProduct) {
                    var i = 0;
                    if (eachProduct._id === eachIncludedProduct._id) {
                      vm.quote.includedProducts.splice(i);
                    }
                    i++;
                  });
                }
                pricedByCustomers();
                pricedByApplications();
                pricedByInternalUsers();
              })
            }
          });
        });
        return results;
      }

      vm.quoteFields = {
        step1: [

          {
            className: 'row',
            fieldGroup: [ quoteDescriptionField, quoteNotesField ]
          },
          {
            className: 'row',
            fieldGroup: [ regionField, customerNameField, accountOwnerField, currencyField ]

          },
          {
            className: 'row',
            fieldGroup: includedProductsFields()
          } ],

        step2: [
          {
            className: 'row',
            fieldGroup: [ supportPlanField, packageOfferField ]

          },
          {
            className: 'row',
            fieldGroup: [ ceoDiscountField, contractTermField ]

          } ],
        step3: [
          {
            className: 'row',
            fieldGroup: [ maxNumberOfCustomersField, growthPercentageField ]
          },
          {
            className: 'row',
            fieldGroup: [ maxNumberOfApplicationsField, yearlyGrowthPercentageApplicationsField ]
          },
          {
            className: 'row',
            fieldGroup: [ maxNumberOfInternalUsersField, yearlyGrowthPercentageInternalUsersField ]
          }
        ]
      };
    }

    vm.nextFromProductsSelection = function () {
      $window.Highcharts.chart('tco', {
        chart: {
          type: 'column'
        },

        title: {
          text: 'TCO Yearly'
        },

        xAxis: {
          categories: getContractYearsDescriptions()
        },

        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Product Cost'
          }
        },

        tooltip: {
          formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
              this.series.name + ': $' + $filter('number')(this.y, 0) + '<br/>' +
              'Total: $' + $filter('number')(this.point.stackTotal, 0);
          }
        },


        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },

        series: getTCOSeries()
      });
    };

    //e.g. ['Year 1', 'Year 2' ...
    function getContractYearsDescriptions() {
      var results = [];
      for (var i = 0; i < vm.contractPeriod.contractTerm; i++) {
        results.push('Year ' + (i + 1).toString());
      }
      return results;
    }

    function getTCOSeries() {
      var results = [];
      for (var i = 0; i < vm.quote.includedProducts.length; i++) {
        var seriesEntry = {};
        var product = vm.quote.includedProducts[ i ];

        seriesEntry.name = product.name;
        seriesEntry.data = [];
        for (var j = 0; j < vm.contractPeriod.contractTerm; j++) {
          var prices = priceOfQuotedItemsForYear(product, j + 1);
          seriesEntry.data.push(prices.price);
        }
        results.push(seriesEntry);
      }
      return results;
    }

    /*
     * returns {price: , discountedPrice} for the relevant term year
     */
    function priceOfQuotedItemsForYear(product, year) {
      var numberOfCustomersInYear = 0;
      var totalPrice = 0;
      var totalDiscountedPrice = 0;

      for (var i = 0; i < year; i++) {
        if (i === 0)
          numberOfCustomersInYear = vm.quote.maxNumberOfCustomers;
        else
          numberOfCustomersInYear = numberOfCustomersInYear + vm.quote.yearlyGrowthPercentage * numberOfCustomersInYear / 100; //compounded growth
      }
      var tieredProductFeatures = identifyProductTier(product, numberOfCustomersInYear).features;

      for (var j = 0; j < vm.quote.quotedItems.length; j++) {
        var eachQuotedItem = vm.quote.quotedItems[ j ];
        if (eachQuotedItem.productName === product.name &&
          eachQuotedItem.included) {
          for (var k = 0; k < tieredProductFeatures.length; k++) {
            var eachTieredFeature = tieredProductFeatures[ k ];
            if (eachQuotedItem.productName === eachTieredFeature.productName &&
              eachQuotedItem.featureName === eachTieredFeature.featureName) {
              totalPrice = totalPrice + vm.priceWithSupport(eachTieredFeature.featurePrice);
              totalDiscountedPrice = totalDiscountedPrice + vm.discountedPrice(eachTieredFeature.featurePrice);
            }
          }
        }
      }
      return {
        price: totalPrice,
        discountedPrice: totalDiscountedPrice
      };
    }

    /*
     sets a flag on the vm.quote object to indicate whether relevant fields for pricing by customers should be displayed or not
     */
    function pricedByCustomers() {
      vm.quote.pricedByCustomers = false;
      angular.forEach(vm.quote.includedProducts, function (eachProduct) {
        if (eachProduct.priceDeterminant === 'registeredUsers')
          vm.quote.pricedByCustomers = true;
      });

    }

    /*
     returns true if one of the  product pricing is determined by the number of registered customers
     */
    function pricedByApplications() {
      vm.quote.pricedByApplications = false;
      angular.forEach(vm.quote.includedProducts, function (eachProduct) {
        if (eachProduct.priceDeterminant === 'numberOfApplications')
          vm.quote.pricedByApplications = true;
      });
    }

    /*
     returns true if one of the  product pricing is determined by the number of internal users e.g. branch users
     */
    function pricedByInternalUsers() {
      vm.quote.pricedByInternalUsers = false;
      angular.forEach(vm.quote.includedProducts, function (eachProduct) {
        if (eachProduct.priceDeterminant === 'numberOfInternalUsers')
          vm.quote.pricedByInternalUsers = true;
      });
    }
  }
})();


