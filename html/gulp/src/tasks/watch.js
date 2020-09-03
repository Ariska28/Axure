module.exports = () => {
  blinker.gulp.task('watch', () => {
    blinker.gulp.watch(
      [
        blinker.config.sourcePath + '/' + blinker.config.stylesDirectory + '/**/*.scss',
        blinker.config.sourcePath + '/' + blinker.config.stylesDirectory + '/**/*.sass',
        blinker.config.sourcePath + '/' + blinker.config.stylesDirectory + '/**/*.css'
      ],
      blinker.gulp.series('styles'));
    blinker.gulp.watch(
      [
        blinker.config.sourcePath + '/' + blinker.config.viewsDirectory + '/**/*.twig',
        blinker.config.sourcePath + '/' + blinker.config.viewsDirectory + '/**/*.html',
        blinker.config.sourcePath + '/' + blinker.config.viewsDirectory + '/**/*.htm'
      ],
      blinker.gulp.series('templates'));
    blinker.gulp.watch(
      [
        './' + blinker.config.sourcePath + '/' + blinker.config.javascriptDirectory + '/**/*.js',
        '!./' + blinker.config.sourcePath + '/' + blinker.config.javascriptDirectory + '/libraries.js'
      ],
      blinker.gulp.series('scripts'));
    blinker.gulp.watch([blinker.config.sourcePath + '/' + blinker.config.pngSpriteDirectory + '/*.png'], {usePolling: true},  blinker.gulp.series('png-sprite'));
    blinker.gulp.watch(['./' + blinker.config.sourcePath + '/' + blinker.config.imagesDirectory + '/**/*'], {usePolling: true},  blinker.gulp.series('images:copy'));
    blinker.gulp.watch(['./' + blinker.config.sourcePath + '/' + blinker.config.fontsDirectory + '/**/*'], {usePolling: true},  blinker.gulp.series('fonts:copy'));
    blinker.gulp.watch(['./' + blinker.config.sourcePath + '/' + blinker.config.svgSpriteDirectory + '/**/*.svg'], {usePolling: true},  blinker.gulp.series('svg:sprite'));
    blinker.gulp.watch(['./' + blinker.config.sourcePath + '/' + blinker.config.svgInlineSpriteDirectory + '/**/*.svg'], {usePolling: true},  blinker.gulp.series('svg:inline'));
  });

  blinker.gulp.task('watch:build', () => {

    blinker.gulp.watch(
      [
        blinker.config.sourcePath + '/' + blinker.config.stylesDirectory + '/**/*.scss',
        blinker.config.sourcePath + '/' + blinker.config.stylesDirectory + '/**/*.sass',
        blinker.config.sourcePath + '/' + blinker.config.stylesDirectory + '/**/*.css'
      ],
      blinker.gulp.series('styles:build'));

    blinker.gulp.watch(
      [
        blinker.config.sourcePath + '/' + blinker.config.viewsDirectory + '/**/*.twig',
        blinker.config.sourcePath + '/' + blinker.config.viewsDirectory + '/**/*.html',
        blinker.config.sourcePath + '/' + blinker.config.viewsDirectory + '/**/*.htm'
      ],
      blinker.gulp.series('templates'));

    blinker.gulp.watch(
      [
        './' + blinker.config.sourcePath + '/' + blinker.config.javascriptDirectory + '/**/*.js',
        '!./' + blinker.config.sourcePath + '/' + blinker.config.javascriptDirectory + '/libraries.js'
      ],
      blinker.gulp.series('scripts', 'scripts:build'));

    blinker.gulp.watch([blinker.config.sourcePath + '/' + blinker.config.pngSpriteDirectory + '/*.png'],  blinker.gulp.series('png-sprite'));
    blinker.gulp.watch(['./' + blinker.config.sourcePath + '/' + blinker.config.imagesDirectory + '/**/*'],  blinker.gulp.series('images:copy', 'dist:images'));
    blinker.gulp.watch(['./' + blinker.config.sourcePath + '/' + blinker.config.fontsDirectory + '/**/*'],  blinker.gulp.series('fonts:copy', 'dist:fonts'));
    blinker.gulp.watch(['./' + blinker.config.sourcePath + '/' + blinker.config.svgSpriteDirectory + '/**/*.svg'],  blinker.gulp.series('svg:sprite'));
    blinker.gulp.watch(['./' + blinker.config.sourcePath + '/' + blinker.config.svgInlineSpriteDirectory + '/**/*.svg'],  blinker.gulp.series('svg:inline'));
  });
};