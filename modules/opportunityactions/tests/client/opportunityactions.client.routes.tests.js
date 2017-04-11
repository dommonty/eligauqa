(function () {
  'use strict';

  describe('Opportunityactions Route Tests', function () {
    // Initialize global variables
    var $scope,
      OpportunityactionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OpportunityactionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OpportunityactionsService = _OpportunityactionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('opportunityactions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/opportunityactions');
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
          OpportunityactionsController,
          mockOpportunityaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('opportunityactions.view');
          $templateCache.put('modules/opportunityactions/client/views/view-opportunityaction.client.view.html', '');

          // create mock Opportunityaction
          mockOpportunityaction = new OpportunityactionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Opportunityaction Name'
          });

          //Initialize Controller
          OpportunityactionsController = $controller('OpportunityactionsController as vm', {
            $scope: $scope,
            opportunityactionResolve: mockOpportunityaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:opportunityactionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.opportunityactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            opportunityactionId: 1
          })).toEqual('/opportunityactions/1');
        }));

        it('should attach an Opportunityaction to the controller scope', function () {
          expect($scope.vm.opportunityaction._id).toBe(mockOpportunityaction._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/opportunityactions/client/views/view-opportunityaction.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OpportunityactionsController,
          mockOpportunityaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('opportunityactions.create');
          $templateCache.put('modules/opportunityactions/client/views/form-opportunityaction.client.view.html', '');

          // create mock Opportunityaction
          mockOpportunityaction = new OpportunityactionsService();

          //Initialize Controller
          OpportunityactionsController = $controller('OpportunityactionsController as vm', {
            $scope: $scope,
            opportunityactionResolve: mockOpportunityaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.opportunityactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/opportunityactions/create');
        }));

        it('should attach an Opportunityaction to the controller scope', function () {
          expect($scope.vm.opportunityaction._id).toBe(mockOpportunityaction._id);
          expect($scope.vm.opportunityaction._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/opportunityactions/client/views/form-opportunityaction.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OpportunityactionsController,
          mockOpportunityaction;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('opportunityactions.edit');
          $templateCache.put('modules/opportunityactions/client/views/form-opportunityaction.client.view.html', '');

          // create mock Opportunityaction
          mockOpportunityaction = new OpportunityactionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Opportunityaction Name'
          });

          //Initialize Controller
          OpportunityactionsController = $controller('OpportunityactionsController as vm', {
            $scope: $scope,
            opportunityactionResolve: mockOpportunityaction
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:opportunityactionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.opportunityactionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            opportunityactionId: 1
          })).toEqual('/opportunityactions/1/edit');
        }));

        it('should attach an Opportunityaction to the controller scope', function () {
          expect($scope.vm.opportunityaction._id).toBe(mockOpportunityaction._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/opportunityactions/client/views/form-opportunityaction.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
