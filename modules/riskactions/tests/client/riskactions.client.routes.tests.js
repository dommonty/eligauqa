(function () {
  'use strict';

  describe('Riskactions Route Tests', function () {
    // Initialize global variables
    var $scope,
      RiskactionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RiskactionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RiskactionsService = _RiskactionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('riskactions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/riskactions');
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
          RiskactionsController,
          mockRiskaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('riskactions.view');
          $templateCache.put('modules/riskactions/client/views/view-riskaction.client.view.html', '');

          // create mock Riskaction
          mockRiskaction = new RiskactionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Riskaction Name'
          });

          //Initialize Controller
          RiskactionsController = $controller('RiskactionsController as vm', {
            $scope: $scope,
            riskactionResolve: mockRiskaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:riskactionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.riskactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            riskactionId: 1
          })).toEqual('/riskactions/1');
        }));

        it('should attach an Riskaction to the controller scope', function () {
          expect($scope.vm.riskaction._id).toBe(mockRiskaction._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/riskactions/client/views/view-riskaction.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RiskactionsController,
          mockRiskaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('riskactions.create');
          $templateCache.put('modules/riskactions/client/views/form-riskaction.client.view.html', '');

          // create mock Riskaction
          mockRiskaction = new RiskactionsService();

          //Initialize Controller
          RiskactionsController = $controller('RiskactionsController as vm', {
            $scope: $scope,
            riskactionResolve: mockRiskaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.riskactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/riskactions/create');
        }));

        it('should attach an Riskaction to the controller scope', function () {
          expect($scope.vm.riskaction._id).toBe(mockRiskaction._id);
          expect($scope.vm.riskaction._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/riskactions/client/views/form-riskaction.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RiskactionsController,
          mockRiskaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('riskactions.edit');
          $templateCache.put('modules/riskactions/client/views/form-riskaction.client.view.html', '');

          // create mock Riskaction
          mockRiskaction = new RiskactionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Riskaction Name'
          });

          //Initialize Controller
          RiskactionsController = $controller('RiskactionsController as vm', {
            $scope: $scope,
            riskactionResolve: mockRiskaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:riskactionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.riskactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            riskactionId: 1
          })).toEqual('/riskactions/1/edit');
        }));

        it('should attach an Riskaction to the controller scope', function () {
          expect($scope.vm.riskaction._id).toBe(mockRiskaction._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/riskactions/client/views/form-riskaction.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
