// (function () {
//   'use strict';
//
//   angular
//     .module('periods')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Periods',
//       state: 'periods',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'periods', {
//       title: 'List Periods',
//       state: 'periods.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'periods', {
//       title: 'Create Period',
//       state: 'periods.create',
//       roles: ['user']
//     });
//   }
// })();
