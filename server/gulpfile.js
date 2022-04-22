var gulp = require('gulp')
var rename = require('gulp-rename')
var del = require('del')



// 将static文件夹复制到build下
gulp.task('move', function(){
  return gulp.src(['.env_build'])
        .pipe(rename('.env'))
        .pipe(gulp.dest('dist'))
})

gulp.task('rename', function(){
  return gulp.src(['dist/index.js'])
        .pipe(rename('server.js'))
        .pipe(gulp.dest('dist'))
})

gulp.task('rename', function(){
  return gulp.src(['dist/index.js'])
        .pipe(rename('server.js'))
        .pipe(gulp.dest('dist'))
})

gulp.task('clean', function () {
  return del([
    'dist/index.js',
  ]);
});

gulp.task('complete', gulp.series('move', 'rename', 'clean'))

