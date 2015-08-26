var fs = require('fs');

var read = require('../src/index.js');

// var url = 'https://roadtrippers.com/stories/welcome-to-chloride-ghost-town-arizonas-most-offbeat-roadside-attraction?lat=40.83044&#x26;lng=-96.70166&#x26;z=5';
// var url = 'http://www.huffingtonpost.com/entry/man-buns-of-disneyland-instagram_55d7157fe4b00d8137eddf56?kvcommref=mostpopular';
// var url = 'http://www.huffingtonpost.com/entry/back-to-school-pinterest-trends_55d24403e4b07addcb43bbc0?kvcommref=mostpopular';
// var url = 'http://www.forbes.com/sites/chunkamui/2015/08/21/google-is-millions-of-miles-ahead-of-apple-in-driverless-cars/';
// var url = 'http://www.npr.org/sections/alltechconsidered/2015/08/24/434313813/why-phone-fraud-starts-with-a-silent-call';
// var url = 'http://www.theguardian.com/artanddesign/2015/aug/22/tate-sensorium-art-soundscapes-chocolates-invisible-rain';
// var url = 'http://www.engadget.com/2015/08/20/the-agonizingly-slow-decline-of-adobe-flash-player/?ncid=rss_semi';
// var url = 'http://cdn.flipboard.com/content/thephotodesk/thephotodeskgalleries/items/1440433775000.html';
// var url = 'http://9to5mac.com/2015/08/25/idc-china-slowdown-smartphone-forecast-iphone-6c/';
// var url = 'http://www.mymodernmet.com/profiles/blogs/anna-di-prospero-urban-self-portraits';
// var url = 'http://www.demilked.com/more-lego-miniature-adventures-sofiane-samlal-samsofy/';
// var url = 'http://www.juxtapoz.com/illustration/the-surreal-world-of-fabien-merelle';
// var url = 'http://www.mymodernmet.com/profiles/blogs/before-and-after-shots-of-jogg';
// var url = 'http://hypebeast.com/2015/8/banksy-talks-dismaland-and-contemporary-art';
// var url = 'http://lifehacker.com/what-to-do-when-you-envy-a-coworker-1682581675';
// var url = 'http://www.takepart.com/article/2015/08/20/global-dietary-guidelines';
// var url = 'http://time.com/4007174/which-spouse-asks-for-divorce/';
// var url = 'http://fortune.com/2015/08/20/airbnb-tesla-partner/';

var url = 'http://edition.cnn.com/2015/08/13/travel/korea-food-map/index.html/';

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
  'div.articleSM', // 分享模块
  'div.fout_guard', // fout守卫
  'div.buttonGroup', // 按钮组
  'div.itemRelated', // 相关文章
  'ins.adsbygoogle', // 谷歌广告
  'div.comments-main', // 评论
  '.robots-nocontent', // 非内容模块
  'header,#header,.header' // 头部信息
];

read(
  url,
  {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.132 Safari/537.36' },
    nodesToRemove: nodesToRemove
  },
  function (err, article, res) {
    if (err) {
      console.log('error:', err);
      return;
    }
    if (!article) {
      console.log('Empty article:', article);
      return;
    }
    console.log('response:', res);
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
    
  }
);