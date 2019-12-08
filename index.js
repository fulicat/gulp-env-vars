'use strict';
/*
* gulp-env-vars.js
* @Author: Jack.Chan (971546@qq.com)
* @Date:   2019-10-16 14:39:30
* @Last Modified by:   Jack.Chan
* @Last Modified time: 2019-12-08 13:56:29
* @website http://fulicat.com
* @version v1.0.3
*/

const through2 = require('through2');

const isProcessEnvKey = function(key) {
	key = (''+key).toString().replace(/[=|;\s]/g, '');
	var regexp = /((^:{0,1})process\.env\.[\w]+)/;
	return regexp.test(key);
}
const getProcessEnvKey = function(key) {
	var matchs = key.match(/(\:{0,1})process\.env\.([\w]+)/);
	if (matchs.length > 2) {
		return matchs[2];
	}
	return null;
}
const parseProcessEnv = function(vars, key, defaultValue) {
	defaultValue = typeof(defaultValue) === 'undefined' ? '' : defaultValue;
	key = (''+key).toString().replace(/[=|;\s]/g, '');
	if (key.substr(0, 1) !== ':') {
		if (typeof(vars) === 'object' && key && key.length) {
			if (isProcessEnvKey(key)) {
				key = getProcessEnvKey(key);		
				if (key && key !== null && key !== undefined) {
					if (defaultValue.substr(0, 2) === '{{' && defaultValue.substr(-2) === '}}') {
						defaultValue = '';
					}
					defaultValue = vars[key] !== undefined ? vars[key] : defaultValue;
				}
			}
		}	
	}
	return defaultValue;
}

module.exports = function(vars) {
	const PLUGIN_NAME = 'gulp-env-vars';
	const typeOf = function(object) {
		return Object.prototype.toString.call(vars).replace(/\[object (.*)\]/g, '$1').toLowerCase();
	}
	vars = typeOf(vars)==='object' ? vars : false;
	return through2.obj(function(file, encoding, callback) {
		if (!vars) {
			this.push(file);
			return callback();
		}
		if (file.isNull()) {
			this.push(file);
			return callback();
		}
		if (file.isStream()) {
			console.log('\nWARNING:', PLUGIN_NAME, 'Streaming not supported');
			this.push(file);
			return callback();
		}
		if (file.isBuffer()) {
			var contents = file.contents.toString('utf-8');
			contents = contents.replace(/\{\{([^\}]+)\}\}/g, function(match, key) {
				return parseProcessEnv(vars, key, match);
			});
			contents = contents.replace(/<%([^%>]+)?%>/g, function(match, key) {
				return parseProcessEnv(vars, key, match);
			});
			if (file.extname==='.js' || file.extname==='.jsx' || file.extname==='.vue') {
				contents = contents.replace(/((\:{0,1})process\.env\.[\w]+)/g, function(match, key) {
					return parseProcessEnv(vars, key, match);
				});	
			}
			contents = contents.replace(/((\:{0,1})process\.env\.[\w]+)/g, function(match, key) {
				return match.replace(/\:process\.env\./g, 'process\.env\.');
			});
			file.contents = new Buffer.from(contents);
		}
		callback(null, file);
	});
}