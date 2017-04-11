// (function () {
//   'use strict';
//
//   angular
//     .module('costallocations')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Costallocations',
//       state: 'costallocations',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'costallocations', {
//       title: 'List Costallocations',
//       state: 'costallocations.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'costallocations', {
//       title: 'Create Costallocation',
//       state: 'costallocations.create',
//       roles: ['user']
//     });
//   }
// })();
