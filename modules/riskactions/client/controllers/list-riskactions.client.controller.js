(function () {
  'use strict';

  angular
    .module('riskactions')
    .controller('RiskactionsListController', RiskactionsListController);

  RiskactionsListController.$inject = [ 'RiskactionsService', 'customerResolve', '$filter', '$rootScope', '$state' ];

  function RiskactionsListController(RiskactionsService, customer, $filter, $rootScope, $state) {
    var vm = this;

    vm.customer = customer;

    vm.displayedValues = [];
    vm.riskActionMenuCallback = riskActionMenuCallback;

    RiskactionsService.query({customerId: vm.customer._id})
      .$promise.then(function (data) {
      for (var i = 0; i < data.length; i++) {
        var tableEntry = {};
        var eachRisk = data[ i ];

        tableEntry[ 0 ] = eachRisk.name;
        tableEntry[ 1 ] = eachRisk.description;
        tableEntry[ 2 ] = eachRisk.owner.displayName;
        tableEntry[ 3 ] = eachRisk.mitigation;
        tableEntry[ 4 ] = $filter('date')(eachRisk.created, 'mediumDate');
        tableEntry[ 5 ] = $filter('date')(eachRisk.dueBy, 'mediumDate');
        tableEntry[ 6 ] = eachRisk.status;
        tableEntry[ 7 ] = eachRisk.progress + ' %';
        tableEntry._id = eachRisk._id;
        vm.displayedValues.push(tableEntry);
      }
      $rootScope.$broadcast('RefreshSearchTable');
    });


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


    vm.riskActionsTitles = [ 'Risk Name', 'Description', 'Owner', 'Mitigations', 'Date Identified', 'Action Due By', 'Status', 'Progress' ];


    function riskActionMenuCallback(action, tableEntry) {
      if (action === 'View') {
        $state.go('riskactions.view', {
          riskactionId: tableEntry._id,
          customerId: vm.customer._id
        });
      }
      if (action === 'Edit') {
        $state.go('riskactions.edit', {
          riskactionId: tableEntry._id,
          customerId: vm.customer._id
        });
      }
    }
  }
})();
