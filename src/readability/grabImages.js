/**
 *  日志
 *  trace 跟踪
 *  debug 调试
 *  info  信息
 *  warn  警告
 *  error 错误
 *  fatal 致命
 */
var log4js = require('log4js'); // Port of Log4js to work with node
var logger = log4js.getLogger('grabImages');
logger.setLevel('FATAL');
// logger.setLevel('DEBUG');

/**
 *  Fetch url contents.
 *  Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
 */
var fetchUrl = require('fetch').fetchUrl;

/**
 *  grab tht article content's images
 *  @param Element
 *  @param $
 *  @return callback(error, images)
 *  @return void
 */
var grabImages = function (node, $, callback) {
  var images = [];
  var imgs = $(node).find('img');
  var count = imgs.length;
  imgs.each(function (index, element) {
    var img = $(element);
    var use = img.attr('use');
    var link = img.attr(use);
    if (link) { // image -> buffer
      fetchUrl(link, function (err, res, buf) {
        var errMsg; // error message
        if (err) {
          logger.error('');
          return;
        }
        if (res.status != 200) {
          logger.error('');
          return;
        }
        if (!buf) {
          logger.error('');
          return;
        }

        var errMsg; // error message
        if (err) {
          errMsg = 'fetch url[' +  url + '] error:' + err;
        } else if (resp.status != 200) {
          errMsg = 'fetch url[' +  url + '] status:' + res.status;
        } else if (!body) {
          errMsg = 'fetch url[' +  url + '] Empty body';
        }
        if (errMsg && !encode) { // 遇到以上错误
          downloadImage(encodeURI(url), id, width, height, true); // 尝试编码再下载一次
          pmx.notify({ event: 'fetch url', error: errMsg });
          logger.error(errMsg);
          return;
        }

        if (!--count) {
          callback(null, images);
          return;
        }
      });
    }
  });
  return images;
};

module.exports = grabImages;