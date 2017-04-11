(function () {
  'use strict';

  describe('Costallocations Route Tests', function () {
    // Initialize global variables
    var $scope,
      CostallocationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CostallocationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CostallocationsService = _CostallocationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('costallocations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/costallocations');
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
          CostallocationsController,
          mockCostallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('costallocations.view');
          $templateCache.put('modules/costallocations/client/views/view-costallocation.client.view.html', '');

          // create mock Costallocation
          mockCostallocation = new CostallocationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Costallocation Name'
          });

          //Initialize Controller
          CostallocationsController = $controller('CostallocationsController as vm', {
            $scope: $scope,
            costallocationResolve: mockCostallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:costallocationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.costallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            costallocationId: 1
          })).toEqual('/costallocations/1');
        }));

        it('should attach an Costallocation to the controller scope', function () {
          expect($scope.vm.costallocation._id).toBe(mockCostallocation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/costallocations/client/views/view-costallocation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CostallocationsController,
          mockCostallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('costallocations.create');
          $templateCache.put('modules/costallocations/client/views/form-costallocation.client.view.html', '');

          // create mock Costallocation
          mockCostallocation = new CostallocationsService();

          //Initialize Controller
          CostallocationsController = $controller('CostallocationsController as vm', {
            $scope: $scope,
            costallocationResolve: mockCostallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.costallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/costallocations/create');
        }));

        it('should attach an Costallocation to the controller scope', function () {
          expect($scope.vm.costallocation._id).toBe(mockCostallocation._id);
          expect($scope.vm.costallocation._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/costallocations/client/views/form-costallocation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CostallocationsController,
          mockCostallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('costallocations.edit');
          $templateCache.put('modules/costallocations/client/views/form-costallocation.client.view.html', '');

          // create mock Costallocation
          mockCostallocation = new CostallocationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Costallocation Name'
          });

          //Initialize Controller
          CostallocationsController = $controller('CostallocationsController as vm', {
            $scope: $scope,
            costallocationResolve: mockCostallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:costallocationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.costallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            costallocationId: 1
          })).toEqual('/costallocations/1/edit');
        }));

        it('should attach an Costallocation to the controller scope', function () {
          expect($scope.vm.costallocation._id).toBe(mockCostallocation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/costallocations/client/views/form-costallocation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
