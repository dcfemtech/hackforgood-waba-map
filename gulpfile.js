var gulp = require('gulp')
var concat = require('gulp-concat')
var livereload = require('gulp-livereload')
var minifyCSS = require('gulp-minify-css')
var embedlr = require('gulp-embedlr')
var serve = require('gulp-serve');


gulp.task('serve', serve('dist'));

gulp.task('html', function() {
    gulp.src("app/*html")
        .pipe(embedlr())
        .pipe(gulp.dest('dist/'))
        .pipe(livereload())
})

gulp.task('scripts', function() {
    gulp.src(['app/*.js'])
        .pipe(gulp.dest('dist/'))
        .pipe(livereload())
})

gulp.task('data', function() {
    gulp.src(['data/**/*.geojson'])
        .pipe(gulp.dest('dist/data'))
        .pipe(livereload())
})

gulp.task('styles', function() {
    gulp.src(['app/*.css'])
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/'))
        .pipe(livereload())
})

gulp.task('lr-server', function() {
    server.listen(35729, function(err) {
        if(err) return console.log(err);
    });
})

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch('app/*.js', ['scripts'])
  gulp.watch('app/**/*.geojson', ['data'])
  gulp.watch('app/*.css', ['styles'])
  gulp.watch('app/*.html', ['html'])
})

gulp.task('default', function() {
    gulp.run('scripts', 'styles', 'html', 'data', 'serve', 'watch');
})
