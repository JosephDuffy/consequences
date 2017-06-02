const gulp = require("gulp");
const watch = require("gulp-watch");
const dts_gen = require('dts-generator').default;
const ts = require("gulp-typescript");
const tsProject = ts.createProject("./tsconfig.json");

gulp.task("build", () => {
    // TODO: Copy index.d.ts
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(tsProject.options.outDir));
});

gulp.task("watch", () => {
    return watch("./src/**/*.ts")
        .pipe(gulp.dest("./build"));
});

gulp.task("default", ["build"]);
