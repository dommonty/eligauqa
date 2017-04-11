// (function () {
//   'use strict';
//
//   angular
//     .module('businessoutcomes')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Businessoutcomes',
//       state: 'businessoutcomes',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'businessoutcomes', {
//       title: 'List Businessoutcomes',
//       state: 'businessoutcomes.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'businessoutcomes', {
//       title: 'Create Businessoutcome',
//       state: 'businessoutcomes.create',
//       roles: ['user']
//     });
//   }
// })();
