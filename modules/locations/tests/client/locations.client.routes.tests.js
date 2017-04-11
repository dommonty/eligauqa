(function () {
  'use strict';

  describe('Locations Route Tests', function () {
    // Initialize global variables
    var $scope,
      LocationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LocationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LocationsService = _LocationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('locations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/locations');
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
          LocationsController,
          mockLocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('locations.view');
          $templateCache.put('modules/locations/client/views/view-location.client.view.html', '');

          // create mock Location
          mockLocation = new LocationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Location Name'
          });

          //Initialize Controller
          LocationsController = $controller('LocationsController as vm', {
            $scope: $scope,
            locationResolve: mockLocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:locationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.locationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            locationId: 1
          })).toEqual('/locations/1');
        }));

        it('should attach an Location to the controller scope', function () {
          expect($scope.vm.location._id).toBe(mockLocation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/locations/client/views/view-location.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LocationsController,
          mockLocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('locations.create');
          $templateCache.put('modules/locations/client/views/form-location.client.view.html', '');

          // create mock Location
          mockLocation = new LocationsService();

          //Initialize Controller
          LocationsController = $controller('LocationsController as vm', {
            $scope: $scope,
            locationResolve: mockLocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.locationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/locations/create');
        }));

        it('should attach an Location to the controller scope', function () {
          expect($scope.vm.location._id).toBe(mockLocation._id);
          expect($scope.vm.location._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/locations/client/views/form-location.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LocationsController,
          mockLocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('locations.edit');
          $templateCache.put('modules/locations/client/views/form-location.client.view.html', '');

          // create mock Location
          mockLocation = new LocationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Location Name'
          });

          //Initialize Controller
          LocationsController = $controller('LocationsController as vm', {
            $scope: $scope,
            locationResolve: mockLocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:locationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.locationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            locationId: 1
          })).toEqual('/locations/1/edit');
        }));

        it('should attach an Location to the controller scope', function () {
          expect($scope.vm.location._id).toBe(mockLocation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/locations/client/views/form-location.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
