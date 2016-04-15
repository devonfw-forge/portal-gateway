/*global config, isBuildForProd, gulpsync, $*/
'use strict';
var gulp = require('gulp');

gulp.task('indexHtml', gulpsync.sync([
  ['styles', 'scripts', 'img:sprite', 'ngTemplates'],
  'indexHtml:html'
]));

//only build index.html without dependencies
gulp.task('indexHtml:html', function () {
  return gulp.src(config.indexHtml.src())
    .pipe($.processhtml({
      commentMarker: 'process',
      recursive: true,
      environment: isBuildForProd() ? 'prod' : 'dev',
      includeBase: config.paths.src
    }))
    .pipe($.if(isBuildForProd(), $.usemin({
      path: '{' + config.paths.tmp + ',' + config.paths.src + '}',
      css: [$.minifyCss(), $.rev()],
      js: [$.rev()]
    })))
    .pipe(gulp.dest(config.output()))
    .pipe($.size());
});
