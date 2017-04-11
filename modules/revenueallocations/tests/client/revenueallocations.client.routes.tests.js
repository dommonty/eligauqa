(function () {
  'use strict';

  describe('Revenueallocations Route Tests', function () {
    // Initialize global variables
    var $scope,
      RevenueallocationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RevenueallocationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RevenueallocationsService = _RevenueallocationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('revenueallocations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/revenueallocations');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          RevenueallocationsController,
          mockRevenueallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('revenueallocations.view');
          $templateCache.put('modules/revenueallocations/client/views/view-revenueallocation.client.view.html', '');

          // create mock Revenueallocation
          mockRevenueallocation = new RevenueallocationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Revenueallocation Name'
          });

          //Initialize Controller
          RevenueallocationsController = $controller('RevenueallocationsController as vm', {
            $scope: $scope,
            revenueallocationResolve: mockRevenueallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:revenueallocationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.revenueallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            revenueallocationId: 1
          })).toEqual('/revenueallocations/1');
        }));

        it('should attach an Revenueallocation to the controller scope', function () {
          expect($scope.vm.revenueallocation._id).toBe(mockRevenueallocation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/revenueallocations/client/views/view-revenueallocation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RevenueallocationsController,
          mockRevenueallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('revenueallocations.create');
          $templateCache.put('modules/revenueallocations/client/views/form-revenueallocation.client.view.html', '');

          // create mock Revenueallocation
          mockRevenueallocation = new RevenueallocationsService();

          //Initialize Controller
          RevenueallocationsController = $controller('RevenueallocationsController as vm', {
            $scope: $scope,
            revenueallocationResolve: mockRevenueallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.revenueallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/revenueallocations/create');
        }));

        it('should attach an Revenueallocation to the controller scope', function () {
          expect($scope.vm.revenueallocation._id).toBe(mockRevenueallocation._id);
          expect($scope.vm.revenueallocation._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/revenueallocations/client/views/form-revenueallocation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RevenueallocationsController,
          mockRevenueallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('revenueallocations.edit');
          $templateCache.put('modules/revenueallocations/client/views/form-revenueallocation.client.view.html', '');

          // create mock Revenueallocation
          mockRevenueallocation = new RevenueallocationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Revenueallocation Name'
          });

          //Initialize Controller
          RevenueallocationsController = $controller('RevenueallocationsController as vm', {
            $scope: $scope,
            revenueallocationResolve: mockRevenueallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:revenueallocationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.revenueallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            revenueallocationId: 1
          })).toEqual('/revenueallocations/1/edit');
        }));

        it('should attach an Revenueallocation to the controller scope', function () {
          expect($scope.vm.revenueallocation._id).toBe(mockRevenueallocation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/revenueallocations/client/views/form-revenueallocation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
