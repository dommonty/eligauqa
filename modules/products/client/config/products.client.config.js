(function () {
  'use strict';

  angular
    .module('products')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'System Administration',
      state: 'products',
      type: 'dropdown',
      position: 8,
      roles: ['admin']
    });


    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List Products',
      state: 'products.list',
      position: 1
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create Product',
      state: 'products.create',
      position: 2,
      roles: ['admin']
    });
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List Business Periods',
      state: 'periods.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create Business Period',
      state: 'periods.create',
      roles: ['user']
    });
    Menus.addSubMenuItem('topbar', 'products', {
      type: 'dropdown',
      title: 'List CEO Discounts',
      state: 'ceodiscounts.list',
      position: 3
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create CEO Discount',
      state: 'ceodiscounts.create',
      position: 4,
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List terms',
      state: 'contractterms.list',
      position: 5,
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create term',
      state: 'contractterms.create',
      position: 6,
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List Currencies',
      state: 'currencies.list',
      position: 7,
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create Currency',
      state: 'currencies.create',
      position: 8,
      roles: ['user']
    });
    
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List Package Offerings',
      state: 'packageofferings.list',
      position: 11
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create Package Offering',
      state: 'packageofferings.create',
      position: 12,
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List Regions',
      state: 'regions.list',
      position: 13
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create Region',
      state: 'regions.create',
      roles: ['user'],
      position: 14
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'List Support Plans',
      state: 'supportplans.list',
      position: 15
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Create Support Plan',
      state: 'supportplans.create',
      position: 16,
      roles: ['user']
    });


  }
})();


