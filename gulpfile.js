const gulp = require('gulp');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const cachebust = require("gulp-cache-bust");

//Constante para el modulo de recarga automática del sitio web al hacer cambios
const browserSync = require('browser-sync')
//Instancia del servidor de desarrollo
const server = browserSync.create()


gulp.task("styles", () => {
  return gulp
    .src('./dev/scss/styles.scss')
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "compact"
      })
    )
    .pipe(
      autoprefixer()
    )
    .pipe(gulp.dest('./public/css'))
    .pipe(server.stream())
})

gulp.task('pug', function buildHTML() {
  return gulp.src('./dev/pug/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest('./public/'))
});



gulp.task('default', () => {
  //Iniciación del servidor en el puerto 80
  server.init({
    server: './public'
  })
  gulp.watch('./dev/pug/**/*.pug', gulp.series('pug')).on('change', server.reload)
  gulp.watch('./dev/scss/**/*.scss', gulp.series('styles'))
  gulp.watch('./public/js/*.js').on('change', server.reload)
})


