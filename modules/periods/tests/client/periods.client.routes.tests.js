(function () {
  'use strict';

  describe('Periods Route Tests', function () {
    // Initialize global variables
    var $scope,
      PeriodsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PeriodsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PeriodsService = _PeriodsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('periods');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/periods');
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
          PeriodsController,
          mockPeriod;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('periods.view');
          $templateCache.put('modules/periods/client/views/view-period.client.view.html', '');

          // create mock Period
          mockPeriod = new PeriodsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Period Name'
          });

          //Initialize Controller
          PeriodsController = $controller('PeriodsController as vm', {
            $scope: $scope,
            periodResolve: mockPeriod
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:periodId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.periodResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            periodId: 1
          })).toEqual('/periods/1');
        }));

        it('should attach an Period to the controller scope', function () {
          expect($scope.vm.period._id).toBe(mockPeriod._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/periods/client/views/view-period.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PeriodsController,
          mockPeriod;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('periods.create');
          $templateCache.put('modules/periods/client/views/form-period.client.view.html', '');

          // create mock Period
          mockPeriod = new PeriodsService();

          //Initialize Controller
          PeriodsController = $controller('PeriodsController as vm', {
            $scope: $scope,
            periodResolve: mockPeriod
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.periodResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/periods/create');
        }));

        it('should attach an Period to the controller scope', function () {
          expect($scope.vm.period._id).toBe(mockPeriod._id);
          expect($scope.vm.period._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/periods/client/views/form-period.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PeriodsController,
          mockPeriod;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('periods.edit');
          $templateCache.put('modules/periods/client/views/form-period.client.view.html', '');

          // create mock Period
          mockPeriod = new PeriodsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Period Name'
          });

          //Initialize Controller
          PeriodsController = $controller('PeriodsController as vm', {
            $scope: $scope,
            periodResolve: mockPeriod
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:periodId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.periodResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            periodId: 1
          })).toEqual('/periods/1/edit');
        }));

        it('should attach an Period to the controller scope', function () {
          expect($scope.vm.period._id).toBe(mockPeriod._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/periods/client/views/form-period.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
