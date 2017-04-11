(function () {
  'use strict';

  angular
    .module('costs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Accounting',
      state: 'costs',
      type: 'dropdown',
      position: 5,
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'costs', {
      title: 'List Costs',
      state: 'costs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'costs', {
      title: 'Create Cost',
      state: 'costs.create',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'costs', {
      title: 'Import Cost Actuals',
      state: 'costs.import',
      roles: ['user']
    });
  }
})();
