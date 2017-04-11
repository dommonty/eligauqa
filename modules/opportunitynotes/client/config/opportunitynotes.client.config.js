// (function () {
//   'use strict';
//
//   angular
//     .module('opportunitynotes')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Opportunitynotes',
//       state: 'opportunitynotes',
//       type: 'dropdown',
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'opportunitynotes', {
//       title: 'List Opportunitynotes',
//       state: 'opportunitynotes.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'opportunitynotes', {
//       title: 'Create Opportunitynote',
//       state: 'opportunitynotes.create',
//       roles: ['user']
//     });
//   }
// })();
