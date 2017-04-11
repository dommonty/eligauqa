// (function () {
//   'use strict';
//
//   angular
//     .module('contractterms')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Contract',
//       state: 'contractterms',
//       type: 'dropdown',
//       position: 2,
//       roles: ['admin']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'contractterms', {
//       title: 'List terms',
//       state: 'contractterms.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'contractterms', {
//       title: 'Create term',
//       state: 'contractterms.create',
//       roles: ['user']
//     });
//   }
// })();
