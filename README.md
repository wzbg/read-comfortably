# read-comfortably

> turns any web page into a clean view for reading.

This module is based on arc90's readability project.

## Example

[Before](http://amandahelloseedtest-us.oss-us-west-1.aliyuncs.com/html/55f3a38fca2ef39c272da827) -> [After](http://amandahelloseedtest-us.oss-us-west-1.aliyuncs.com/main/55f3a38fca2ef39c272da827)

## Install

```
$ npm install --save read-comfortably
```

## Usage

`read(html [, options], callback)`

Where

  * **html** url or html code.
  * **options** is an optional options object
  * **callback** is the callback to run - `callback(error, article, meta)`

Example
```javascript
var read = require('read-comfortably');

read('http://howtonode.org/really-simple-file-uploads', function(err, article, meta) {
  // Main Article
  console.log(article.content);
  // Title
  console.log(article.title);

  // HTML Source Code
  console.log(article.html);
  // DOM
  console.log(article.document);

  // Description Article
  console.log(article.getDesc(300));

  // Response Object from fetchUrl Lib
  console.log(meta);

  // Article's Iframes
  article.getIframes(function (err, iframes) {
    console.log(iframes);
  });

  // Article's Images
  article.getImages(function (err, images) {
    console.log(images);
  });

  // HTML Source Code by replace css files
  article.getHtmls([ { selector: 'link[rel="stylesheet"]', attr: 'href', tag: 'style' } ], function (err, html) {
    console.log(html);
  });
});
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
    urlprocess: function(url, options) {
      //...
    }
  },
  function(err, article, meta) {
    //...
  }
);
```

- `preprocess` which should be a function to check or modify downloaded source before passing it to readability.

options.preprocess = callback($, options);
```javascript
read(
  url,
  {
    preprocess: function($, options) {
      //...
    }
  },
  function(err, article, meta) {
    //...
  }
);
```

- `postprocess` which should be a function to check or modify article content after passing it to readability.

options.postprocess = callback(node, $);
```javascript
read(
  url,
  {
    postprocess: function(node, $) {
      //...
    }
  },
  function(err, article, meta) {
    //...
  }
);
```

- `asyncprocess` which should be a function to async check or modify downloaded source before passing it to readability.

options.asyncprocess = callback(url, options, callback);
```javascript
read(
  url,
  {
    asyncprocess: function(url, options, callback) {
      //...
    }
  },
  function(err, article, meta) {
    //...
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
  },
  function(err, article, meta) {
    //...
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
  },
  function(err, article, meta) {
    //...
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
  },
  function(err, article, meta) {
    //...
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
  },
  function(err, article, meta) {
    //...
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
  },
  function(err, article, meta) {
    //...
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
  },
  function(err, article, meta) {
    //...
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
  },
  function(err, article, meta) {
    //...
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
  },
  function(err, article, meta) {
    //...
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

### getIframes(callback)

The article content's iframes of the web page.

### getImages(callback)

The article content's images of the web page.

### getHtmls(files, callback)

The original html of the web page by replace specified file.

## meta object

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
- [`fetch`](https://www.npmjs.com/package/fetch) - Fetch url contents. Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
- [`image-size`](https://www.npmjs.com/package/image-size) - get dimensions of any image file.
- [`is-image-url`](https://www.npmjs.com/package/is-image-url) - Check if a url is an image.
- [`is-pdf`](https://www.npmjs.com/package/is-pdf) - Check if a Buffer/Uint8Array is a 7ZIP file.
- [`is-url`](https://www.npmjs.com/package/is-url) - Check whether a string is a URL.
- [`log4js`](https://www.npmjs.com/package/log4js) - Port of Log4js to work with node.
- [`string`](https://www.npmjs.com/package/string) - string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.
- [`url`](https://www.npmjs.com/package/url) - The core url packaged standalone for use with Browserify.

## License

The MIT License (MIT)

Copyright (c) 2015