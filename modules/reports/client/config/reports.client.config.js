(function () {
  'use strict';

  angular
    .module('reports')
    .run(menuConfig);

  menuConfig.$inject = [ 'Menus' ];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Reporting',
      state: 'reports',
      type: 'dropdown',
      position: 2,
      roles: [ 'guest' ]
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Opportunities report',
      state: 'reports.opportunities'
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Costs report',
      state: 'reports.costs',
      roles: [ 'user' ]
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Business Unit One Page Report',
      state: 'reports.business-unit',
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Team Structure Report',
      state: 'reports.team-structure'
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Squads Cost Report',
      state: 'reports.squadCosts',
      roles: [ 'user' ]
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Profit Loss Report',
      state: 'reports-profit-loss',
      roles: [ 'user' ]
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Employee Chart',
      state: 'reports-employee-chart'
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: 'Business Unit Risk Report',
      state: 'reports.customer-risk',
      roles: [ 'user' ]
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: "Customer's Annual Revenue Report",
      state: 'reports.customers-annuity'
    });

    Menus.addSubMenuItem('topbar', 'reports', {
      title: "Projects Report",
      state: 'reports.projects'
    });
    Menus.addSubMenuItem('topbar', 'reports', {
      title: "Outcome Reviews Status Report",
      state: 'reports.reviews'
    });
  }
})();


