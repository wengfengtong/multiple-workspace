const fs = require("fs");
const path = require('path')

const gulp = require("gulp");
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-tinypng-nokey');

const {sprites,minImages} = require('./views.config')
const sptieDir = sprites.entry
const outPut = sprites.outPut
const template = sprites.template
const baseImagesPath = sprites.baseImagesPath

// 合并图片
gulp.task('sprite', function (done) {
    let files = fs.readdirSync(sptieDir)
    files.forEach((spriteName) => {
        const spritePath = path.resolve(sptieDir,spriteName)
        let fileStat = fs.statSync(spritePath)
        if (fileStat.isDirectory()) {
            const spriteFragments = spritePath+'/*.png';
            var spriteData = gulp.src(spriteFragments).pipe(spritesmith({
                imgName: spriteName + '.png',
                cssName: '\_' + spriteName + '.scss',
                cssTemplate: template ,
                cssOpts: {
                    url: 'spriteUrl',
                    picUrl: baseImagesPath
                },
                algorithm: "binary-tree",
                cssFormat: 'scss',
                padding: 15
            }))
            spriteData.img.pipe(gulp.dest(outPut.image));
            spriteData.css.pipe(gulp.dest(outPut.scss));
        }
    })
    done()
});

// 压缩图片
gulp.task('minImages', function (done) {
    gulp.src(minImages.entry)
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(minImages.outPut));
    done()
});
