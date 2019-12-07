/*
* gulpfile.js for test
* @Author: Jack.Chan (971546@qq.com)
* @Date:   2019-10-16 14:42:09
* @Last Modified by:   Jack.Chan
* @Last Modified time: 2019-12-08 00:18:40
* @version v1.0.1
*/

const { argv } = require('argvs');
const gulp = require('gulp');

const EnvVars = require('../index');

const conf = require('./env.config')[argv.conf || 'development'];
if (!conf) {
    console.log('\n', 'config not found...', '\n');
    console.log('\n', '-conf：', argv.conf);
    console.log('\n');
    process.exit(0);
}
console.log('\n', 'current conf:');
console.log(JSON.stringify(conf, null, 4));
console.log('\n');

gulp.task('default', function() {
  return gulp.src(['src/**/*.html', 'src/**/*.js'])
  .pipe(EnvVars(conf))
  .pipe(gulp.dest('dist/'))
});