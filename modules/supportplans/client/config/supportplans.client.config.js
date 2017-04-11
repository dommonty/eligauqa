// (function () {
//   'use strict';
//
//   angular
//     .module('supportplans')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Support Plans',
//       state: 'supportplans',
//       type: 'dropdown',
//       position: 6,
//       roles: ['admin']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'supportplans', {
//       title: 'List Support Plans',
//       state: 'supportplans.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'supportplans', {
//       title: 'Create Support Plan',
//       state: 'supportplans.create',
//       roles: ['user']
//     });
//   }
// })();
