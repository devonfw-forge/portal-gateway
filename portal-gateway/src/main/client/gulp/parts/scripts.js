/*global config, $*/
'use strict';
var gulp = require('gulp');
var Builder = require('systemjs-builder');
gulp.task('scripts', ['ngTemplates'], function (done) {
  if (isBuildForProd()) {
    var builder = new Builder('./', './system.config.js');
    //output.source;    // generated bundle source
    //output.sourceMap; // generated bundle source map
    //output.modules;   // array of module names defined in the bundle
    builder.buildStatic('app/app.module.ts').then(function (output) {
      $.file('app/app.module.js', output.source)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest(config.paths.tmp))
        .pipe($.callback(done));
    }, function (ex) {
      done(new Error(ex));
    });
  }
  else {
    done();
  }
});
