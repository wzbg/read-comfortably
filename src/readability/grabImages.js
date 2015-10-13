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
var sizeOf = require('image-size'); // get dimensions of any image file.

/**
 *  grab tht article content's images
 *  @param Element
 *  @param $
 *  @param callback(error, images)
 *  @return void
 */
var grabImages = function (node, $, callback) {
  var imgs = $(node).find('img');
  var images = [];
  if (!imgs.length) {
    return callback(null, images);
  }
  imgs.each(function (index, element) {
    var img = $(element);
    var link = img.attr('src');
    if (link) { // image -> buffer
      fetchImage(link, images, imgs.length, callback);
    } else {
      return callback(new Error('Empty link'), images);
    }
  });
};

/**
 *  fetch tht article content's image
 *  @param string
 *  @param []
 *  @param callback(error, images)
 *  @return void
 */
var fetchImage = function (url, images, length, callback, encode) {
  fetchUrl(encode ? encodeURI(url) : url, function (err, res, buf) {
    var errMsg;
    if (err) {
      errMsg = 'fetch url[' + url + '] error:' + err;
    } else if (res.status != 200) {
      errMsg = 'fetch url[' + url + '] status:' + res.status;
    } else if (!buf) {
      errMsg = 'fetch url[' + url + '] Empty body';
    }
    if (errMsg) {
      logger.error(errMsg);
      if (!encode) {
        return fetchImage(url, images, length, callback, true);
      }
      return callback(new Error(errMsg), images);
    }
    var image = { url: url, buf: buf };
    if (res && res.responseHeaders) {
      image.imgType = res.responseHeaders['content-type'];
    }
    try {
      var dimensions = sizeOf(buf);
      if (dimensions) {
        image.width = dimensions.width;
        image.height = dimensions.height;
      }
    } catch (e) {
      logger.error('size of[%s] error:', url, e);
    }
    images.push(image);
    if (images.length == length) {
      logger.info('images:', images);
      callback(null, images);
    }
  });
};

module.exports = grabImages;