(function () {
  'use strict';

  describe('Contractterms Route Tests', function () {
    // Initialize global variables
    var $scope,
      ContracttermsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ContracttermsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ContracttermsService = _ContracttermsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('contractterms');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/contractterms');
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
          ContracttermsController,
          mockContractterm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('contractterms.view');
          $templateCache.put('modules/contractterms/client/views/view-contractterm.client.view.html', '');

          // create mock Contractterm
          mockContractterm = new ContracttermsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contractterm Name'
          });

          //Initialize Controller
          ContracttermsController = $controller('ContracttermsController as vm', {
            $scope: $scope,
            contracttermResolve: mockContractterm
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:contracttermId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.contracttermResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            contracttermId: 1
          })).toEqual('/contractterms/1');
        }));

        it('should attach an Contractterm to the controller scope', function () {
          expect($scope.vm.contractterm._id).toBe(mockContractterm._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/contractterms/client/views/view-contractterm.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ContracttermsController,
          mockContractterm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('contractterms.create');
          $templateCache.put('modules/contractterms/client/views/form-contractterm.client.view.html', '');

          // create mock Contractterm
          mockContractterm = new ContracttermsService();

          //Initialize Controller
          ContracttermsController = $controller('ContracttermsController as vm', {
            $scope: $scope,
            contracttermResolve: mockContractterm
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.contracttermResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/contractterms/create');
        }));

        it('should attach an Contractterm to the controller scope', function () {
          expect($scope.vm.contractterm._id).toBe(mockContractterm._id);
          expect($scope.vm.contractterm._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/contractterms/client/views/form-contractterm.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ContracttermsController,
          mockContractterm;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('contractterms.edit');
          $templateCache.put('modules/contractterms/client/views/form-contractterm.client.view.html', '');

          // create mock Contractterm
          mockContractterm = new ContracttermsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Contractterm Name'
          });

          //Initialize Controller
          ContracttermsController = $controller('ContracttermsController as vm', {
            $scope: $scope,
            contracttermResolve: mockContractterm
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:contracttermId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.contracttermResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            contracttermId: 1
          })).toEqual('/contractterms/1/edit');
        }));

        it('should attach an Contractterm to the controller scope', function () {
          expect($scope.vm.contractterm._id).toBe(mockContractterm._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/contractterms/client/views/form-contractterm.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
