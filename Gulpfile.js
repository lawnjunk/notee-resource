var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var paths = {
  server: ['./*.js', './lib/**/*.js', './model/**/*.js', './routes/**/*.js'],
  client: []
}

gulp.task('nodemon', function(){
  nodemon({script: './server.js', ext: 'js'});
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
}
  gulp.src(paths.server).pipe(jshint(options)).pipe(jshint.reporter(stylish)); 
});


gulp.task('watch', function(){
  gulp.watch(paths.server, ['lint']);
});

gulp.task('default', ['lint']);
