'use strict';

const gulp      = require('gulp'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    cleancss    = require('gulp-clean-css'),
    pump        = require('pump'),
    env         = require('gulp-environments'),
    fs          = require('fs');

let development = env.development,
     production  = env.production;


const watchFiles =['app/*.js','template/*/*.ctrl.js','app_modules/*/*.ctrl.js'];


var envFile = production() ? ['./env/production.js'] : ['./env/development.js'];

let _appFiles=[
            //application folder
            "app/env.js",
            "app/API_PATH.js",
            "app/config.js",
            "app/theme.js",
            "app/app.js",
            "app/services.js",
            "app/directive.js",

            //controller
            "template/*/*.ctrl.js",
            "app_modules/*/*.ctrl.js",
            "app_modules/*/*/*.ctrl.js"

        ];
let appFiles = envFile.concat(_appFiles);
console.log(appFiles);

/*
    task for compress all css bowers css
*/
gulp.task('vendor:cssmin', () => {
    gulp.src([
        //css file path
        'bower_components/angular-material/angular-material.min.css',
        'bower_components/angular-material-icons/angular-material-icons.css'

    ])
    .pipe(concat('vendor.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('bundle:cssmin', () => {
    gulp.src([
        //css file path
        'css/*.style.css',
    ])
    .pipe(concat('bundle.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('dist/css/'));
});

/*
    Gulp task for minify vendor js files
*/

gulp.task('vendor:uglify', (cb) => {
    pump([
        gulp.src([
            'bower_components/angular/angular.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-aria/angular-aria.min.js',
            'bower_components/angular-messages/angular-messages.min.js',
            'bower_components/angular-material/angular-material.min.js',
            'bower_components/angular-material-icons/angular-material-icons.min.js'
        ]),
        concat('vendor.js'),
        uglify({output:{beautify: false, max_line_len:50000}}),
        gulp.dest('dist/js/')
    ],cb);

});

/*
minify external Js files for  admin-end
*/
gulp.task('bundle:uglify', (cb) => {
    pump([
        
        gulp.src(appFiles),

        concat('bundle.js'),
        uglify({output:{beautify: false, max_line_len:50000}}),
        gulp.dest('dist/js/')
    ],cb);

});

/*
gulp build for vendor library 
*/

gulp.task('build',[            
    'vendor:cssmin',
    'vendor:uglify'
]);

/*
    gulp default task
*/

gulp.task('default', [
      'bundle:uglify',
      'bundle:cssmin',
      'watch'

], function() {
    console.log("gulp all tasks finished");
});

/*
    gulp watch automatically build files when changes are done js or css
*/

gulp.task('watch',function(){

    gulp.watch('css/*.style.css', ['bundle:cssmin'], 
        function() {
        console.log("gulp all tasks finished1");
    });

     gulp.watch(watchFiles, 
        ['bundle:uglify'], 
        function() {
        console.log("gulp all tasks finished2");
    });

})

