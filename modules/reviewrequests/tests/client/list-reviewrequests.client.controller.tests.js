(function () {
  'use strict';

  describe('Reviewrequests List Controller Tests', function () {
    // Initialize global variables
    var ReviewrequestsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ReviewrequestsService,
      mockReviewrequest;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ReviewrequestsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ReviewrequestsService = _ReviewrequestsService_;

      // create mock article
      mockReviewrequest = new ReviewrequestsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Reviewrequest Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Reviewrequests List controller.
      ReviewrequestsListController = $controller('ReviewrequestsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockReviewrequestList;

      beforeEach(function () {
        mockReviewrequestList = [mockReviewrequest, mockReviewrequest];
      });

      it('should send a GET request and return all Reviewrequests', inject(function (ReviewrequestsService) {
        // Set POST response
        $httpBackend.expectGET('api/reviewrequests').respond(mockReviewrequestList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.reviewrequests.length).toEqual(2);
        expect($scope.vm.reviewrequests[0]).toEqual(mockReviewrequest);
        expect($scope.vm.reviewrequests[1]).toEqual(mockReviewrequest);

      }));
    });
  });
})();
