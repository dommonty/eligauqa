// (function () {
//   'use strict';
//
//   angular
//     .module('riskactions')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Riskactions',
//       state: 'riskactions',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'riskactions', {
//       title: 'List Riskactions',
//       state: 'riskactions.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'riskactions', {
//       title: 'Create Riskaction',
//       state: 'riskactions.create',
//       roles: ['user']
//     });
//   }
// })();
