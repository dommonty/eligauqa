(function () {
  'use strict';

  describe('Customercontacts List Controller Tests', function () {
    // Initialize global variables
    var CustomercontactsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CustomercontactsService,
      mockCustomercontact;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CustomercontactsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CustomercontactsService = _CustomercontactsService_;

      // create mock article
      mockCustomercontact = new CustomercontactsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Customercontact Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Customercontacts List controller.
      CustomercontactsListController = $controller('CustomercontactsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockCustomercontactList;

      beforeEach(function () {
        mockCustomercontactList = [mockCustomercontact, mockCustomercontact];
      });

      it('should send a GET request and return all Customercontacts', inject(function (CustomercontactsService) {
        // Set POST response
        $httpBackend.expectGET('api/customercontacts').respond(mockCustomercontactList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.customercontacts.length).toEqual(2);
        expect($scope.vm.customercontacts[0]).toEqual(mockCustomercontact);
        expect($scope.vm.customercontacts[1]).toEqual(mockCustomercontact);

      }));
    });
  });
})();
