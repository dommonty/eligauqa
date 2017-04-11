(function () {
  'use strict';

  describe('Outcometeams Route Tests', function () {
    // Initialize global variables
    var $scope,
      OutcometeamsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OutcometeamsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OutcometeamsService = _OutcometeamsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('outcometeams');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/outcometeams');
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
          OutcometeamsController,
          mockOutcometeam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('outcometeams.view');
          $templateCache.put('modules/outcometeams/client/views/view-outcometeam.client.view.html', '');

          // create mock Outcometeam
          mockOutcometeam = new OutcometeamsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Outcometeam Name'
          });

          //Initialize Controller
          OutcometeamsController = $controller('OutcometeamsController as vm', {
            $scope: $scope,
            outcometeamResolve: mockOutcometeam
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:outcometeamId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.outcometeamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            outcometeamId: 1
          })).toEqual('/outcometeams/1');
        }));

        it('should attach an Outcometeam to the controller scope', function () {
          expect($scope.vm.outcometeam._id).toBe(mockOutcometeam._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/outcometeams/client/views/view-outcometeam.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OutcometeamsController,
          mockOutcometeam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('outcometeams.create');
          $templateCache.put('modules/outcometeams/client/views/form-outcometeam.client.view.html', '');

          // create mock Outcometeam
          mockOutcometeam = new OutcometeamsService();

          //Initialize Controller
          OutcometeamsController = $controller('OutcometeamsController as vm', {
            $scope: $scope,
            outcometeamResolve: mockOutcometeam
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.outcometeamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/outcometeams/create');
        }));

        it('should attach an Outcometeam to the controller scope', function () {
          expect($scope.vm.outcometeam._id).toBe(mockOutcometeam._id);
          expect($scope.vm.outcometeam._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/outcometeams/client/views/form-outcometeam.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OutcometeamsController,
          mockOutcometeam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('outcometeams.edit');
          $templateCache.put('modules/outcometeams/client/views/form-outcometeam.client.view.html', '');

          // create mock Outcometeam
          mockOutcometeam = new OutcometeamsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Outcometeam Name'
          });

          //Initialize Controller
          OutcometeamsController = $controller('OutcometeamsController as vm', {
            $scope: $scope,
            outcometeamResolve: mockOutcometeam
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:outcometeamId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.outcometeamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            outcometeamId: 1
          })).toEqual('/outcometeams/1/edit');
        }));

        it('should attach an Outcometeam to the controller scope', function () {
          expect($scope.vm.outcometeam._id).toBe(mockOutcometeam._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/outcometeams/client/views/form-outcometeam.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
