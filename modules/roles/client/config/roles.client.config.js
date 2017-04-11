// (function () {
//   'use strict';
//
//   angular
//     .module('roles')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Roles',
//       state: 'roles',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'roles', {
//       title: 'List Roles',
//       state: 'roles.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'roles', {
//       title: 'Create Role',
//       state: 'roles.create',
//       roles: ['user']
//     });
//   }
// })();
