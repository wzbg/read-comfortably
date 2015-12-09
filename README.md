# read-comfortably

> turns any web page into a clean view for reading.

This module is based on arc90's readability project.

## Example

[Before](http://amandahelloseedtest-us.oss-us-west-1.aliyuncs.com/html/55f3a38fca2ef39c272da827) -> [After](http://amandahelloseedtest-us.oss-us-west-1.aliyuncs.com/main/55f3a38fca2ef39c272da827)

## Install

```
$ npm install --save read-comfortably
```

Note that as of our 2.0.0 release, this module only works with Node.js >= 4.0. In the meantime you are still welcome to install a release in the 1.x series(by `npm install node-comfortably@1`) if you use an older Node.js version.

## Usage

`Promise read(html [, options])`

Where

  * **html** url or html code.
  * **options** is an optional options object
  * **Promise** is the return to run - `read(..).then(..)`

Example
```javascript
const read = require('read-comfortably');
const fs = require('fs');
const start = new Date();
read('http://abduzeedo.com/einsteins-theory-general-relativity-turns-100-video').then(
  result => {
    const { res, article } = result;
    console.log('res:', res); // Response Object from fetchUrl Lib
    console.log('dom:', article.dom); // DOM
    console.log('title:', article.title); // Title
    console.log('desc:', article.getDesc(300)); // Description Article
    article.images.then(images => console.log('images:', images)); // Article's Images
    fs.writeFile('test/article.html', article.html, err => { // HTML Source Code
      if (err) return console.error('error:', err);
      console.log('article(%d) is saved!', article.html.length, new Date() - start);
    });
    fs.writeFile('test/content.html', article.content, err => { // Main Article
      if (err) return console.error('error:', err);
      console.log('content(%d) is saved!', article.content.length, new Date() - start);
    });
    const sources = [
      { selector: 'script[src]', attr: 'async', val: 'async' },
      { selector: 'link[rel="stylesheet"]', attr: 'href', tag: 'style' }
    ];
    article.getHtmls(sources).then(
      htmls => { // HTML Source Code by replace css files
        fs.writeFile('test/sources.html', htmls, err => {
          if (err) return console.error('error:', err);
          console.log('sources(%d) is saved!', article.html.length, new Date() - start);
        })
      }
    );
    article.iframes.then(
      iframes => { // Article's Iframes
        iframes.forEach((iframe, index) => {
          fs.writeFile('test/iframe/' + index + '.html', iframe.buf, err => {
            if (err) return console.error('error:', err);
            console.log('%s(%d) is saved!', iframe.url, index, new Date() - start);
          });
        });
      }
    );
  },
  err => console.error(err)
);
```

## Options

read-comfortably will pass the options to [fetchUrl](https://github.com/andris9/fetch) directly.
See fetchUrl lib to view all available options.

read-comfortably has twelve additional options:

- `urlprocess` which should be a function to check or modify url before passing it to readability.

options.urlprocess = callback(url, options);
```javascript
read(
  url,
  {
    urlprocess: (url, options) => {
      //...
    }
  }
);
```

- `preprocess` which should be a function to check or modify downloaded source before passing it to readability.

options.preprocess = callback($, options);
```javascript
read(
  url,
  {
    preprocess: ($, options) => {
      //...
    }
  }
);
```

- `postprocess` which should be a function to check or modify article content after passing it to readability.

options.postprocess = callback(node, $);
```javascript
read(
  url,
  {
    postprocess: (node, $) => {
      //...
    }
  }
);
```

- `asyncprocess` which should be a function to async check or modify downloaded source before passing it to readability.

options.asyncprocess = callback(url, options);
```javascript
read(
  url,
  {
    asyncprocess: (url, options) => {
      return new Promise((resolve, reject) => {
        //...
        resolve(..);
      });
    }
  }
);
```

- `afterToRemove` which allow set your own nodes to remove array for tags after grabArticle function.

options.afterToRemove = array; (default ['script', 'noscript'])
```javascript
read(
  url,
  {
    afterToRemove: [
      'iframe',
      'script',
      'noscript'
    ]
  }
);
```

- `nodesToRemove` which allow set your own nodes to remove array for tags.

options.nodesToRemove = array;
```javascript
read(
  url,
  {
    nodesToRemove: [
      'meta',
      'aside',
      'style',
      'object',
      'iframe',
      'script',
      'noscript'
    ]
  }
);
```

- `noChdToRemove` which allow set your own nodes to remove array when it no children for tags.

options.noChdToRemove = array; (default ['div'])
```javascript
read(
  url,
  {
    noChdToRemove: [
      'div',
      'li'
    ]
  }
);
```

- `considerDIVs` true for turn all divs that don't have children block level elements into p's.

options.considerDIVs = boolean; (default false)
```javascript
read(
  url,
  {
    considerDIVs: true
  }
);
```

- `nodesToScore` which allow set your own nodes to score array for tags.

options.nodesToScore = array; (default ['p', 'article'])
```javascript
read(
  url,
  {
    nodesToScore: ['p', 'pre']
  }
);
```

- `nodesToAppend` which allow set your own nodes to append array for tags.

options.nodesToAppend = array; (default ['p'])
```javascript
read(
  url,
  {
    nodesToAppend: ['pre']
  }
);
```

- `maybeImgsAttr` which allow set your own maybe image's attributes.

options.maybeImgsAttr = array; (default ['src', 'href'])
```javascript
read(
  url,
  {
    maybeImgsAttr: ['src', 'data-src']
  }
);
```

- `hostnameParse` which allow you to convert to another hostname.

options.hostnameParse = object;
```javascript
read(
  url,
  {
    hostnameParse = { 'www.google.com': 'www.google.com.hk' }
  }
);
```

## article object

If html is an image, article is a buffer.

Else

### content

The article content of the web page.

### title

The article title of the web page. It's may not same to the text in the `<title>` tag.

### html

The original html of the web page.

### dom
The document of the web page generated by jsdom. You can use it to access the DOM directly(for example, `article.document.getElementById('main')`).

### getDesc(length)

The article description of the web page.

### iframes

The article content's iframes of the web page.

### images

The article content's images of the web page.

### getHtmls(files)

The original html of the web page by replace specified file.

## res object

### status

HTTP status code

### responseHeaders

response headers

### finalUrl

last url value, useful with redirects

### redirectCount

how many redirects happened

### cookieJar

CookieJar object for sharing/retrieving cookies

## Why not JSDOM

Before starting this project I used jsdom, but the dependencies of that project plus the slowness of JSDOM made it very frustrating to work with. The compiling of contextify module (dependency of JSDOM) failed 9/10 times. And if you wanted to use it with node-webkit you had to manually rebuild contextify with nw-gyp, which is not the optimal solution.

So I decided to write my own version of Arc90's Readability using the fast Cheerio engine with the least number of dependencies.

The Usage of this module is similiar to JSDOM, so it's easy to switch.

The lib is using Cheerio engine because it can converted url to utf-8 automatically.

## Contributors

https://gitlab.com/unrealce/read-comfortably

https://github.com/wzbg/read-comfortably

## Related
- [`cheerio`](https://www.npmjs.com/package/cheerio) - Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.
- [`fetch-promise`](https://www.npmjs.com/package/fetch-promise) - Fetch URL contents By Promise.
- [`image-size`](https://www.npmjs.com/package/image-size) - get dimensions of any image file.
- [`is-image-url`](https://www.npmjs.com/package/is-image-url) - Check if a url is an image.
- [`is-pdf`](https://www.npmjs.com/package/is-pdf) - Check if a Buffer/Uint8Array is a 7ZIP file.
- [`is-url`](https://www.npmjs.com/package/is-url) - Check whether a string is a URL.
- [`log4js`](https://www.npmjs.com/package/log4js) - Port of Log4js to work with node.
- [`string`](https://www.npmjs.com/package/string) - string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.
- [`url`](https://www.npmjs.com/package/url) - The core url packaged standalone for use with Browserify.

## License

The MIT License (MIT)

Copyright (c) 2015 - 2016