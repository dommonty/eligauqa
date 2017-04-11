(function () {
  'use strict';

  angular
    .module('outcometeams')
    .factory('outcometeamsService', outcometeamsService);

  outcometeamsService.$inject = [/*Example: '$state', '$window' */];

  function outcometeamsService(/*Example: $state, $window */) {
    // Getfinancials service logic
    // ...

    // Public API
    return {
      someMethod: function () {
        return true;
      }
    };
  }
})();

//Products service used to communicate Products REST endpoints
(function () {
  'use strict';

  angular.module('products')
    .factory('CatalogueFactory', ['$http', '$locale', CatalogueFactory]);

  function CatalogueFactory($http, $locale){
    var catalogueFactory = {};

    catalogueFactory.getCategories = function(){
      return $http.get('api/categories/'+$locale.id)
        .success(function(data){
          return data;
        });
    };

    catalogueFactory.getProductsByCategory = function(categoryKey){
      return $http.get('api/productsByCategory/'+categoryKey)
        .success(function(data){
          return data;
        });
    };

    return catalogueFactory;
  }
})();
