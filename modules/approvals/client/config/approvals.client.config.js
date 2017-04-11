// (function () {
//   'use strict';
//
//   angular
//     .module('approvals')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Approvals',
//       state: 'approvals',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'approvals', {
//       title: 'List Approvals',
//       state: 'approvals.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'approvals', {
//       title: 'Create Approval',
//       state: 'approvals.create',
//       roles: ['user']
//     });
//   }
// })();
