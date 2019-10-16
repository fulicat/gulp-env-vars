'use strict';
/*
* gulp-env-vars.js
* @Author: Jack.Chan (971546@qq.com)
* @Date:   2019-10-16 14:39:30
* @Last Modified by:   Jack.Chan
* @Last Modified time: 2019-10-16 15:47:43
* @website http://fulicat.com
* @version v1.0.0
*/

const through2 = require('through2');

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
			contents = contents.replace(/<%([^%>]+)?%>/g, function(match, key) {
				key = key.replace('=', '');
				key = key.replace(';', '');
				key = key.replace('process.env.', '');
				key = key.trim();
				return vars[key]!==undefined ? vars[key] : '';
			});
			contents = contents.replace(/process\.env\.([\w]+)/g, function(match, key) {
				key = key.trim();
				return vars[key] ? vars[key] : match;
			});
			file.contents = new Buffer.from(contents);
		}
		callback(null, file);
	});
}