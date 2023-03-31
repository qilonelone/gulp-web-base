const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const fileinclude = require('gulp-file-include')
const minifycss = require('gulp-minify-css')
const rev = require('gulp-rev')
const revcollector = require('gulp-rev-collector')
const clean = require('gulp-clean')
const connect = require("gulp-connect")


gulp.task('clean', function () {
  return gulp.src('./build/',{allowEmpty: true})
  .pipe(clean())
})

gulp.task('htmlmin', function () {
  return gulp.src('./src/pages/*.html')
  .pipe(fileinclude())
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./build')).pipe(revcollector({ 
    replaceReved:true,
    dirReplacements:{      
        '../assets/css':'./css'
    }
}))
.pipe(gulp.dest('./build'))
})

gulp.task('cssmin', function () {
  return gulp.src('./src/assets/css/*.css')
  .pipe(minifycss('*.css'))       
  .pipe(rev())                        
  .pipe(gulp.dest('./build/css'))
  .pipe(rev.manifest('rev-manifest-css.json')) 
  .pipe(gulp.dest('./build/rev'))
})


gulp.task('jsmin', function () {
  return gulp.src('./src/assets/js/*.js')   
  .pipe(rev())                     
  .pipe(gulp.dest('./build/js')) 
  .pipe(rev.manifest('rev-manifest-js.json')) 
  .pipe(gulp.dest('./build/rev'))
})


gulp.task('imgmin', function () {
  return gulp.src('./src/assets/img/*.*')
  .pipe(rev())     
	.pipe(gulp.dest('./build/img'))
  .pipe(rev.manifest('rev-manifest-img.json')) 
  .pipe(gulp.dest('./build/rev'))
})


gulp.task('htmlrev', function () {
  return gulp.src(['./build/rev/*.json','./build/*.html'])   
  .pipe(clean())
  .pipe(revcollector({
      replaceReved:true,
      dirReplacements:{      
        '../assets/css':'./css',
        '../assets/img':'./img',
        '../assets/js':'./js'
      }
  }))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./build'))
})

gulp.task('cssrev', function () {
  return gulp.src(['./build/rev/*.json','./build/css/*.css'])   
  .pipe(revcollector({
      replaceReved:true,
      dirReplacements:{ 
        '../img':'../img'
      }
  }))
  .pipe(gulp.dest('./build/css'))
})

gulp.task('default', gulp.series(['clean', 'imgmin', 'cssmin', 'jsmin', 'cssrev', 'htmlmin', 'htmlrev'], (done) => {
  gulp.src('./build/')
  .pipe(connect.reload())
  done();
}));

gulp.task('connect', function() {
  connect.server({  
    port: 8080,  
    lr: {},
    livereload: true,
    root: 'build',
    debug: true
  })
})


gulp.task('watch', function (done) {
  gulp.watch(['./src/assets/js/*.js'], gulp.series('default', (done) => {
    done();
  }))
  gulp.watch(['./src/assets/css/*.css'], gulp.series('default', (done) => {
    done();
  }))
  gulp.watch(['./src/assets/img/*.img'], gulp.series('default', (done) => {
    done();
  }))
  gulp.watch(['./src/pages/common/*.html'], gulp.series('default', (done) => {
    done();
  }))
  gulp.watch(['./src/pages/*.html'], gulp.series('default', (done) => {
    done();
  }))
  done()
});

gulp.task('server', gulp.parallel('connect', 'watch', (done) => {
  done();
}));