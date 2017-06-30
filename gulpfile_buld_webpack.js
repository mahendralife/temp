'use strict';

const gulp      = require('gulp'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    cleancss    = require('gulp-clean-css'),
    pump        = require('pump'),
    rev         = require('gulp-rev'),
    replace     = require('gulp-replace'),
    revReplace  = require('gulp-rev-replace'),
    fs          = require('fs');

const watchFiles =['app/*.js','template/*/*.ctrl.js','app_modules/*/*.ctrl.js'];


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
minify external Js files for  admin-end
*/
gulp.task('bundle:uglify', (cb) => {
    pump([
        gulp.src([
            //application folder
            "app/evn.js",
            "app/config.js",
            "app/theme.js",
            "app/app.js",
            "app/services.js",
            "app/directive.js",

            //controller
            "template/*/*.ctrl.js",
            "app_modules/*/*.ctrl.js",
            "app_modules/*/*/*.ctrl.js"


        ]),
        concat('bundle.js'),
        uglify({output:{beautify: false, max_line_len:50000}}),
        gulp.dest('dist/js/')
    ],cb);

});


gulp.task('default', [
      'bundle:uglify',
      'bundle:cssmin',
      'watch'

], function() {
    console.log("gulp all tasks finished");
});

//build all task 

// Production binaries
gulp.task('deleteOldFiles', () => {


   
}); 

gulp.task('revision:css', () => {

    fs.unlink('index.html', function(err, success){
         console.log(err);
         console.log(success);
    });
    
     fs.unlink('dist/rev-manifest.json', function(err, success){
         console.log(err);
         console.log(success);
    });
    setTimeout(function(){
   
    gulp.src([
        
        'dist/css/*.css'

    ], {base: 'dist/css'})
        .pipe(rev())

        .pipe(gulp.dest('dist/')) //stote hash css file on location dist/css/
        .pipe(rev.manifest('rev-manifest.json', {
            base: 'dist/', //store rev-manifest.json file on location /dist/
            merge: true // merge with the existing manifest if one exists,
         
        }))

        .pipe(gulp.dest('dist/css/'))
    },1000);

}); 

let opt = {
    distFolder: 'dist/',
    srcFolder: ''
}
gulp.task("build", ["deleteOldFiles","revision:css"], () => {
    var manifest = gulp.src(opt.distFolder + "rev-manifest.json");
    // Read from a source that remains unchanged, so the replacement values can always be found.
    // return 
    //      gulp.src("index.template.html")
    //     .pipe(revReplace({manifest: manifest}))
    //     .pipe(fs.write('index.html')) //create new file 
    //     .pipe(gulp.dest(''));
 setTimeout(function(){
    return gulp.src("index.template.html")
            .pipe(revReplace({manifest: manifest}))
            .pipe(concat('index.html')) //create new file 
            .pipe(gulp.dest(''));
         },1500);
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

