var fs = require('fs');

var read = require('../src/index.js');

var url = 'http://www.engadget.com/2015/08/20/the-agonizingly-slow-decline-of-adobe-flash-player/?ncid=rss_semi';

read(
  url,
  function (err, article) {
    if (err) {
      console.log('error:', err);
      return;
    }
    if (!article) {
      console.log('Empty article:', article);
      return;
    }
    console.log('document:', article.dom);
    console.log('title:', article.title);
    console.log('desc:', article.getDesc(300));
    fs.writeFile('article.html', article.html, function (err) {
      if (err) {
        console.log('error:', err);
        return;
      }
      console.log('article is saved!');
    });
    fs.writeFile('content.html', article.content, function (err) {
      if (err) {
        console.log('error:', err);
        return;
      }
      console.log('content is saved!');
    });
    article.close();
  }
);