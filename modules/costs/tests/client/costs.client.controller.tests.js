(function () {
  'use strict';

  describe('Costs Controller Tests', function () {
    // Initialize global variables
    var CostsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CostsService,
      mockCost;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CostsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CostsService = _CostsService_;

      // create mock Cost
      mockCost = new CostsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Cost Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Costs controller.
      CostsController = $controller('CostsController as vm', {
        $scope: $scope,
        costResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCostPostData;

      beforeEach(function () {
        // Create a sample Cost object
        sampleCostPostData = new CostsService({
          name: 'Cost Name'
        });

        $scope.vm.cost = sampleCostPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CostsService) {
        // Set POST response
        $httpBackend.expectPOST('api/costs', sampleCostPostData).respond(mockCost);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Cost was created
        expect($state.go).toHaveBeenCalledWith('costs.view', {
          costId: mockCost._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/costs', sampleCostPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Cost in $scope
        $scope.vm.cost = mockCost;
      });

      it('should update a valid Cost', inject(function (CostsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/costs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('costs.view', {
          costId: mockCost._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CostsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/costs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Costs
        $scope.vm.cost = mockCost;
      });

      it('should delete the Cost and redirect to Costs', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/costs\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('costs.list');
      });

      it('should should not delete the Cost and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
