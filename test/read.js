/* 
* @Author: zyc
* @Date:   20151204 11:18:10
* @Last Modified by:   zyc
* @Last Modified time: 20151204 11:22:13
*/
'use strict';

const fs = require('fs');

const read = require('../src/index');

// const url = 'http://www.engadget.com/2015/12/03/nintendo-super-moschino-collection/';
// const url = 'http://www.engadget.com/2015/12/03/rumor-apple-has-an-updated-4-inch-iphone-due-early-next-year/';

const userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g';

const nodesToRemove = [
  'div.o-aside-posts',
  'div.th-reverse',
];

const start = new Date();
read(url, { headers: { 'UserAgent': userAgent }, nodesToRemove }, (err, article, res) => {
  if (err) return console.error(err);
  if (res.status != 200) return console.error('status:', res.status);
  if (!article) return console.error('Empty article:', article);

  // console.log('res:', res); // Response Object from fetchUrl Lib
  console.log('contentType:', res.responseHeaders['content-type']);

  // console.log('dom:', article.dom); // DOM
  console.log('title:', article.title); // Title
  console.log('desc:', article.getDesc(300)); // Description Article

  fs.writeFile('article.html', article.html, err => { // HTML Source Code
    if (err) return console.error('error:', err);
    console.log('article(%d) is saved!', article.html.length, new Date() - start);
  });
  fs.writeFile('content.html', article.content, err => { // Main Article
    if (err) return console.error('error:', err);
    console.log('content(%d) is saved!', article.content.length, new Date() - start);
  });
});