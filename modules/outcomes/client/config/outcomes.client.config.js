// (function () {
//   'use strict';
//
//   angular
//     .module('outcomes')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Outcomes',
//       state: 'outcomes',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'outcomes', {
//       title: 'List Outcomes',
//       state: 'outcomes.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'outcomes', {
//       title: 'Create Outcome',
//       state: 'outcomes.create',
//       roles: ['user']
//     });
//   }
// })();
