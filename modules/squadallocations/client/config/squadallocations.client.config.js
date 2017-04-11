// (function () {
//   'use strict';
//
//   angular
//     .module('squadallocations')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Squadallocations',
//       state: 'squadallocations',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'squadallocations', {
//       title: 'List Squadallocations',
//       state: 'squadallocations.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'squadallocations', {
//       title: 'Create Squadallocation',
//       state: 'squadallocations.create',
//       roles: ['user']
//     });
//   }
// })();
