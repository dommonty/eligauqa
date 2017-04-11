(function () {
  'use strict';

  describe('Squadallocations Route Tests', function () {
    // Initialize global variables
    var $scope,
      SquadallocationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SquadallocationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SquadallocationsService = _SquadallocationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('squadallocations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/squadallocations');
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
          SquadallocationsController,
          mockSquadallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('squadallocations.view');
          $templateCache.put('modules/squadallocations/client/views/view-squadallocation.client.view.html', '');

          // create mock Squadallocation
          mockSquadallocation = new SquadallocationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Squadallocation Name'
          });

          //Initialize Controller
          SquadallocationsController = $controller('SquadallocationsController as vm', {
            $scope: $scope,
            squadallocationResolve: mockSquadallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:squadallocationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.squadallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            squadallocationId: 1
          })).toEqual('/squadallocations/1');
        }));

        it('should attach an Squadallocation to the controller scope', function () {
          expect($scope.vm.squadallocation._id).toBe(mockSquadallocation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/squadallocations/client/views/view-squadallocation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SquadallocationsController,
          mockSquadallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('squadallocations.create');
          $templateCache.put('modules/squadallocations/client/views/form-squadallocation.client.view.html', '');

          // create mock Squadallocation
          mockSquadallocation = new SquadallocationsService();

          //Initialize Controller
          SquadallocationsController = $controller('SquadallocationsController as vm', {
            $scope: $scope,
            squadallocationResolve: mockSquadallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.squadallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/squadallocations/create');
        }));

        it('should attach an Squadallocation to the controller scope', function () {
          expect($scope.vm.squadallocation._id).toBe(mockSquadallocation._id);
          expect($scope.vm.squadallocation._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/squadallocations/client/views/form-squadallocation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SquadallocationsController,
          mockSquadallocation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('squadallocations.edit');
          $templateCache.put('modules/squadallocations/client/views/form-squadallocation.client.view.html', '');

          // create mock Squadallocation
          mockSquadallocation = new SquadallocationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Squadallocation Name'
          });

          //Initialize Controller
          SquadallocationsController = $controller('SquadallocationsController as vm', {
            $scope: $scope,
            squadallocationResolve: mockSquadallocation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:squadallocationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.squadallocationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            squadallocationId: 1
          })).toEqual('/squadallocations/1/edit');
        }));

        it('should attach an Squadallocation to the controller scope', function () {
          expect($scope.vm.squadallocation._id).toBe(mockSquadallocation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/squadallocations/client/views/form-squadallocation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
