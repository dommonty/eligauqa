(function () {
  'use strict';

  describe('Regions Route Tests', function () {
    // Initialize global variables
    var $scope,
      RegionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RegionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RegionsService = _RegionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('regions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/regions');
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
          RegionsController,
          mockRegion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('regions.view');
          $templateCache.put('modules/regions/client/views/view-region.client.view.html', '');

          // create mock Region
          mockRegion = new RegionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Region Name'
          });

          //Initialize Controller
          RegionsController = $controller('RegionsController as vm', {
            $scope: $scope,
            regionResolve: mockRegion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:regionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.regionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            regionId: 1
          })).toEqual('/regions/1');
        }));

        it('should attach an Region to the controller scope', function () {
          expect($scope.vm.region._id).toBe(mockRegion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/regions/client/views/view-region.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RegionsController,
          mockRegion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('regions.create');
          $templateCache.put('modules/regions/client/views/form-region.client.view.html', '');

          // create mock Region
          mockRegion = new RegionsService();

          //Initialize Controller
          RegionsController = $controller('RegionsController as vm', {
            $scope: $scope,
            regionResolve: mockRegion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.regionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/regions/create');
        }));

        it('should attach an Region to the controller scope', function () {
          expect($scope.vm.region._id).toBe(mockRegion._id);
          expect($scope.vm.region._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/regions/client/views/form-region.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RegionsController,
          mockRegion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('regions.edit');
          $templateCache.put('modules/regions/client/views/form-region.client.view.html', '');

          // create mock Region
          mockRegion = new RegionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Region Name'
          });

          //Initialize Controller
          RegionsController = $controller('RegionsController as vm', {
            $scope: $scope,
            regionResolve: mockRegion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:regionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.regionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            regionId: 1
          })).toEqual('/regions/1/edit');
        }));

        it('should attach an Region to the controller scope', function () {
          expect($scope.vm.region._id).toBe(mockRegion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/regions/client/views/form-region.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
