(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportCustomerRiskController', ReportCustomerRiskController);

  ReportCustomerRiskController.$inject = [ '$scope', 'CustomersService', 'BusinessunitsService', 'RiskactionsService', '$filter' ];

  function ReportCustomerRiskController($scope, CustomersService, BusinessunitsService, RiskactionsService, $filter) {
    var vm = this;


    init();

    function init() {
      vm.businessUnits = BusinessunitsService.query();
    }

    function generateExcelEntries() {
      vm.reportHeader = {
        item: 'Item',
        dateCreated: 'Date Raised',
        customer: 'Customer',
        riskDescription: 'Risk Description',
        riskRating: 'Risk Rating',
        riskOwner: 'Risk Owner',
        mitigationActions: 'Mitigation Actions',
        progressOnActions: 'Progress on Actions',
        status: 'Status'
      };

      vm.risksToExport = [];
      RiskactionsService.query().$promise.then(function (data) {
        var countItems = 1;
        angular.forEach(data, function (eachRisk) {
          CustomersService.get({
            customerId: eachRisk.customer,
            populateForReporting: true,
            businessUnitId: vm.businessUnit._id
          }).$promise.then(function (customer) {
            var newEntry = {};
            countItems++;
            newEntry.item = countItems;
            newEntry.dateCreated = $filter('date')(eachRisk.created, 'shortDate');
            newEntry.customer = customer.name;
            newEntry.riskDescription = eachRisk.description;
            newEntry.riskRating = customer.riskRating;
            newEntry.riskOwner = eachRisk.owner.displayName;
            newEntry.mitigationActions = eachRisk.mitigation;
            newEntry.progressOnActions = eachRisk.progress + '%';
            newEntry.status = eachRisk.status;
            vm.risksToExport.push(newEntry);
          });
        });
      });

    }

    vm.businessUnitChanged = function () {
      vm.reportGenerated = true;
      vm.customersAtRisk = [];
      vm.showSpinner = true;
      CustomersService.query(
        {
          populateForReporting: true,
          businessUnitId: vm.businessUnit._id
        }).$promise.then(function (customers) {
        for (var i = 0; i < customers.length; i++) {
          if (customers[ i ].isAtRisk) {
            vm.customersAtRisk.push(customers[ i ]);
          }
        }
        vm.showSpinner = false;
      });

      generateExcelEntries();
    };

    vm.classForCustomer = function (customer) {
      switch (customer.riskRating) {
        case 'Major':
          return 'label-major';
        case 'Moderate':
          return 'label-moderate';
        case 'Minor' :
          return 'label-minor';
      }
    };
  }
})();
