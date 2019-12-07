/*
* env.config.js for test
* @Author: Jack.Chan (971546@qq.com)
* @Date:   2019-10-16 14:43:01
* @Last Modified by:   Jack.Chan
* @Last Modified time: 2019-10-16 15:20:48
* @version v1.0
*/

const DEFAULTS = {
	DOCUMENT_TITLE: 'demo: gulp-env-vars',
	DOCUMENT_DESCRIPTION: 'gulp-env-vars',
	DOCUMENT_KEYWORDS: 'gulp-env-vars, gulp env vars, gulp, env, vars',
	BUILD_TIME: (new Date()).toLocaleString('en-US', {hour12: false})
}

module.exports = {
	development: {
		...DEFAULTS,
		HELLO: 'development'
	},
	test: {
		...DEFAULTS,
		HELLO: 'test'
	},
	production: {
		...DEFAULTS,
		HELLO: 'production'
	}
}