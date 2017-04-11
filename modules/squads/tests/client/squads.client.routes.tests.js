(function () {
  'use strict';

  describe('Squads Route Tests', function () {
    // Initialize global variables
    var $scope,
      SquadsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SquadsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SquadsService = _SquadsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('squads');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/squads');
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
          SquadsController,
          mockSquad;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('squads.view');
          $templateCache.put('modules/squads/client/views/view-squad.client.view.html', '');

          // create mock Squad
          mockSquad = new SquadsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Squad Name'
          });

          //Initialize Controller
          SquadsController = $controller('SquadsController as vm', {
            $scope: $scope,
            squadResolve: mockSquad
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:squadId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.squadResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            squadId: 1
          })).toEqual('/squads/1');
        }));

        it('should attach an Squad to the controller scope', function () {
          expect($scope.vm.squad._id).toBe(mockSquad._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/squads/client/views/view-squad.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SquadsController,
          mockSquad;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('squads.create');
          $templateCache.put('modules/squads/client/views/form-squad.client.view.html', '');

          // create mock Squad
          mockSquad = new SquadsService();

          //Initialize Controller
          SquadsController = $controller('SquadsController as vm', {
            $scope: $scope,
            squadResolve: mockSquad
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.squadResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/squads/create');
        }));

        it('should attach an Squad to the controller scope', function () {
          expect($scope.vm.squad._id).toBe(mockSquad._id);
          expect($scope.vm.squad._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/squads/client/views/form-squad.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SquadsController,
          mockSquad;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('squads.edit');
          $templateCache.put('modules/squads/client/views/form-squad.client.view.html', '');

          // create mock Squad
          mockSquad = new SquadsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Squad Name'
          });

          //Initialize Controller
          SquadsController = $controller('SquadsController as vm', {
            $scope: $scope,
            squadResolve: mockSquad
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:squadId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.squadResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            squadId: 1
          })).toEqual('/squads/1/edit');
        }));

        it('should attach an Squad to the controller scope', function () {
          expect($scope.vm.squad._id).toBe(mockSquad._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/squads/client/views/form-squad.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
