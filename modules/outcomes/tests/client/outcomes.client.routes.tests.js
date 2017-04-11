(function () {
  'use strict';

  describe('Outcomes Route Tests', function () {
    // Initialize global variables
    var $scope,
      OutcomesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OutcomesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OutcomesService = _OutcomesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('outcomes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/outcomes');
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
          OutcomesController,
          mockOutcome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('outcomes.view');
          $templateCache.put('modules/outcomes/client/views/view-outcome.client.view.html', '');

          // create mock Outcome
          mockOutcome = new OutcomesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Outcome Name'
          });

          //Initialize Controller
          OutcomesController = $controller('OutcomesController as vm', {
            $scope: $scope,
            outcomeResolve: mockOutcome
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:outcomeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.outcomeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            outcomeId: 1
          })).toEqual('/outcomes/1');
        }));

        it('should attach an Outcome to the controller scope', function () {
          expect($scope.vm.outcome._id).toBe(mockOutcome._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/outcomes/client/views/view-outcome.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OutcomesController,
          mockOutcome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('outcomes.create');
          $templateCache.put('modules/outcomes/client/views/form-outcome.client.view.html', '');

          // create mock Outcome
          mockOutcome = new OutcomesService();

          //Initialize Controller
          OutcomesController = $controller('OutcomesController as vm', {
            $scope: $scope,
            outcomeResolve: mockOutcome
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.outcomeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/outcomes/create');
        }));

        it('should attach an Outcome to the controller scope', function () {
          expect($scope.vm.outcome._id).toBe(mockOutcome._id);
          expect($scope.vm.outcome._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/outcomes/client/views/form-outcome.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OutcomesController,
          mockOutcome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('outcomes.edit');
          $templateCache.put('modules/outcomes/client/views/form-outcome.client.view.html', '');

          // create mock Outcome
          mockOutcome = new OutcomesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Outcome Name'
          });

          //Initialize Controller
          OutcomesController = $controller('OutcomesController as vm', {
            $scope: $scope,
            outcomeResolve: mockOutcome
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:outcomeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.outcomeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            outcomeId: 1
          })).toEqual('/outcomes/1/edit');
        }));

        it('should attach an Outcome to the controller scope', function () {
          expect($scope.vm.outcome._id).toBe(mockOutcome._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/outcomes/client/views/form-outcome.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
