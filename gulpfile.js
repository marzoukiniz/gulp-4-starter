// Load plugins
const gulp = require("gulp"),
  sass = require("gulp-sass");
(autoprefixer = require("gulp-autoprefixer")),
  (cssnano = require("gulp-cssnano")),
  (jshint = require("gulp-jshint")),
  (uglify = require("gulp-uglify")),
  (imagemin = require("gulp-imagemin")),
  (rename = require("gulp-rename")),
  (concat = require("gulp-concat")),
  (notify = require("gulp-notify")),
  (cache = require("gulp-cache")),
  (livereload = require("gulp-livereload")),
  (del = require("del"));

const { watch, series, src, parallel } = require("gulp");

const files = {
  stylesPath: "src/styles/**/*.scss",
  scriptPath: "src/scripts/**/*.js",
  imgPath: "src/images/**/*"
};

/**
 *
 */
function styles() {
  return (
    src(files.stylesPath)
      .pipe(sass())
      // .pipe(autoprefixer('last 2 version'))
      .pipe(sass.sync().on("error", console.log))
      .pipe(gulp.dest("dist/styles"))
      .pipe(rename({ suffix: ".min" }))
      .pipe(cssnano())
      .pipe(gulp.dest("dist/styles"))
      .pipe(notify({ message: "Styles task complete" }))
  );
}

/**
 *
 */
function scripts() {
  return src(files.scriptPath)
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter("default"))
    .pipe(concat("main.js"))
    .pipe(gulp.dest("dist/scripts"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("dist/scripts"))
    .pipe(notify({ message: "Scripts task complete" }));
}

/**
 * images
 * @todo add to watch func
 */
function images() {
  return src(files.imgPath)
    .pipe(
      cache(
        imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
      )
    )
    .pipe(gulp.dest("dist/images"))
    .pipe(notify({ message: "Images task complete" }));
}

/**
 * clean
 */
function clean() {
  return del(["dist/styles", "dist/scripts", "dist/images"]);
}

function watchTask() {
  watch(
    [files.stylesPath, files.scriptPath, files.imgPath],
    parallel(styles, scripts)
  );
}

exports.default = series(clean, parallel(styles, scripts), watchTask);

// Default task
// gulp.task(
//   "default",
//   gulp.series("clean", function() {
//     gulp.start("styles", "scripts", "images");
//   })
// );

// Watch
// function serve() {
//   // Watch .scss files
//   gulp.watch("src/styles/*.scss", series(styles));

//   // Watch .js files
//   gulp.watch("src/scripts/**/*.js", series(scripts));

//   // Watch image files
//   gulp.watch("src/images/**/*", series(images));

//   // Create LiveReload server
//   // livereload.listen();

//   // Watch any files in dist/, reload on change
//   // gulp.watch(['dist/**']).on('change', livereload.changed);
// }
