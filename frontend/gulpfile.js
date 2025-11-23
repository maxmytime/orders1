import pkg from 'gulp'
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass'
import * as dartSass from 'sass'
import postCss from 'gulp-postcss'
import cssnano from 'cssnano'
import concat from 'gulp-concat'
import autoprefixer from 'autoprefixer'
import {deleteAsync} from 'del'

const { src, dest, parallel, series, watch } = pkg
const sass = gulpSass(dartSass)

// Локальный сервер
function browsersync() {
    browserSync.init({
        server: {
            baseDir: './public/',
            serveStaticOptions: {
                extensions: ['html'],
            },
        },
        port: 8080,
        ui: { port: 8081 },
        open: true,
    });
}

// HTML страницы
function pages() {
    return src('./src/pages/*.html')
        .pipe(dest('./public/'))
        .pipe(browserSync.reload({ stream: true, }));
}

// JS файлы
function scripts() {
    return src('./src/js/**/*.js')
        .pipe(dest('./public/js'))
        .pipe(browserSync.reload({ stream: true, }));
}

// Файлы стилей
function styles() {
    return src('./src/styles/**/*.*')
        .pipe(sass({ 'include css': true }))
        .pipe(postCss([
            autoprefixer({ grid: 'autoplace' }),
            // cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
        ]))
        .pipe(concat('main.min.css'))
        .pipe(dest('public/css'))
        .pipe(browserSync.stream())
}

// Файлы шрифтов
function copyFonts() {
    return src('./src/fonts/**/*', { encoding: false })
        .pipe(dest('./public/fonts/'))
}

// Файлы изображений
function copyImages() {
    return src('./src/images/**/*', { encoding: false })
        .pipe(dest('./public/images/'))
}

// Очистка папки паблик
async function clean() {
	await deleteAsync('./public/', { force: true })
}

// Отслеживание измененией в файлах
function watch_dev() {
    watch(['./src/pages/**/*.html'], pages);
    watch(['./src/js/**/*.js'], scripts);
    watch(['./src/styles/**/*.*'], styles);
    watch(['./src/fonts/**/*.*'], copyFonts);
    watch(['./src/images/**/*.*'], copyImages);
}

export { browsersync, pages, scripts, styles, copyFonts, copyImages, clean };
export default series(clean, pages, scripts, styles, copyFonts, copyImages, parallel(browsersync, watch_dev));
export let build = parallel(clean, pages, scripts, styles, copyFonts, copyImages);
