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
  var images = [];
  var imgs = $(node).find('img');
  imgs.each(function (index, element) {
    var img = $(element);
    var link = img.attr('src');
    if (link) { // image -> buffer
      fetchImage(link, images, imgs.length, callback);
    } else {
      return callback(new Error('Empty link'));
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
var fetchImage = function (url, images, length, callback) {
  fetchUrl(url, function (err, res, buf) {
    var errMsg; // error message
    if (err) {
      errMsg = 'fetch url[' +  url + '] error:' + err;
    } else if (res.status != 200) {
      errMsg = 'fetch url[' +  url + '] status:' + res.status;
    } else if (!buf) {
      errMsg = 'fetch url[' +  url + '] Empty body';
    }
    var image = { url: url };
    if (errMsg) {
      pmx.notify({ event: 'fetch url', error: errMsg });
      logger.error(errMsg);
    } else {
      image.imgType = res.responseHeaders['content-type'];
      var dimensions = sizeOf(buf);
      if (dimensions) {
        var width = image.imgWidth = dimensions.width;
        var height = image.imgHeight = dimensions.height;
        var size = calcSize(width, height, MIN_RATE, MAX_RATE); // 计算图片新尺寸
        image.width = size.width;
        image.height = size.height;
        image.x = size.x;
        image.y = size.y;
      }
    }
    images.push(image);
    if (images.length == length) {
      logger.info('images:', images);
      callback(null, images);
    }
  });
};

var MIN_RATE = 225 / 350; // 最小宽高比
var MAX_RATE = 225 / 160; // 最大宽高比
var calcSize = function (imgWidth, imgHeight, minRate, maxRate) { // 计算图片显示尺寸
  var size = { width: imgWidth, height: imgHeight, x: 0, y: 0, crop: false }; // 原图属性
  if (imgWidth && imgHeight) {
    var rate = imgWidth / imgHeight; // 图片实际宽高比
    if (rate < minRate) { // 小于最小宽高比
      size.height = imgWidth / minRate; // 截取最大高度
      size.crop = true; // 需要裁减
    } else if (rate > maxRate) { // 大于最大宽高比
      size.width = imgHeight * maxRate; // 截取最大宽度
      size.x = (imgWidth - size.width) / 2; // 切图位移
      size.crop = true; // 需要裁减
    }
  }
  return size; // 返回经过计算后的属性
};

module.exports = grabImages;