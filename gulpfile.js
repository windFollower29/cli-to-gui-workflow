
const gulp = require('gulp')
const browserify = require('browserify')
const watchify = require('watchify')
const source = require('vinyl-source-stream')
const rename = require('gulp-rename')
const es = require('event-stream')
const glob = require('glob')
var gutil = require('gulp-util')

const spwan = require('child_process').spawn

const BUILD_DIR =  'dist'
const jsFiles = './js/**/*.js'

function bundle (b, entry) {

  // return b.transform('babelify', {
  //   presets: [
  //     '@babel/preset-env'
  //   ]
  // })
  // .bundle()
  // .on('error', function (err) {
  //   gutil.log(err.message)
  //   this.emit('end')
  // })
  // .pipe(source(entry))
  // .pipe(rename({

  // }))
  // .pipe(gulp.dest(BUILD_DIR))

  return b.transform('babelify')
    .bundle()
    .on('error', function (err) {
      gutil.log(err.message)
      this.emit('end')
    })
    .pipe(source(entry))
    .pipe(rename({

    }))
    .pipe(gulp.dest(BUILD_DIR))

}

gulp.task('js', cb => {
// console.log('jsjssjs')
  glob('./js/**/*.js', (err, files) => {

    if (err) cb(err)

    let tasks = files.map(function (entry) {

      const b = browserify({
        entries: [entry],
        plugin: [watchify]
      })

      b.on('update', bundle.bind(null, b, entry))

      return bundle(b, entry)

    })

    return es.merge(tasks)
      .on('end', cb)
  })
})

// 修改gulpfile重启任务
gulp.task('gulp-reload', cb => {

  let p

  function spawnChildren (e) {
    p && p.kill()

    p = spwan('gulp', ['js'], { stdio: 'inherit' })
  }

  gulp.watch('gulpfile.js', spawnChildren)

  spawnChildren()
})

gulp.task('default', ['gulp-reload'])
