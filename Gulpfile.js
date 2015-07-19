var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var exec = require('child_process').exec;

var paths = {
  server: ['./*.js', './lib/**/*.js', './model/**/*.js', './route/**/*.js'],
  serverTest: ['./test/*-test.js'],
  client: [],
};

gulp.task('nodemon:start', function(){
  nodemon({script: './server.js', ext: 'js'});
});

gulp.task('gulp:stop', function(){
  exec('killall gulp');
});

gulp.task('mongo:start', function(){
  var md = exec('mongod --dbpath=db &', function(err, stdout, stderr){
    if (err) {
      console.error(err);
    }
  });
});

gulp.task('mongo:stop', function(done){
  exec('mongo admin --eval "db.shutdownServer();"');
});


gulp.task('test:server', function(){
  var options = { 
    reporter: 'nyan',
    captureFile: false,
    quiet: false,
    clearRequireCache: false
  };
  return gulp.src(paths.serverTest, {read: false})
    .pipe(mocha(options));
});

gulp.task('lint', function(){
  var options = {
	"node": true,
	"globals": {
		"describe": true,
		"it": true,
		"before": true,
		"after": true,
		"beforeEach": true,
		"afterEach": true
    }
  };
  gulp.src(paths.server).pipe(jshint(options)).pipe(jshint.reporter(stylish)); 
});


gulp.task('watch:lint', function(){
  gulp.watch(paths.server, ['lint']);
});

gulp.task('watch:lul', function(){
  gulp.watch(paths.server, function(){
    console.log('hey sup?');
  });
});

gulp.task('server:devup', ['mongo:start', 'nodemon:start']);
gulp.task('server:devdown', ['mongo:stop','gulp:stop']);

gulp.task('default', ['lint']);
