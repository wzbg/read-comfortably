var fs = require('fs');
var fetch = require('fetch');
var read = require('../src/index.js');

// var url = 'http://www.nytimes.com/2015/08/20/t-magazine/who-is-marc-jacobs.html?WT.nav=inside-nyt-region&action=click&module=inside-nyt-region&pgtype=Homepage&region=inside-nyt-region&version=Moth-Visible';
// var url = 'https://roadtrippers.com/stories/welcome-to-chloride-ghost-town-arizonas-most-offbeat-roadside-attraction?lat=40.83044&#x26;lng=-96.70166&#x26;z=5';
// var url = 'http://www.businessinsider.com.au/angellist-ceo-naval-ravikant-shares-his-favorite-books-2015-8#/#meditations-by-marcus-aurelius-1';
// var url = 'http://www.huffingtonpost.com/entry/man-buns-of-disneyland-instagram_55d7157fe4b00d8137eddf56?kvcommref=mostpopular';
// var url = 'http://www.huffingtonpost.com/entry/back-to-school-pinterest-trends_55d24403e4b07addcb43bbc0?kvcommref=mostpopular';
// var url = 'http://insidescoopsf.sfgate.com/blog/2015/08/18/our-favorite-restaurants-to-eat-for-cheap-around-uc-berkeley/';
// var url = 'http://www.npr.org/sections/alltechconsidered/2015/08/24/434313813/why-phone-fraud-starts-with-a-silent-call';
// var url = 'http://www.theguardian.com/artanddesign/2015/aug/22/tate-sensorium-art-soundscapes-chocolates-invisible-rain';
// var url = 'http://techcrunch.com/2015/08/25/youtube-gaming-its-twitch-competitor-set-to-launch-tomorrow/#.s1vcuu:j64V';
// var url = 'http://www.theverge.com/2015/8/25/9205915/amazon-prime-now-launches-seattle-redmond-bellevue-kirkland';
// var url = 'http://www.engadget.com/2015/08/20/the-agonizingly-slow-decline-of-adobe-flash-player/?ncid=rss_semi';
// var url = 'http://www.dazeddigital.com/music/article/26070/1/south-korea-just-trolled-north-korea-with-k-pop';
// var url = 'http://blogs.transparent.com/language-news/2015/08/26/staying-resourceful-in-language-learning/';
// var url = 'http://cdn.flipboard.com/content/thephotodesk/thephotodeskgalleries/items/1440433775000.html';
// var url = 'http://www.huffingtonpost.com/conde-nast-traveler/the-most-romantic-restaur_1_b_7977254.html';
// var url = 'https://blog.adafruit.com/2015/06/17/horses-get-blinky-rainbow-tails-wearablewednesday/';
// var url = 'http://www.engadget.com/2015/07/15/japans-first-robot-staffed-hotel/?%3Fncid=rss_full';
// var url = 'http://www.businessinsider.com/americas-20-most-expensive-cities-for-renters-2015-8';
// var url = 'http://www.demilked.com/mental-illnesses-disorders-drawn-real-monsters-toby-allen/';
// var url = 'http://9to5mac.com/2015/08/25/idc-china-slowdown-smartphone-forecast-iphone-6c/';
// var url = 'http://www.mymodernmet.com/profiles/blogs/anna-di-prospero-urban-self-portraits';
// var url = 'http://www.demilked.com/more-lego-miniature-adventures-sofiane-samlal-samsofy/';
// var url = 'http://www.apppicker.com/applists/4620/the-best-video-editing-apps-for-iphone';
// var url = 'http://news.moviefone.com/2015/08/27/best-summer-movies-all-time-ranked/';
// var url = 'http://www.juxtapoz.com/illustration/the-surreal-world-of-fabien-merelle';
// var url = 'http://www.mymodernmet.com/profiles/blogs/before-and-after-shots-of-jogg';
// var url = 'http://hypebeast.com/2015/8/banksy-talks-dismaland-and-contemporary-art';
// var url = 'http://lifehacker.com/what-to-do-when-you-envy-a-coworker-1682581675';
// var url = 'http://www.takepart.com/article/2015/08/20/global-dietary-guidelines';
// var url = 'http://edition.cnn.com/2015/08/13/travel/korea-food-map/index.html/';
// var url = 'http://www.businessinsider.com/work-in-groups-to-detect-lies-2015-8';
// var url = 'http://www.engadget.com/2015/08/26/sony-wireless-speaker-tv-remote/';
// var url = 'http://www.engadget.com/2015/08/26/obi-worldphones/?ncid=rss_semi';
// var url = 'http://www.thisiscolossal.com/2015/08/glass-fruit-elliot-walker/';
// var url = 'http://time.com/4007174/which-spouse-asks-for-divorce/';
// var url = 'http://fortune.com/2015/08/20/airbnb-tesla-partner/';
// var url = 'http://abduzeedo.com/ccaa-kids-character-design';
// var url = 'http://www.bbc.com/news/magazine-30450980';

