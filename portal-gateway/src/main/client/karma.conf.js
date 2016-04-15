// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-06-09 using
// generator-karma 0.8.2

module.exports = function (config) {
  'use strict';
  //merge libraries configured by bower, application sources, and specs
  var _ = require('lodash');

  var pathsConf = require('./gulp/lib/config-factory.js')(require('./config.json'));

  var karmaDefaultConfig = {
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '.',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['systemjs', 'jasmine'],

    // list of files / patterns to load in the browser
    files: pathsConf.scripts.testSrc(),

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 7890,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-systemjs',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // coverage reporter generates the coverage
    reporters: ['progress'],

    systemjs: {
      configFile: 'system.config.js',
      config: {
        paths: {
          'angular': 'bower:angular/angular.js',
          'tmp/*': '/base/.tmp/*',
          'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
          'systemjs': 'node_modules/systemjs/dist/system.js',
          'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
          'phantomjs-polyfill': 'node_modules/phantomjs-polyfill/bind-polyfill.js',
          "typescript": "node_modules/typescript/lib/typescript.js"
        },
        meta: {
          'bower:angular/angular.js': {
            format: 'global'
          }
        }
      },

      serveFiles: [
        'bower_components/**/*', pathsConf.paths.src + '/**/*', pathsConf.paths.tmp + '/**/*'
      ]
    }
  };
  config.set(karmaDefaultConfig);
};
