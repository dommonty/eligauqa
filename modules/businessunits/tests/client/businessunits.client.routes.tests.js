(function () {
  'use strict';

  describe('Businessunits Route Tests', function () {
    // Initialize global variables
    var $scope,
      BusinessunitsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BusinessunitsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BusinessunitsService = _BusinessunitsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('businessunits');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/businessunits');
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
          BusinessunitsController,
          mockBusinessunit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('businessunits.view');
          $templateCache.put('modules/businessunits/client/views/view-businessunit.client.view.html', '');

          // create mock Businessunit
          mockBusinessunit = new BusinessunitsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Businessunit Name'
          });

          //Initialize Controller
          BusinessunitsController = $controller('BusinessunitsController as vm', {
            $scope: $scope,
            businessunitResolve: mockBusinessunit
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:businessunitId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.businessunitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            businessunitId: 1
          })).toEqual('/businessunits/1');
        }));

        it('should attach an Businessunit to the controller scope', function () {
          expect($scope.vm.businessunit._id).toBe(mockBusinessunit._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/businessunits/client/views/view-businessunit.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BusinessunitsController,
          mockBusinessunit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('businessunits.create');
          $templateCache.put('modules/businessunits/client/views/form-businessunit.client.view.html', '');

          // create mock Businessunit
          mockBusinessunit = new BusinessunitsService();

          //Initialize Controller
          BusinessunitsController = $controller('BusinessunitsController as vm', {
            $scope: $scope,
            businessunitResolve: mockBusinessunit
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.businessunitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/businessunits/create');
        }));

        it('should attach an Businessunit to the controller scope', function () {
          expect($scope.vm.businessunit._id).toBe(mockBusinessunit._id);
          expect($scope.vm.businessunit._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/businessunits/client/views/form-businessunit.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BusinessunitsController,
          mockBusinessunit;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('businessunits.edit');
          $templateCache.put('modules/businessunits/client/views/form-businessunit.client.view.html', '');

          // create mock Businessunit
          mockBusinessunit = new BusinessunitsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Businessunit Name'
          });

          //Initialize Controller
          BusinessunitsController = $controller('BusinessunitsController as vm', {
            $scope: $scope,
            businessunitResolve: mockBusinessunit
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:businessunitId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.businessunitResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            businessunitId: 1
          })).toEqual('/businessunits/1/edit');
        }));

        it('should attach an Businessunit to the controller scope', function () {
          expect($scope.vm.businessunit._id).toBe(mockBusinessunit._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/businessunits/client/views/form-businessunit.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
