/* 
* @Author: zyc
* @Date:   2015-11-29 19:40:00
* @Last Modified by:   zyc
* @Last Modified time: 2015-12-27 21:14:27
*/
'use strict';

const fs = require('fs');

const read = require('./src/read');

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