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
    console.log('document:', article.dom); // DOM
    console.log('html:', article.html); // HTML Source Code
    console.log('title:', article.title); // Title
    console.log('content:', article.content); // Main Article
    article.close();
  }
);