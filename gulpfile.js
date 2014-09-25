var path  = require('path');
var spawn = require('child_process').spawn;
var os    = require('os');

var shell  = require('gulp-shell');
var args   = require('yargs').argv;
var gulp   = require('gulp');
var sass   = require('gulp-sass');
var grep   = require('gulp-grep-stream');
var spa    = require("gulp-spa");
var webkit = require('node-webkit-builder');
var notify = require("gulp-notify");

gulp.task('sass', function() {
  return gulp.src('./scss/index.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/stylesheets'))
    .pipe(notify({
      title   : "SASS",
      message : "File <%= file.path %> generated!"
    }));
});

gulp.task('html', function () {
  var minify = args.min || false;
  return gulp.src('./html/index.html')
    .pipe(spa.html({
        assetsDir : "./app",
        pipelines : {
          bower       : function (files) {
            return files
              .pipe(grep(Object.keys(require('./bower.json').dependencies).map(function(module) { return "/**/"+module+"/**/*.js" })))
              .pipe(grep("**/*.min.*", { invertMatch : !minify }))
              .pipe(grep("!**/+(src|js|grunt|test)/**"))
              .pipe(grep("**/?runtfile.js", { invertMatch : true }));
          },
          mystyles    : function (files) { return files; },
          bootstrap   : function (files) { return files.pipe(grep("**/*.min.*", { invertMatch: !minify })); },
          application : function (files) { return files; },
        }
    }))
    .pipe(gulp.dest('./app'))
    .pipe(notify({
        onLast  : true,
        title   : "HTML",
        message : "File <%= file.path %> generated!"
    }));
  });


gulp.task('webkit', function (callback) {
  var builder = new webkit({
    cacheDir  : os.tmpdir(),
    files     : './app/**',
    platforms : ['win', 'osx', 'linux32', 'linux64'],
  });

  builder.build(function (error) {
    if (error) return callback(error);
    gulp.src("./build/voxy/**", {read : false})
    .pipe(grep('**/voxy/*'))
    .pipe(notify({
        title   : "WEBKIT",
        message : "Webkit version for <%= file.relative %> generated!"
    }));

    callback();
  });

});

gulp.task('run', shell.task('./build/voxy/linux64/nw'));


gulp.task('build', ['sass', 'html', 'webkit']);
