(function () {
  'use strict';

  describe('Quotes Route Tests', function () {
    // Initialize global variables
    var $scope,
      QuotesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QuotesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QuotesService = _QuotesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('quotes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/quotes');
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
          QuotesController,
          mockQuote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('quotes.view');
          $templateCache.put('modules/quotes/client/views/view-quote.client.view.html', '');

          // create mock Quote
          mockQuote = new QuotesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Quote Name'
          });

          //Initialize Controller
          QuotesController = $controller('QuotesController as vm', {
            $scope: $scope,
            quoteResolve: mockQuote
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:quoteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.quoteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            quoteId: 1
          })).toEqual('/quotes/1');
        }));

        it('should attach an Quote to the controller scope', function () {
          expect($scope.vm.quote._id).toBe(mockQuote._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/quotes/client/views/view-quote.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QuotesController,
          mockQuote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('quotes.create');
          $templateCache.put('modules/quotes/client/views/form-quote.client.view.html', '');

          // create mock Quote
          mockQuote = new QuotesService();

          //Initialize Controller
          QuotesController = $controller('QuotesController as vm', {
            $scope: $scope,
            quoteResolve: mockQuote
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.quoteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/quotes/create');
        }));

        it('should attach an Quote to the controller scope', function () {
          expect($scope.vm.quote._id).toBe(mockQuote._id);
          expect($scope.vm.quote._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/quotes/client/views/form-quote.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QuotesController,
          mockQuote;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('quotes.edit');
          $templateCache.put('modules/quotes/client/views/form-quote.client.view.html', '');

          // create mock Quote
          mockQuote = new QuotesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Quote Name'
          });

          //Initialize Controller
          QuotesController = $controller('QuotesController as vm', {
            $scope: $scope,
            quoteResolve: mockQuote
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:quoteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.quoteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            quoteId: 1
          })).toEqual('/quotes/1/edit');
        }));

        it('should attach an Quote to the controller scope', function () {
          expect($scope.vm.quote._id).toBe(mockQuote._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/quotes/client/views/form-quote.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
