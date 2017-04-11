(function () {
  'use strict';

  describe('Supportplans Route Tests', function () {
    // Initialize global variables
    var $scope,
      SupportplansService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SupportplansService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SupportplansService = _SupportplansService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('supportplans');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/supportplans');
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
          SupportplansController,
          mockSupportplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('supportplans.view');
          $templateCache.put('modules/supportplans/client/views/view-supportplan.client.view.html', '');

          // create mock Supportplan
          mockSupportplan = new SupportplansService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Supportplan Name'
          });

          //Initialize Controller
          SupportplansController = $controller('SupportplansController as vm', {
            $scope: $scope,
            supportplanResolve: mockSupportplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:supportplanId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.supportplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            supportplanId: 1
          })).toEqual('/supportplans/1');
        }));

        it('should attach an Supportplan to the controller scope', function () {
          expect($scope.vm.supportplan._id).toBe(mockSupportplan._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/supportplans/client/views/view-supportplan.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SupportplansController,
          mockSupportplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('supportplans.create');
          $templateCache.put('modules/supportplans/client/views/form-supportplan.client.view.html', '');

          // create mock Supportplan
          mockSupportplan = new SupportplansService();

          //Initialize Controller
          SupportplansController = $controller('SupportplansController as vm', {
            $scope: $scope,
            supportplanResolve: mockSupportplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.supportplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/supportplans/create');
        }));

        it('should attach an Supportplan to the controller scope', function () {
          expect($scope.vm.supportplan._id).toBe(mockSupportplan._id);
          expect($scope.vm.supportplan._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/supportplans/client/views/form-supportplan.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SupportplansController,
          mockSupportplan;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('supportplans.edit');
          $templateCache.put('modules/supportplans/client/views/form-supportplan.client.view.html', '');

          // create mock Supportplan
          mockSupportplan = new SupportplansService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Supportplan Name'
          });

          //Initialize Controller
          SupportplansController = $controller('SupportplansController as vm', {
            $scope: $scope,
            supportplanResolve: mockSupportplan
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:supportplanId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.supportplanResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            supportplanId: 1
          })).toEqual('/supportplans/1/edit');
        }));

        it('should attach an Supportplan to the controller scope', function () {
          expect($scope.vm.supportplan._id).toBe(mockSupportplan._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/supportplans/client/views/form-supportplan.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
