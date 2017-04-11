// (function () {
//   'use strict';
//
//   angular
//     .module('squadoutcomes')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Squadoutcomes',
//       state: 'squadoutcomes',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'squadoutcomes', {
//       title: 'List Squadoutcomes',
//       state: 'squadoutcomes.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'squadoutcomes', {
//       title: 'Create Squadoutcome',
//       state: 'squadoutcomes.create',
//       roles: ['user']
//     });
//   }
// })();
