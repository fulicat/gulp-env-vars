/*
* gulpfile.js
* @Author: Jack.Chan (971546@qq.com)
* @Date:   2019-10-16 14:42:09
* @Last Modified by:   Jack.Chan
* @Last Modified time: 2019-10-16 15:00:40
* @version v1.0
*/

const { argv } = require('argvs');
const gulp = require('gulp');

const EnvVars = require('../index');

const ENV_CONFIG = require('./env.config')[argv.conf || 'development'];
if (!ENV_CONFIG) {
	console.log('\n', 'config not found...', '\n');
	process.exit(0);
}
console.log('\n', 'current conf:', argv.conf, '\n');

gulp.task('default', function() {
	return gulp.src(['src/**/*.html', 'src/**/*.js'])
	.pipe(EnvVars(ENV_CONFIG))
	.pipe(gulp.dest('dist/'))
});