var gulp          = require('gulp'),
    cleancss      = require('gulp-clean-css'),          //css压缩
    autoprefixer  = require('gulp-autoprefixer'),       //css3浏览器前缀
    sass          = require('gulp-sass'), 
    rev           = require('gulp-rev'),                //文件md5
    revCollector  = require('gulp-rev-collector'),      //文件名替换为加md5之后的名字
    useref        = require('gulp-useref'),             //
    concat        = require('gulp-concat'),             //文件合并
    uglify        = require('gulp-uglify'),             //js压缩
    htmlmin       = require('gulp-htmlmin'),            //html压缩
    imagemin      = require('gulp-imagemin'),           //图片压缩
    cache         = require('gulp-cache'),              //文件缓存
    clean         = require('gulp-clean'),              //文件删除
    runSequence   = require('run-sequence'),            //按指定顺序执行task
    browserSync   = require('browser-sync').create(),   //开发时浏览器自动刷新
    reload        = browserSync.reload;                 

/* 目录结构

|-project
   |-src
     |-rev ----自动生成的版本号映射文件
     |-js
     |-css ----自动生成的编译scss文件
     |-scss
     |-images
     |-views
     |-index.html
   |-dist -----自动生成的gulp处理之后文件目录
     |-css
     |-images
     |-js
     |-views
     |-index.html
   |-gulpfile.js ----gulp配置文件
   |-package.json  

*/
// 设置项目路径
var baseDir = './src',

    styleDir = baseDir + '/scss/*.scss',  //项目源文件路径
    jsDir = baseDir + '/js/*.js',
    htmlDir = baseDir + '/**/*.html',
    imgDir = baseDir + '/images/*',

    versionRoot = baseDir + '/rev',   //生成的版本映射文件
    versionDir = versionRoot + '/**/*.json', 

    distDir = './dist',              //生成的目标文件路径
    styleDist = distDir + '/css',
    jsDist = distDir + '/js',
    imgDist = distDir + '/images',

    compileScss = baseDir + '/css'; //开发编译的css文件路径

gulp.task('server', () => {
    browserSync.init({       
        port: 6080,
        server: {
            baseDir: baseDir
        }
    });
    gulp.watch(styleDir,['sass']).on('change',reload);
    gulp.watch(jsDir).on('change',reload);
    gulp.watch(htmlDir).on('change', reload);
});

// 压缩html/更新引入文件版本
gulp.task('html', () => {
    return gulp.src([ versionDir, htmlDir])
    .pipe(revCollector())
    //.pipe(useref())
    .pipe(gulp.dest(distDir));
});

// 编译sass
gulp.task('sass', ()=> {
    return gulp.src(styleDir)
    .pipe(sass())
    .pipe(gulp.dest(compileScss))
});

// css压缩合并，根据MD5获取版本号
gulp.task('css', () => {
    return gulp.src(styleDir)
    .pipe(sass())
    .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
    }))
    //.pipe(concat('main.min.css'))
    .pipe(cleancss())
    .pipe(rev())
    .pipe(gulp.dest(styleDist))
    .pipe(rev.manifest())
    .pipe(gulp.dest(versionRoot + '/css'));
});

// js压缩合并，根据MD5获取版本号
gulp.task('js', () => {
    return gulp.src(jsDir)
    //.pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(jsDist))
    .pipe(rev.manifest())
    .pipe(gulp.dest(versionRoot + '/js'));
});


//Images 根据MD5获取版本号,压缩（有问题）
// gulp.task('img', () =>{
//     return gulp.src('./src/images/*')
//         // .pipe(gulpif(condition,cache(imagemin({
//         //     optimizationLevel: 5,
//         //     progressive: true,
//         //     interlaced: true,
//         // })))) //压缩图片
//         .pipe(rev())
//         .pipe(gulp.dest('dist/images'))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('src/rev/images'));
// });

// Image 图片压缩
gulp.task('minImg', () => {
    return gulp.src(imgDir)
        .pipe(cache(imagemin({  //使用”gulp-cache”只压缩修改的图片，没有修改的图片直接从缓存文件读取
            optimizationLevel: 5, //优化等级，默认3
            progressive: true,  //无损压缩jpg图片，默认false
            interlaced: true  // 隔行扫描gif进行渲染,默认false
        })))
        .pipe(gulp.dest(imgDist));
});

// 清除
gulp.task('clean', () => {
    return gulp.src([ distDir, versionRoot, compileScss],{read: true})
    .pipe(clean())
})

//开发构建--开发时的task(有点问题)
gulp.task('dev', function () {
    return runSequence(
         ['clean'],
         ['sass'],
         ['server']
    );
});

//生产
gulp.task('build', function () {
    return runSequence(
         ['clean'],
         ['minImg'],
         ['css', 'js'],
         ['html']
    );
});


gulp.task('default', ['dev']);