'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/styles/css/lee.css',
        'public/bankfast-updated/css/bankfastUpdatedAllMin.css',
        // 'public/styles/slim/main.css',
        // 'public/styles/slim/ui.css',
        'public/lib/angular-ui-grid/ui-grid.min.css',
        'public/lib/angular-wizard/dist/angular-wizard.min.css',
        'public/lib/textAngular/dist/textAngular.css',
        'public/lib/angular-timeline/dist/angular-timeline.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-ui-grid/ui-grid.min.js',
        'public/lib/angular-confirm-modal/angular-confirm.min.js',
        'public/lib/api-check/dist/api-check.min.js',
        'public/lib/angular-formly/dist/formly.js',
        'public/lib/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
        'public/lib/angular-wizard/dist/angular-wizard.min.js',
        'public/lib/highcharts/highcharts.js',
        'public/lib/highcharts/highcharts-more.js',
        'public/lib/highcharts/modules/solid-gauge.js',
        'public/lib/highcharts/highcharts-3d.js',
        'public/lib/highcharts/modules/data.js',
        'public/lib/highcharts/modules/drilldown.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/angular-momentjs/angular-momentjs.min.js',
        'public/lib/angular-csv-import/dist/angular-csv-import.js',
        'public/lib/textAngular/dist/textAngular-rangy.min.js',
        'public/lib/textAngular/dist/textAngular-sanitize.js',
        'public/lib/textAngular/dist/textAngularSetup.js',
        'public/lib/textAngular/dist/textAngular.js',
        'public/lib/json-export-excel/dest/json-export-excel.js',
        'public/lib/file-saver/FileSaver.min.js',
        'public/lib/angular-timeline/dist/angular-timeline.js',
        'public/lib/ngstorage/ngStorage.min.js'

      ],
      tests: [ 'public/lib/angular-mocks/angular-mocks.js' ]
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: [ 'modules/*/client/views/**/*.html' ],
    templates: [ 'build/templates.js' ]
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: [ 'server.js', 'config/**/*.js', 'modules/*/server/**/*.js' ],
    models: 'modules/*/server/models/**/*.js',
    routes: [ 'modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js' ],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
