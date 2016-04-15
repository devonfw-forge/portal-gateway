/*global config*/
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var middleware = require('./proxy');
var _ = require('lodash');
var gulpsync = require('gulp-sync')(gulp);

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;
  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    port: 9000,
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: {
        '/bower_components': 'bower_components',
        '/system.config.js': 'system.config.js',
        '/jspm_packages': 'jspm_packages'
      }
    },
    browser: browser,
    ghostMode: false,
    online: false
  });
}

gulp.task('serve', gulpsync.sync(['build', 'watch']), function () {
  browserSyncInit([
    '.',
    config.paths.tmp,
    config.paths.src,
    'bower_components/adamas', // fonts
    'bower_components/adamas/basis' // i18n
  ], _.flatten([
    config.paths.tmp + '/**'
  ]));
});

gulp.task('serve:dist', ['build:dist'], function () {
  browserSyncInit('dist');
});
