/*global config, isBuildForProd*/
'use strict';
var gulp = require('gulp');

gulp.task('i18n', ['i18n-app', 'i18n-bower-modules']);

gulp.task('i18n-app', function (done) {
  if (isBuildForProd()) {
    return gulp.src(config.i18n.src(), {base: config.paths.src})
      .pipe(gulp.dest(config.output()));
  } else {
    done();
  }
});

gulp.task('i18n-bower-modules', function () {
  if (isBuildForProd()) {
    return gulp.src($.mainBowerFiles())
      .pipe($.filter('**/*labels*.json'))
      .pipe($.flatten())
      .pipe(gulp.dest(config.output() + '/i18n/'));
  }
});
