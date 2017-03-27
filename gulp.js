'use strict';
const gulp      = require('gulp'),
    //jshint      = require('gulp-jshint'),
    //stylish     = require('jshint-stylish'),
    nodemon     = require('gulp-nodemon'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    cleancss    = require('gulp-clean-css'),
    pump        = require('pump'),
   // notify      = require('gulp-notify'),
    livereload  = require('gulp-livereload'),
    fs          = require('fs');

/*
 * This package is used for restart node server every our server file changes
 * source: https://www.npmjs.com/package/nodemon
 */

gulp.task('nodemon', () => {
    livereload.listen();
    nodemon({
           // tasks: ['jshint'],
            script: 'app.js',
            ext: 'js html',
            ignore: ['node_modules/', 'bower_components/', 'public/js/','admin/js/', 'test/', 'coverage/', 'public/images/','public/css/fonts/','*.html'],
        })
        .on('restart', () => {
            gulp.src('app.js')
            .pipe(livereload())
           // .pipe(notify('Task completed'));
        });
});

/*
 * JSHint to lint all the js files
 */

// gulp.task('jshint',['app:uglify','admin.app:uglify'],  () => {
//     return gulp.src([
//             './config/**/*.js',
            
//         ])
//         .pipe(jshint())
//         .pipe(jshint.reporter(stylish));
// });

/*
minify external Js files for  admin
*/

gulp.task('adminsite:uglify', (cb) => {
    pump([
        gulp.src([
        'bower_components/angular/angular.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-aria/angular-aria.min.js',
        'bower_components/angular-messages/angular-messages.min.js',
        'bower_components/angular-material/angular-material.min.js',
        ]),
        concat('site.min.js'),
        uglify(),
        gulp.dest('./admin/js')
    ],cb);
});

gulp.task('adminapp:uglify', (cb) => {
    pump([
        gulp.src([
            './admin/app/config.js',
            './admin/app/app.js'
            
        ]),
        concat('app.min.js'),
        uglify(),
        gulp.dest('./admin/js')
    ],cb);
});


/*
* This task is will minify all the angular modules files
* @ front-end
*/

gulp.task('frontsite:uglify', (cb) => {
    pump([
        gulp.src([
        'bower_components/angular/angular.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-aria/angular-aria.min.js',
        'bower_components/angular-messages/angular-messages.min.js',
        'bower_components/angular-material/angular-material.min.js',
        ]),
        concat('site.min.js'),
        uglify(),
        gulp.dest('./public/js')
    ],cb);

});


gulp.task('frontapp:uglify', (cb) => {
    pump([
        gulp.src([
            './public/app/config.js',
            './public/app/app.js',
            './public/app/directives.js',
            './public/app/routes.js',
            './public/partials/login/login.js',

            
        ]),
        concat('app.min.js'),
        uglify(),
        gulp.dest('./public/js')
    ],cb);
});


/*
* This task will minify all the css files
* 
*/

gulp.task('adminsite:cssmin', () => {
    gulp.src([
        'bower_components/angular-material/angular-material.min.css',
    ])
    .pipe(concat('site.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./admin/css/'));
});

gulp.task('adminapp:cssmin', () => {
    gulp.src([
        'admin/css/*.css'
    ])
    .pipe(concat('app.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./admin/css/'));
});


/*
* This task will minify all the css files
* @ front-end
*/

gulp.task('frontsite:cssmin', () => {
    gulp.src([
        'bower_components/angular-material/angular-material.min.css',
    ])
    .pipe(concat('site.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('frontapp:cssmin', () => {
    gulp.src([
        'public/css/*.css'
    ])
    .pipe(concat('app.min.css'))
    .pipe(cleancss({compatibility: 'ie8', processImport: false}))
    .pipe(gulp.dest('./public/css/'));
});

/*
* To check whether .env file exists or not
* if not exists, create the file and write the env variable
*/
// gulp.task('check:env', () => {
//     fs.stat(`${__dirname}/.env`, (err, success) => {
//         if(err){
//             try{
//                 let path = `${__dirname}/.env`;
//                 if(fs.openSync(path,'w')){
//                     fs.writeFileSync(path,'NODE_ENV=development');
//                 }
//             } catch(e){
//                 console.error(`System is unable to create ".env" file, please create ".env" file in root directory and specify the "NODE_ENV" to either one of these (development, production) eg. NODE_ENV=development`);
//             }
//         }
//     });
// });

gulp.task('default', [
    'adminsite:uglify',
    'frontsite:uglify',
    //'adminapp:uglify',
    'frontapp:uglify',

    'adminsite:cssmin',
    'adminapp:cssmin',

    'frontsite:cssmin',
    'frontapp:cssmin'

   
    // 'check:env',
    // 'jshint',
    //'nodemon'
    // 'site:uglify',
    // 'admin-site:uglify',
    // 'app:uglify',
    // 'admin.app:uglify',
    // 'app:cssmin',
    // 'admin-site:cssmin'
], function() {
    console.log("gulp all tasks finished");
});
