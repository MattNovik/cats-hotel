var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'),
    cssmin = require("gulp-cssmin"), // Минимизация CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    imagemin = require('gulp-imagemin'), // Сжатие изображений
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require('gulp-uglify-es').default, // Минимизация javascript
    rename = require("gulp-rename") // Переименование файлов
    browserSync = require('browser-sync');// Создаю сервер на браузере

gulp.task("html", function() {
    return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"));
});

gulp.task("html-allRooms", function() {
    return gulp.src("src/allRooms/*.html")
    .pipe(gulp.dest("dist/allRooms"));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    port: 8080,
    open: true,
    notify: false
  });
  gulp.watch("dist/*.html").on('change', browserSync.reload);
  gulp.watch("dist/css/*.css").on('change', browserSync.reload);
  gulp.watch("dist/images/*.+(jpg|jpeg|png|gif|svg)").on('change', browserSync.reload);
  gulp.watch("dist/js/*.js").on('change', browserSync.reload);
/*  gulp.watch("dist/allRooms/*.html").on('change', browserSync.reload);
  gulp.watch("dist/allRooms/css/*.css").on('change', browserSync.reload);
  gulp.watch("dist/allRooms/images/*.+(jpg|jpeg|png|gif|svg)").on('change', browserSync.reload);
  gulp.watch("dist/allRooms/js/*.js").on('change', browserSync.reload); */ 
});


gulp.task('sass', function() { // Создаем таск "sass"
  return gulp.src(['src/scss/**/*.scss']) // Берем источник
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(autoprefixer({
       browsers: ['last 2 versions'],
       cascade: false
     }))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css')) // Выгружаем результата в папку css
    .pipe(browserSync.stream());
  });

gulp.task('sass-allRooms', function() { // Создаем таск "sass"
  return gulp.src(['src/allRooms/scss/**/*.scss']) // Берем источник
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(autoprefixer({
       browsers: ['last 2 versions'],
       cascade: false
     }))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/allRooms/css')) // Выгружаем результата в папку css
    .pipe(browserSync.stream());
  });

gulp.task("scripts", function() {
    return gulp.src("src/js/*.js") // директория откуда брать исходники
        .pipe(concat('scripts.js')) // объеденим все js-файлы в один 
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
        .pipe(gulp.dest("dist/js")); // директория продакшена, т.е. куда сложить готовый файл
});

gulp.task("scripts-allRooms", function() {
    return gulp.src("src/allRooms/js/*.js") // директория откуда брать исходники
        .pipe(concat('scripts.js')) // объеденим все js-файлы в один 
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
        .pipe(gulp.dest("dist/allRooms/js")); // директория продакшена, т.е. куда сложить готовый файл
});

gulp.task('imgs', function() {
    return gulp.src("src/images/**/*.+(jpg|jpeg|png|gif|svg|webp)")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/images"))
});

gulp.task('imgs-allRooms', function() {
    return gulp.src("src/allRooms/images/**/*.+(jpg|jpeg|png|gif|svg|webp)")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/allRooms/images"))
});

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch("src/*.html", gulp.parallel('html'));
    gulp.watch("src/js/*.js", gulp.parallel('scripts'));
    gulp.watch("src/images/*.+(jpg|jpeg|png|gif|svg)", gulp.parallel('imgs'));
});

gulp.task('watch-allRooms', function() {
    gulp.watch('src/allRooms/scss/**/*.scss', gulp.parallel('sass-allRooms'));
    gulp.watch("src/allRooms/*.html", gulp.parallel('html-allRooms'));
    gulp.watch("src/allRooms/js/*.js", gulp.parallel('scripts-allRooms'));
    gulp.watch("src/allRooms/images/*.+(jpg|jpeg|png|gif|svg)", gulp.parallel('imgs-allRooms'));
});

gulp.task("default", gulp.parallel("html", "sass", "scripts", "imgs","browserSync", "watch","html-allRooms", "sass-allRooms", "scripts-allRooms", "imgs-allRooms", "watch-allRooms"));