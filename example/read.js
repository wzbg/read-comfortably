var read = require('../src/index.js');

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
 
  // Article's Images 
  article.getImages(function (err, images) {
    console.log(images);
  });
 
  // HTML Source Code by replace css files 
  article.getHtmls([ { selector: 'link[rel="stylesheet"]', attr: 'href', tag: 'style' } ], function (err, html) {
    console.log(html);
  });
});