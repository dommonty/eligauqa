// (function () {
//   'use strict';
//
//   angular
//     .module('quotes')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Quotes',
//       state: 'quotes',
//       type: 'dropdown',
//       position: 1,
//       roles: ['user']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'quotes', {
//       title: 'List Quotes',
//       state: 'quotes.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'quotes', {
//       title: 'Create Quote',
//       state: 'quotes.create',
//       roles: ['user']
//     });
//   }
// })();
