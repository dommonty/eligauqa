// (function () {
//   'use strict';
//
//   angular
//     .module('regions')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Regions',
//       state: 'regions',
//       type: 'dropdown',
//       position: 8,
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'regions', {
//       title: 'List Regions',
//       state: 'regions.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'regions', {
//       title: 'Create Region',
//       state: 'regions.create',
//       roles: ['user']
//     });
//   }
// })();
