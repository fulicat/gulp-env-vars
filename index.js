'use strict';
/*
* gulp-env-vars.js
* @Author: Jack.Chan (971546@qq.com)
* @Date:   2019-10-16 14:39:30
* @Last Modified by:   Jack.Chan
* @Last Modified time: 2019-12-09 02:28:55
* @website http://fulicat.com
* @version v1.0.7
*/

const fs = require('fs');
const path = require('path');
const __basepath = process.cwd();

const through2 = require('through2');

const isProcessEnvInclude = function(key) {
	key = (''+key).toString().replace(/[=|;\s]/g, '');
	var regexp = /((^:{0,1})process\.env\.include+)/;
	return regexp.test(key);
}

const getProcessEnvIncludeSrc = function(key) {
	var matchs = key.match(/(\:{0,1})process\.env\.include(\([\'\"]?([^\'\"]*)[\'\"]?\))/);
	if (matchs && matchs.length > 3) {
		return matchs[3];
	}
	return null;
}

const getProcessEnvIncludeContents = function(src, callback) {
	let contents = '';
	if (src && typeof(src) === 'string') {
		let filePath = path.resolve(__basepath, src);
		try {
			contents = fs.readFileSync(filePath, 'utf8');
		} catch(ex) {
			console.log('\n', `Warn: process.env.include('${src}')`);
			console.log('', 'Warn: ENOENT: no such file or directory,');
			console.log('', `open '${filePath}'`, '\n');
		}
	}
	if (typeof(callback) === 'function') {
		callback(contents);
	}
	return contents;
}

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
const parseProcessEnv = function(vars, key, matched) {
	matched = (matched && typeof(matched) === 'string' ? matched : '');
	var value = matched;
	key = (''+key).toString().replace(/[=|;\s]/g, '');
	if (key && key.length > 1 && key.substr(0, 1) !== ':') {
		
		if (isProcessEnvInclude(key)) {
			let src = getProcessEnvIncludeSrc(key);
			if (src && src.length) {
				getProcessEnvIncludeContents(src, function(v) {
					value = v;
				});
			}
		} else if (isProcessEnvKey(key)) {
			let _key = getProcessEnvKey(key);
			if (_key && _key.length) {
				if (typeof(vars) === 'object') {
					value = vars[_key] !== undefined ? vars[_key] : matched;
				}
			}
		} else {

		}
		if (!value && matched.substr(0, 2) === '{{' && matched.substr(-2) === '}}') {
			value = '';
		}
	}
	return value;
}

module.exports = function(vars, options) {
	const defaults = {
		deepLevel: 3
	}
	options = Object.assign({}, defaults, options);
	options.deepLevel = isNaN(options.deepLevel) ? 3 : parseInt(options.deepLevel);

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
			for(var i=0; i<options.deepLevel;i++) {
				contents = contents.replace(/\{\{([^\}]+)\}\}/g, function(matched, key) {
					return parseProcessEnv(vars, key, matched);
				});
				contents = contents.replace(/<%([^%>]+)?%>/g, function(matched, key) {
					return parseProcessEnv(vars, key, matched);
				});
			}
			if (file.extname==='.js' || file.extname==='.jsx' || file.extname==='.vue') {
				contents = contents.replace(/((\:{0,1})process\.env\.[\w]+)/g, function(matched, key) {
					return parseProcessEnv(vars, key, matched);
				});	
			}
			contents = contents.replace(/((\:{0,1})process\.env\.[\w]+)/g, function(matched, key) {
				return matched.replace(/\:process\.env\./g, 'process\.env\.');
			});
			file.contents = new Buffer.from(contents);
		}
		callback(null, file);
	});
}