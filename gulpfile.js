'use strict';

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    tsProject = tsc.createProject('tsconfig.json'),
    rimraf = require('gulp-rimraf'),
    Config = require('./gulpfile.config');
    

var config = new Config();

/**
 * Generates the app.d.ts references file dynamically from all application *.ts files.
 */
gulp.task('gen-ts-refs', function () {
    var target = gulp.src(config.appTypeScriptReferences);
    var sources = gulp.src([config.allTypeScript], {read: false});
    return target.pipe(inject(sources, {
        starttag: '//{',
        endtag: '//}',
        transform: function (filepath) {
            return '/// <reference path="../..' + filepath + '" />';
        }
    })).pipe(gulp.dest(config.typings));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
    var sourceTsFiles = [config.allTypeScript,                //path to typescript files
                         config.libraryTypeScriptDefinitions, //reference to library .d.ts files
                         config.appTypeScriptReferences];     //reference to app.d.ts files

    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(sourcemaps.init())
                       .pipe(tsc(tsProject));

        tsResult.dts.pipe(gulp.dest(config.scriptsPath));
        return tsResult.js
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest(config.jsPath));
});

/**
 * Concatinate all the compiled Javascript files in 'compiled-bundle.js' 
 * then minify it under the name 'compiled-bundle.min.js'.
 */
gulp.task('build-js', function() {
  return gulp.src(config.allJavaScript) //path to all javascript files
        .pipe(sourcemaps.init())
        .pipe(concat('compiled-bundle.js'))
        .pipe(gulp.dest(config.jsConcatPath))
        .pipe(rename("compiled-bundle.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.jsConcatPath));
});

gulp.task('watch', function() {
    gulp.watch([config.allTypeScript], ['compile-ts', 'gen-ts-refs','build-js']);
});

gulp.task('default', ['compile-ts', 'gen-ts-refs','build-js', 'watch']);
