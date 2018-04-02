const gulp = require("gulp");
const babel = require("gulp-babel");
const del = require("del");
const zip = require("gulp-zip");

const OUT_DIR = "dist";

gulp.task("clean", () => {
  return del(`${OUT_DIR}/**/*`);
});

gulp.task("build.scripts", () => {
  return gulp.src("src/**/*.js", { since: gulp.lastRun("build.assets") })
    .pipe(babel({
      "presets": [
        ["env", {
          targets: {
            browsers: [
              "last 2 chrome versions",
              "last 2 firefox versions"
            ]
          }
        }]
      ]
    }))
    .pipe(gulp.dest(OUT_DIR));
});

gulp.task("build.assets", () => {
  return gulp.src(["assets/**/*", "LICENSE", "manifest.json"], { since: gulp.lastRun("build.assets") })
    .pipe(gulp.dest(OUT_DIR));
});

gulp.task("build", gulp.parallel("build.scripts", "build.assets"));

gulp.task("package.zip", () => {
  return gulp.src("dist/**/*")
    .pipe(zip("TogetherTubeNightmode.zip"))
    .pipe(gulp.dest("."));
});

gulp.task("package", gulp.series("build", "package.zip"));
