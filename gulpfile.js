const { src, dest, parallel, series, watch } = require('gulp');
// const pug = require('gulp-pug'); // Pug default view template
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browsersync = require('browser-sync');

// SCSS bundled into CSS task
function css() {
	return (
		src('./sass/**/*.scss')
			.pipe(sourcemaps.init())
			// Stay live and reload on error
			.pipe(
				plumber({
					handleError: function(err) {
						console.log(err);
						this.emit('end');
					},
				})
			)
			.pipe(
				sass({
					// outputStyle: 'compressed',
				}).on('error', function(err) {
					console.log(err.message);
					// sass.logError
					this.emit('end');
				})
			)
			//.pipe(minifyCSS())
			.pipe(concat('style.css'))
			.pipe(sourcemaps.write('.'))
			.pipe(dest('./'))
	);
}

// BrowserSync
function browserSync() {
	browsersync({
		server: {
			baseDir: './',
		},
		notify: false,
		browser: 'firefox',
		// proxy: "0.0.0.0:5000"
	});
}

// BrowserSync reload
function browserReload() {
	return browsersync.reload;
}

// Watch files
function watchFiles() {
	// Watch SCSS changes
	watch('./sass/**/*.scss', parallel(css)).on('change', browserReload());
}

const watching = parallel(watchFiles, browserSync);

exports.css = css;
exports.default = parallel(css);
exports.watch = watching;
