// (function () {
//   'use strict';
//
//   angular
//     .module('opportunityactions')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Opportunityactions',
//       state: 'opportunityactions',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'opportunityactions', {
//       title: 'List Opportunityactions',
//       state: 'opportunityactions.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'opportunityactions', {
//       title: 'Create Opportunityaction',
//       state: 'opportunityactions.create',
//       roles: ['user']
//     });
//   }
// })();
