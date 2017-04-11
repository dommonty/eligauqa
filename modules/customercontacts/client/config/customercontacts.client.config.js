// (function () {
//   'use strict';
//
//   angular
//     .module('customercontacts')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Customercontacts',
//       state: 'customercontacts',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'customercontacts', {
//       title: 'List Customercontacts',
//       state: 'customercontacts.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'customercontacts', {
//       title: 'Create Customercontact',
//       state: 'customercontacts.create',
//       roles: ['user']
//     });
//   }
// })();
