(function () {
  'use strict';

  describe('Opportunitynotes Route Tests', function () {
    // Initialize global variables
    var $scope,
      OpportunitynotesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OpportunitynotesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OpportunitynotesService = _OpportunitynotesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('opportunitynotes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/opportunitynotes');
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
          OpportunitynotesController,
          mockOpportunitynote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('opportunitynotes.view');
          $templateCache.put('modules/opportunitynotes/client/views/view-opportunitynote.client.view.html', '');

          // create mock Opportunitynote
          mockOpportunitynote = new OpportunitynotesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Opportunitynote Name'
          });

          //Initialize Controller
          OpportunitynotesController = $controller('OpportunitynotesController as vm', {
            $scope: $scope,
            opportunitynoteResolve: mockOpportunitynote
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:opportunitynoteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.opportunitynoteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            opportunitynoteId: 1
          })).toEqual('/opportunitynotes/1');
        }));

        it('should attach an Opportunitynote to the controller scope', function () {
          expect($scope.vm.opportunitynote._id).toBe(mockOpportunitynote._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/opportunitynotes/client/views/view-opportunitynote.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OpportunitynotesController,
          mockOpportunitynote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('opportunitynotes.create');
          $templateCache.put('modules/opportunitynotes/client/views/form-opportunitynote.client.view.html', '');

          // create mock Opportunitynote
          mockOpportunitynote = new OpportunitynotesService();

          //Initialize Controller
          OpportunitynotesController = $controller('OpportunitynotesController as vm', {
            $scope: $scope,
            opportunitynoteResolve: mockOpportunitynote
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.opportunitynoteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/opportunitynotes/create');
        }));

        it('should attach an Opportunitynote to the controller scope', function () {
          expect($scope.vm.opportunitynote._id).toBe(mockOpportunitynote._id);
          expect($scope.vm.opportunitynote._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/opportunitynotes/client/views/form-opportunitynote.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OpportunitynotesController,
          mockOpportunitynote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('opportunitynotes.edit');
          $templateCache.put('modules/opportunitynotes/client/views/form-opportunitynote.client.view.html', '');

          // create mock Opportunitynote
          mockOpportunitynote = new OpportunitynotesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Opportunitynote Name'
          });

          //Initialize Controller
          OpportunitynotesController = $controller('OpportunitynotesController as vm', {
            $scope: $scope,
            opportunitynoteResolve: mockOpportunitynote
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:opportunitynoteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.opportunitynoteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            opportunitynoteId: 1
          })).toEqual('/opportunitynotes/1/edit');
        }));

        it('should attach an Opportunitynote to the controller scope', function () {
          expect($scope.vm.opportunitynote._id).toBe(mockOpportunitynote._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/opportunitynotes/client/views/form-opportunitynote.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
