module.exports = () => {
  blinker.gulp.task('images:copy', function () {
    return blinker.gulp.src(
      [
        './' + blinker.config.sourcePath + '/' + blinker.config.imagesDirectory + '/**/*',
        '!./' + blinker.config.sourcePath + '/' + blinker.config.pngSpriteDirectory + '/**/*',
        '!./' + blinker.config.sourcePath + '/' + blinker.config.svgSpriteDirectory + '/**/*',
        '!./' + blinker.config.sourcePath + '/' + blinker.config.svgInlineSpriteDirectory + '/**/*',
      ]
    )
      .pipe(blinker.gulp.dest(blinker.config.temporaryPath + '/' + blinker.config.imagesDirectory))
      .pipe(blinker.plugins.browser_sync.reload({stream: true}));
  });

  blinker.gulp.task('fonts:copy', function () {
    return blinker.gulp.src(['./' + blinker.config.sourcePath + '/' + blinker.config.fontsDirectory + '/**/*'])
      .pipe(blinker.gulp.dest(blinker.config.temporaryPath + '/' + blinker.config.fontsDirectory))
      .pipe(blinker.plugins.browser_sync.reload({stream: true}));
  });

  blinker.gulp.task('video:copy', function () {
    return blinker.gulp.src(['./' + blinker.config.sourcePath + '/' + blinker.config.videoDirectory + '/**/*'])
      .pipe(blinker.gulp.dest(blinker.config.temporaryPath + '/' + blinker.config.videoDirectory))
      .pipe(blinker.plugins.browser_sync.reload({stream: true}));
  });

  blinker.gulp.task('dist:fonts', function () {
    return blinker.gulp.src(['./' + blinker.config.temporaryPath + '/' + blinker.config.fontsDirectory + '/**/*'])
      .pipe(blinker.gulp.dest(blinker.config.destinationPath + '/' + blinker.config.fontsDirectory));
  });

  blinker.gulp.task('dist:images', function () {
    return blinker.gulp.src(['./' + blinker.config.temporaryPath + '/' + blinker.config.imagesDirectory + '/**/*'])
      .pipe(blinker.gulp.dest(blinker.config.destinationPath + '/' + blinker.config.imagesDirectory));
  });

  blinker.gulp.task('dist', function () {
    return blinker.gulp.src(
      [
        './' + blinker.config.temporaryPath + '/**/*',
        '!./' + blinker.config.temporaryPath + '/' + blinker.config.javascriptDirectory + '/**/*',
      ]
    )
      .pipe(blinker.gulp.dest(blinker.config.destinationPath + '/'))
  });
};