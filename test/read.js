var fs = require('fs');

var read = require('../src/index.js');

// var url = 'http://www.engadget.com/2015/08/20/the-agonizingly-slow-decline-of-adobe-flash-player/?ncid=rss_semi';
// var url = 'http://www.forbes.com/sites/chunkamui/2015/08/21/google-is-millions-of-miles-ahead-of-apple-in-driverless-cars/';
var url = 'http://www.theguardian.com/artanddesign/2015/aug/22/tate-sensorium-art-soundscapes-chocolates-invisible-rain';

var nodesToRemove = [ // 需要删除的标签
  'meta', // 元数据
  'link', // 样式链接
  'aside', // 旁白
  'style', // 样式
  'video', // 视频
  'input', // 输入框
  'button', // 按钮
  'object', // 对象
  'iframe', // 内嵌模块
  'script', // 脚本
  'noscript', // 非脚本
  'div.articleSM', // 分享模块
  'ins.adsbygoogle', // 谷歌广告
  '.robots-nocontent' // 非内容模块
];

read(
  url,
  {
    nodesToRemove: nodesToRemove
  },
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