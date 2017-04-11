(function () {
  'use strict';

  angular
    .module('opportunities')
    .run(menuConfig);

  menuConfig.$inject = [ 'Menus' ];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Customers & Opportunities',
      state: 'opportunities',
      type: 'dropdown',
      position: 1,
      roles: [ 'admin', 'user', 'guest' ]
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'opportunities', {
      title: 'List Opportunities',
      state: 'opportunities.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'opportunities', {
      title: 'Create Opportunity',
      state: 'opportunities.create',
      roles: [ 'user' ]
    });

    Menus.addSubMenuItem('topbar', 'opportunities', {
      title: 'Import Opportunity Actuals',
      state: 'opportunities-import',
      roles: [ 'user' ]
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'opportunities', {
      title: 'List Quotes',
      state: 'quotes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'opportunities', {
      title: 'Create Quote',
      state: 'quotes.create',
      roles: [ 'user' ]
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'opportunities', {
      title: 'List Customers',
      state: 'customers.list',
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'opportunities', {
      title: 'Create Customer',
      state: 'customers.create',
      roles: [ 'user' ],
    });
    Menus.addSubMenuItem('topbar', 'opportunities', {
      title: 'List Products',
      state: 'products.list',
      position: 1
    });
  }
})();