// var url = 'http://www.forbes.com/sites/chunkamui/2015/08/21/google-is-millions-of-miles-ahead-of-apple-in-driverless-cars/';
// var url = 'http://www.wired.com/2015/08/reaction-housing-exo-shelter/';
// var url = 'http://www.mymodernmet.com/profiles/blogs/bibliobicicleta-pop-up-bicycle-library';
// var url = 'http://thoughtcatalog.com/kovie-biakolo/2015/08/13-things-that-definitely-happened-in-your-childhood-if-your-parents-were-college-professors/';
// var url = 'http://www.entrepreneur.com/article/249866';

// var url = 'http://www.dezeen.com/2015/08/30/decadrages-bedup-lifts-up-to-ceiling-when-not-in-use/';
// var url = 'http://www.seriouseats.com/2014/07/best-breakfast-sandwiches-america-usa.html';
// var url = 'http://petapixel.com/2015/08/28/heres-why-instagram-chose-to-break-the-frame/';
// var url = 'http://www.foxnews.com/tech/2015/08/30/5-details-shouldnt-give-facebook/';
// var url = 'http://www.demilked.com/detailed-food-art-spoon-ioana-vanc-romania/';
var url = 'http://www.mymodernmet.com/profiles/blogs/scott-herder-travels-from-the-monk-that-lives-in-my-phone';

var cookies = new fetch.CookieJar();
cookies.setCookie('NYT-S=1MV8ckDq5LmKiWV.m38YQ6ThyL0.sUyRAqqn72AbNyG57EzFMbTqAqbco9BPSkcIjNv63KVQkVAFgGr92n6XmLkhqLI.iCWGexReGeft6bZfc74hwCYxQr//QHdxuOyqnH/f3cbcflvjYK1yNKxqVry000');

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
  'div#page-title', // 页面标题
  'div.fb-box', // facebook
  'div.articleSM', // 分享模块
  'div.fout_guard', // fout 守卫
  'div.buttonGroup', // 按钮组
  'div.bn-mo-tests', // 测试模块
  'div.itemRelated', // 相关文章
  'div.ks-see-also', // 也可以看看
  'div.comments-main', // 评论
  'div.control-panel', // 控制面板
  'div.rail-collection-main', // rail 广告
  'div.gallery-overlay-outter', // 外部画廊
  'ins.adsbygoogle', // google 广告
  '.robots-nocontent', // 非内容模块
  'header,#header,.header', // 头部信息
  'footer,#footer,.footer' // 尾部信息
];

var maybeImgsAttr = [ // 可能是图片的属性
  'rel:bf_image_src',
  'data-src-medium',
  'data-src-small',
  'data-original',
  'data-lazy-src',
  'data-srcset',
  'data-medsrc',
  'data-smsrc',
  'data-lgsrc',
  'data-cfsrc',
  'data-src',
  'load-src',
  'href',
  'src'
];

var userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g';
// var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';

var start = new Date();
read(
  url,
  {
    headers: { 'User-Agent': userAgent },
    cookieJar: cookies,
    nodesToRemove: nodesToRemove,
    maybeImgsAttr: maybeImgsAttr
  },
  function (err, article, res) {
    if (err) {
      console.log('error:', err);
      return;
    }
    if (res.status != 200) {
      console.log('status:', res.status);
      return;
    }
    if (!article) {
      console.log('Empty article:', article);
      return;
    }
    // console.log('response:', res);
    // console.log('document:', article.dom);
    console.log('title:', article.title);
    console.log('desc:', article.getDesc(300));
    // article.getImages(function (err, images) {
    //   if (err) {
    //     console.log('error:', err);
    //     return;
    //   }
    //   console.log('images:', images);
    //   images.forEach(function (image) {
    //     console.log(image.url + ':' + image.buf.length);
    //   });
    // });
    article.getHtmls([ { selector: 'link[rel="stylesheet"]', attr: 'href', tag: 'style' } ], function (err, html) {
      if (err) {
        console.log('error:', err);
        return;
      }
      fs.writeFile('source.html', html, function (err) {
        if (err) {
          console.log('error:', err);
          return;
        }
        console.log('source is saved!', new Date() - start);
      });
    });
    fs.writeFile('article.html', article.html, function (err) {
      if (err) {
        console.log('error:', err);
        return;
      }
      console.log('article is saved!', new Date() - start);
    });
    fs.writeFile('content.html', article.content, function (err) {
      if (err) {
        console.log('error:', err);
        return;
      }
      console.log('content is saved!', new Date() - start);
    });
  }
);