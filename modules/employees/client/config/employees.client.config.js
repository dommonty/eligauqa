(function () {
  'use strict';

  angular
    .module('employees')
    .run(menuConfig);

  menuConfig.$inject = [ 'Menus' ];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Teams & Employees',
      state: 'employees',
      position: 3,
      type: 'dropdown',
      roles: [ 'user', 'admin', 'buadmin', 'guest', 'hradmin' ]
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'List Employees',
      state: 'employees.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'Create Employee',
      state: 'employees.create',
      roles: ['hradmin', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'List Roles',
      state: 'roles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'Create Role',
      state: 'roles.create',
      roles: [ 'hradmin', 'admin' ]
    });
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'List Outcome Teams',
      state: 'outcometeams.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'Create Outcome Team',
      state: 'outcometeams.create',
      roles: [ 'hradmin', 'admin' ]
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'List Squads',
      state: 'squads.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'Create Squad',
      state: 'squads.create',
      roles: ['hradmin', 'admin']
    });
  }
})();
