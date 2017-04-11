// (function () {
//   'use strict';
//
//   angular
//     .module('businessunits')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Business Units',
//       state: 'businessunits',
//       type: 'dropdown',
//       roles: ['admin']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'businessunits', {
//       title: 'List Business Units',
//       state: 'businessunits.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'businessunits', {
//       title: 'Create Business Unit',
//       state: 'businessunits.create',
//       roles: ['admin']
//     });
//   }
// })();
