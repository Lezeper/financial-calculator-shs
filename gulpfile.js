var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function () {
  gulp.src(['./client/**/*.js', '!./client/**/*.test.js', 
              '!./client/app.min.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('./app.min.js'))
    .pipe(uglify({mangle: true}).on('error', onError))
    .pipe(gulp.dest('client'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('client'))
    .on('error', onError);
});

gulp.task('watch', function () {
  watch(['./client/**/*.js', '!./client/**/*.test.js', 
        '!./client/app.min.js'], function () {
    gulp.start('scripts').on('error', onError);
  });
});

gulp.task('default', ['scripts', 'watch']);

// on error, restart gulp
function onError(err) {
  console.log(err);
  this.emit('end');
}