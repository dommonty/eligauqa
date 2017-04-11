(function () {
  'use strict';

  describe('Ceodiscounts Route Tests', function () {
    // Initialize global variables
    var $scope,
      CeodiscountsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CeodiscountsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CeodiscountsService = _CeodiscountsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ceodiscounts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ceodiscounts');
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
          CeodiscountsController,
          mockCeodiscount;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ceodiscounts.view');
          $templateCache.put('modules/ceodiscounts/client/views/view-ceodiscount.client.view.html', '');

          // create mock Ceodiscount
          mockCeodiscount = new CeodiscountsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ceodiscount Name'
          });

          //Initialize Controller
          CeodiscountsController = $controller('CeodiscountsController as vm', {
            $scope: $scope,
            ceodiscountResolve: mockCeodiscount
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:ceodiscountId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.ceodiscountResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            ceodiscountId: 1
          })).toEqual('/ceodiscounts/1');
        }));

        it('should attach an Ceodiscount to the controller scope', function () {
          expect($scope.vm.ceodiscount._id).toBe(mockCeodiscount._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ceodiscounts/client/views/view-ceodiscount.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CeodiscountsController,
          mockCeodiscount;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ceodiscounts.create');
          $templateCache.put('modules/ceodiscounts/client/views/form-ceodiscount.client.view.html', '');

          // create mock Ceodiscount
          mockCeodiscount = new CeodiscountsService();

          //Initialize Controller
          CeodiscountsController = $controller('CeodiscountsController as vm', {
            $scope: $scope,
            ceodiscountResolve: mockCeodiscount
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.ceodiscountResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ceodiscounts/create');
        }));

        it('should attach an Ceodiscount to the controller scope', function () {
          expect($scope.vm.ceodiscount._id).toBe(mockCeodiscount._id);
          expect($scope.vm.ceodiscount._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ceodiscounts/client/views/form-ceodiscount.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CeodiscountsController,
          mockCeodiscount;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ceodiscounts.edit');
          $templateCache.put('modules/ceodiscounts/client/views/form-ceodiscount.client.view.html', '');

          // create mock Ceodiscount
          mockCeodiscount = new CeodiscountsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ceodiscount Name'
          });

          //Initialize Controller
          CeodiscountsController = $controller('CeodiscountsController as vm', {
            $scope: $scope,
            ceodiscountResolve: mockCeodiscount
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:ceodiscountId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.ceodiscountResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            ceodiscountId: 1
          })).toEqual('/ceodiscounts/1/edit');
        }));

        it('should attach an Ceodiscount to the controller scope', function () {
          expect($scope.vm.ceodiscount._id).toBe(mockCeodiscount._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ceodiscounts/client/views/form-ceodiscount.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
