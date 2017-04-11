// (function () {
//   'use strict';
//
//   angular
//     .module('outcometeams')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Outcometeams',
//       state: 'outcometeams',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'outcometeams', {
//       title: 'List Outcometeams',
//       state: 'outcometeams.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'outcometeams', {
//       title: 'Create Outcometeam',
//       state: 'outcometeams.create',
//       roles: ['user']
//     });
//   }
// })();
