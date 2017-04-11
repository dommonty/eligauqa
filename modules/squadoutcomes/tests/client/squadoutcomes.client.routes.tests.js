(function () {
  'use strict';

  describe('Squadoutcomes Route Tests', function () {
    // Initialize global variables
    var $scope,
      SquadoutcomesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SquadoutcomesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SquadoutcomesService = _SquadoutcomesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('squadoutcomes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/squadoutcomes');
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
          SquadoutcomesController,
          mockSquadoutcome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('squadoutcomes.view');
          $templateCache.put('modules/squadoutcomes/client/views/view-squadoutcome.client.view.html', '');

          // create mock Squadoutcome
          mockSquadoutcome = new SquadoutcomesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Squadoutcome Name'
          });

          //Initialize Controller
          SquadoutcomesController = $controller('SquadoutcomesController as vm', {
            $scope: $scope,
            squadoutcomeResolve: mockSquadoutcome
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:squadoutcomeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.squadoutcomeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            squadoutcomeId: 1
          })).toEqual('/squadoutcomes/1');
        }));

        it('should attach an Squadoutcome to the controller scope', function () {
          expect($scope.vm.squadoutcome._id).toBe(mockSquadoutcome._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/squadoutcomes/client/views/view-squadoutcome.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SquadoutcomesController,
          mockSquadoutcome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('squadoutcomes.create');
          $templateCache.put('modules/squadoutcomes/client/views/form-squadoutcome.client.view.html', '');

          // create mock Squadoutcome
          mockSquadoutcome = new SquadoutcomesService();

          //Initialize Controller
          SquadoutcomesController = $controller('SquadoutcomesController as vm', {
            $scope: $scope,
            squadoutcomeResolve: mockSquadoutcome
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.squadoutcomeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/squadoutcomes/create');
        }));

        it('should attach an Squadoutcome to the controller scope', function () {
          expect($scope.vm.squadoutcome._id).toBe(mockSquadoutcome._id);
          expect($scope.vm.squadoutcome._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/squadoutcomes/client/views/form-squadoutcome.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SquadoutcomesController,
          mockSquadoutcome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('squadoutcomes.edit');
          $templateCache.put('modules/squadoutcomes/client/views/form-squadoutcome.client.view.html', '');

          // create mock Squadoutcome
          mockSquadoutcome = new SquadoutcomesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Squadoutcome Name'
          });

          //Initialize Controller
          SquadoutcomesController = $controller('SquadoutcomesController as vm', {
            $scope: $scope,
            squadoutcomeResolve: mockSquadoutcome
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:squadoutcomeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.squadoutcomeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            squadoutcomeId: 1
          })).toEqual('/squadoutcomes/1/edit');
        }));

        it('should attach an Squadoutcome to the controller scope', function () {
          expect($scope.vm.squadoutcome._id).toBe(mockSquadoutcome._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/squadoutcomes/client/views/form-squadoutcome.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
