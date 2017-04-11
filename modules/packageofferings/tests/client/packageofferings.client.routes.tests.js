(function () {
  'use strict';

  describe('Packageofferings Route Tests', function () {
    // Initialize global variables
    var $scope,
      PackageofferingsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PackageofferingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PackageofferingsService = _PackageofferingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('packageofferings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/packageofferings');
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
          PackageofferingsController,
          mockPackageoffering;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('packageofferings.view');
          $templateCache.put('modules/packageofferings/client/views/view-packageoffering.client.view.html', '');

          // create mock Packageoffering
          mockPackageoffering = new PackageofferingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Packageoffering Name'
          });

          //Initialize Controller
          PackageofferingsController = $controller('PackageofferingsController as vm', {
            $scope: $scope,
            packageofferingResolve: mockPackageoffering
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:packageofferingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.packageofferingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            packageofferingId: 1
          })).toEqual('/packageofferings/1');
        }));

        it('should attach an Packageoffering to the controller scope', function () {
          expect($scope.vm.packageoffering._id).toBe(mockPackageoffering._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/packageofferings/client/views/view-packageoffering.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PackageofferingsController,
          mockPackageoffering;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('packageofferings.create');
          $templateCache.put('modules/packageofferings/client/views/form-packageoffering.client.view.html', '');

          // create mock Packageoffering
          mockPackageoffering = new PackageofferingsService();

          //Initialize Controller
          PackageofferingsController = $controller('PackageofferingsController as vm', {
            $scope: $scope,
            packageofferingResolve: mockPackageoffering
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.packageofferingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/packageofferings/create');
        }));

        it('should attach an Packageoffering to the controller scope', function () {
          expect($scope.vm.packageoffering._id).toBe(mockPackageoffering._id);
          expect($scope.vm.packageoffering._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/packageofferings/client/views/form-packageoffering.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PackageofferingsController,
          mockPackageoffering;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('packageofferings.edit');
          $templateCache.put('modules/packageofferings/client/views/form-packageoffering.client.view.html', '');

          // create mock Packageoffering
          mockPackageoffering = new PackageofferingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Packageoffering Name'
          });

          //Initialize Controller
          PackageofferingsController = $controller('PackageofferingsController as vm', {
            $scope: $scope,
            packageofferingResolve: mockPackageoffering
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:packageofferingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.packageofferingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            packageofferingId: 1
          })).toEqual('/packageofferings/1/edit');
        }));

        it('should attach an Packageoffering to the controller scope', function () {
          expect($scope.vm.packageoffering._id).toBe(mockPackageoffering._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/packageofferings/client/views/form-packageoffering.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
