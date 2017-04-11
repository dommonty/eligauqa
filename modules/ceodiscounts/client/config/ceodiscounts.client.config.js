// (function () {
//   'use strict';
//
//   angular
//     .module('ceodiscounts')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'CEO Discounts',
//       state: 'ceodiscounts',
//       type: 'dropdown',
//       position: 9,
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'ceodiscounts', {
//       title: 'List CEO Discounts',
//       state: 'ceodiscounts.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'ceodiscounts', {
//       title: 'Create CEO Discount',
//       state: 'ceodiscounts.create',
//       roles: ['user']
//     });
//   }
// })();

//See Products module
