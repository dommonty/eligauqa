// (function () {
//   'use strict';
//
//   angular
//     .module('squads')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Squads',
//       state: 'squads',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'squads', {
//       title: 'List Squads',
//       state: 'squads.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'squads', {
//       title: 'Create Squad',
//       state: 'squads.create',
//       roles: ['user']
//     });
//   }
// })();
