const { src, dest, watch, parallel, series } = require("gulp"); 

const scss = require("gulp-sass")(require("sass")); 
const concat = require("gulp-concat"); 
const uglify = require("gulp-uglify-es").default; 
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer"); //ТОЛЬКО 8 версия
const clean = require("gulp-clean"); 
const pug = require("gulp-pug"); 

const avif = require("gulp-avif"); 
const webp = require("gulp-webp"); 
const imagemin = require("gulp-imagemin"); 
const newer = require("gulp-newer"); 
const svgSprite = require("gulp-svg-sprite"); 

const fonter = require("gulp-fonter-unx"); 
const ttf2woff2 = require("gulp-ttf2woff2"); 

// Задача для компиляции Pug
function pugToHtml() {
  return src("app/pug/index.pug")
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest("app"))
    .pipe(browserSync.stream());
}

//конвертация шрифтов в woff и woff2
function fonts() {
  return src("app/fonts/src/*.*")
    .pipe(
      fonter({
        formats: ["woff", "ttf"],
      })
    )
    .pipe(src("app/fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest("app/fonts"));
}

//конвертация всех картинок, кроме svg, в avif / webp
function images() {
  return src(["app/images/src/*.*", "!app/images/src/*.svg"])
    .pipe(newer("app/images/dist"))
    .pipe(avif({ quality: 50 }))

    .pipe(src("app/images/src/*.*"))
    .pipe(newer("app/images/dist"))
    .pipe(webp())

    .pipe(src("app/images/src/*.*"))
    .pipe(newer("app/images/dist"))
    .pipe(imagemin())

    .pipe(dest("app/images/dist"));
}

//создание svg спрайта
function sprite() {
  return src("app/images/dist/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest("app/images/dist"));
}

//конвертация scss с css и минификация
function styles() {
  return src("app/scss/style.scss")
    .pipe(concat("style.min.css")) 
    .pipe(scss({ outputStyle: "compressed" })) 
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] })) 
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

//минификация js
function scripts() {
  return src([
    "app/js/dataExtraction.js",
      "app/js/dataTableSettings.js",
      "app/js/formatNumber.js",
      "app/js/pagination.js",
      "app/js/dataTableInit.js",
      "app/js/dataTableSearch.js",
      "app/js/gsapAnimation.js",
  ])
    .pipe(concat("main.min.js")) 
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

//слежение за состоянием scss js файлов
function watching() {
  browserSync.init({
    server: {
      baseDir: "app/", //автообновление страницы браузера если есть изменения в папке app
    },
  });
  watch(["app/scss/**/*.scss"], styles); 
  watch(["app/images/src"], images); 
  watch(
    [
      "app/js/dataExtraction.js",
      "app/js/dataTableSettings.js",
      "app/js/formatNumber.js",
      "app/js/pagination.js",
      "app/js/dataTableInit.js",
      "app/js/dataTableSearch.js",
      "app/js/gsapAnimation.js",
    ],
    scripts
  ); 
  
  watch(["app/pug/**/*.pug"], pugToHtml); 
  watch(["app/*.html"]).on("change", browserSync.reload); 
}

//создаем билд
function building() {
  return src(
    [
      "app/css/style.min.css",
      "app/images/dist/*.*",
      // "!app/images/dist/*.svg",
      "app/images/dist/sprite.svg",
      "app/fonts/*.*",
      "app/js/main.min.js",
      "app/**/*.html",
      "!app/images/dist/stack/**",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

//перед тем, как билдить проект очищаем dist
function cleanDist() {
  return src("dist").pipe(clean());
}

exports.styles = styles; 
exports.images = images; 
exports.scripts = scripts; 
exports.watching = watching; 
exports.sprite = sprite; 
exports.fonts = fonts; 

exports.pugToHtml = pugToHtml; 

//gulp
exports.default = parallel(styles, images, scripts, pugToHtml, watching);

// gulp build
exports.build = series(cleanDist, building); 
//series отвечает за соблюдение порядка действий
//сначала удаляем содержимое, потом делаем новый билд
