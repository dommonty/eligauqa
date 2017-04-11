(function () {
  'use strict';

  describe('Approvals Route Tests', function () {
    // Initialize global variables
    var $scope,
      ApprovalsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ApprovalsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ApprovalsService = _ApprovalsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('approvals');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/approvals');
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
          ApprovalsController,
          mockApproval;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('approvals.view');
          $templateCache.put('modules/approvals/client/views/view-approval.client.view.html', '');

          // create mock Approval
          mockApproval = new ApprovalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Approval Name'
          });

          //Initialize Controller
          ApprovalsController = $controller('ApprovalsController as vm', {
            $scope: $scope,
            approvalResolve: mockApproval
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:approvalId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.approvalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            approvalId: 1
          })).toEqual('/approvals/1');
        }));

        it('should attach an Approval to the controller scope', function () {
          expect($scope.vm.approval._id).toBe(mockApproval._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/approvals/client/views/view-approval.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ApprovalsController,
          mockApproval;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('approvals.create');
          $templateCache.put('modules/approvals/client/views/form-approval.client.view.html', '');

          // create mock Approval
          mockApproval = new ApprovalsService();

          //Initialize Controller
          ApprovalsController = $controller('ApprovalsController as vm', {
            $scope: $scope,
            approvalResolve: mockApproval
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.approvalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/approvals/create');
        }));

        it('should attach an Approval to the controller scope', function () {
          expect($scope.vm.approval._id).toBe(mockApproval._id);
          expect($scope.vm.approval._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/approvals/client/views/form-approval.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ApprovalsController,
          mockApproval;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('approvals.edit');
          $templateCache.put('modules/approvals/client/views/form-approval.client.view.html', '');

          // create mock Approval
          mockApproval = new ApprovalsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Approval Name'
          });

          //Initialize Controller
          ApprovalsController = $controller('ApprovalsController as vm', {
            $scope: $scope,
            approvalResolve: mockApproval
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:approvalId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.approvalResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            approvalId: 1
          })).toEqual('/approvals/1/edit');
        }));

        it('should attach an Approval to the controller scope', function () {
          expect($scope.vm.approval._id).toBe(mockApproval._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/approvals/client/views/form-approval.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
