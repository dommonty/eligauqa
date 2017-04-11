// (function () {
//   'use strict';
//
//   angular
//     .module('packageofferings')
//     .run(menuConfig);
//
//   menuConfig.$inject = ['Menus'];
//
//   function menuConfig(Menus) {
//     // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Package Offerings',
//       state: 'packageofferings',
//       type: 'dropdown',
//       position: 7,
//       roles: ['*']
//     });
//
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'packageofferings', {
//       title: 'List Package Offerings',
//       state: 'packageofferings.list'
//     });
//
//     // Add the dropdown create item
//     Menus.addSubMenuItem('topbar', 'packageofferings', {
//       title: 'Create Package Offering',
//       state: 'packageofferings.create',
//       roles: ['user']
//     });
//   }
// })();
