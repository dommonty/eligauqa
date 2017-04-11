// (function () {
//   'use strict';
//
//   angular
//     .module('revenueallocations')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Revenueallocations',
//       state: 'revenueallocations',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'revenueallocations', {
//       title: 'List Revenueallocations',
//       state: 'revenueallocations.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'revenueallocations', {
//       title: 'Create Revenueallocation',
//       state: 'revenueallocations.create',
//       roles: ['user']
//     });
//   }
// })();
