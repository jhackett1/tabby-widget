const gulp = require("gulp")
const sass = require("gulp-sass")
const babel = require("gulp-babel")

// Copy over HTML files
gulp.task("html", ()=>{
    gulp.src("src/*.html")
        .pipe(gulp.dest("dist"))
})

// Compile SASS
gulp.task("sass", ()=>{
    return gulp.src("src/style.sass")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("dist"))
})

// Compile JS
gulp.task("js", ()=>{
    return gulp.src("src/index.js")
        .pipe(babel())
        .pipe(gulp.dest("dist"))
})

gulp.task("default", ()=>{
    gulp.start("html", "sass", "js")      
    gulp.watch("src/*", ()=>{
        gulp.start("html", "sass", "js")    
    })
})