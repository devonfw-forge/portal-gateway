/*global config, $*/
'use strict';
var gulp = require('gulp');

gulp.task('ngTemplates', function () {
    return gulp.src(config.ngTemplates.src())
        .pipe($.processhtml({
            commentMarker: 'process',
            recursive: true,
            includeBase: config.paths.src
        }))
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache({
            module: config.ngTemplates.targetModule(),
            filename: config.ngTemplates.target(),
            transformUrl: function (url) {
                return url.replace(/\.tpl\.html$/, '.html');
            }
        }))
        .pipe(gulp.dest(config.paths.tmp));
});
