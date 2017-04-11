(function () {
  'use strict';

  angular
    .module('reviewrequests')
    .run(menuConfig);

  menuConfig.$inject = [ 'Menus', 'Authentication' ];

  function menuConfig(Menus, Authentication) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Outcome reviews',
      state: 'reviewrequests',
      type: 'dropdown',
      position: 7,
      roles: [ 'guest', 'user', 'admin' ]
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'reviewrequests', {
      title: 'List outcome review requests',
      state: 'reviewrequests.list',
      roles: ['admin', 'hradmin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'reviewrequests', {
      title: 'Request new outcome review',
      state: 'reviewrequests.create',
      roles: [ 'user', 'user-restricted' ]
    });

    Menus.addSubMenuItem('topbar', 'reviewrequests', {
      title: 'My outcome reviews',
      state: 'performancereviews.list'
    });

  }
})();
