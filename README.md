

> compile NODE_ENV variables.


## Installation

### Node.js

`gulp-env-vars` is available on [npm](http://npmjs.org) or [yarn](https://yarnpkg.com).

    $ yarn add gulp-env-vars --dev
    
    $ npm install gulp-env-vars --save-dev

## Usage

### a. gulpfile.js

```js
    const { argv } = require('argvs');
    const gulp = require('gulp');
    const EnvVars = require('gulp-env-vars');
    const conf = require('./env.config')[argv.conf || 'development'];
    if (!conf) {
        console.log('\n', 'config not found...', '\n');
        console.log('-conf：', argv.conf);
        process.exit(0);
    }
    console.log('\n', 'current conf:', conf, '\n');

    gulp.task('default', function() {
      return gulp.src(['src/**/*.html', 'src/**/*.js'])
      .pipe(EnvVars(conf))
      .pipe(gulp.dest('dist/'))
    });

```



### b. env.conig.js

```js
  const DEFAULTS = {
    DOCUMENT_TITLE: 'demo',
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
```

### c. index.html

```html
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <meta name="renderer" content="webkit">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <meta name="format-detection" content="email=no">
  <meta name="format-detection" content="telephone=no">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title><% = process.env.DOCUMENT_TITLE %></title>
  <meta name="author" content="Jack.Chan">
  <meta name="description" content="<% = process.env.DOCUMENT_DESCRIPTION %>">
  <meta name="keywords" content="<% = process.env.DOCUMENT_KEYWORDS %>">
  </head>
  <body>
    <h1>use: <% = process.env.XXX %>;</h1>
	  <h1><% = process.env.DOCUMENT_TITLE %></h1>
	  <h2><% = process.env.NOT_FOUND %></h2>
	  <h3><% = undefined %></h3>
	  <hr>
	  <h1>use: {{ process.env.XXX }} / {{ :process.env.XXX }}</h1>
	  <h1>{{ process.env.DOCUMENT_TITLE }}</h1>
	  <h2>{{ process.env.NOT_FOUND }}</h2>
	  <h3>{{ undefined }}</h3>
	  <hr>
	  <h2>current env is: <% = process.env.HELLO %> <small>build time: <%=process.env.BUILD_TIME%></small></h2>
  <script type="text/javascript" src="index.js"></script>
  </body>
  </html>

```

### d. index.js

```js
alert('process.env.HELLO');
alert('process.env.HELLOX');
document.write('<p style="color:red;">current env is: process.env.HELLO <small>build time: process.env.BUILD_TIME</small></p>');

```


## License

(The MIT License)

Copyright (c) 2013 Jack.Chan <fulicat@qq.com> (http://fulicat.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.