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
var logger = log4js.getLogger('grabIframes');
logger.setLevel('FATAL');
// logger.setLevel('DEBUG');

/**
 *  Fetch url contents.
 *  Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
 */
var fetchUrl = require('fetch').fetchUrl;
var cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.

var grabImages = require('./grabImages');
var helpers = require('./helpers');

/**
 *  grab tht article content's iframes
 *  @param Element
 *  @param $
 *  @param object
 *  @param callback(error, iframes)
 *  @return void
 */
var grabIframes = function (node, $, options, callback) {
  var ifms = $(node).find('iframe[src]');
  var iframes = [];
  if (!ifms.length) {
    return callback(null, iframes);
  }
  ifms.each(function (index, element) {
    var ifm = $(element);
    var link = ifm.attr('src');
    if (link) { // iframe -> buffer
      fetchIframe(link, options, iframes, ifms.length, callback);
    } else {
      return callback(new Error('Empty link'));
    }
  });
};

/**
 *  fetch tht article content's iframe
 *  @param string
 *  @param object
 *  @param []
 *  @param callback(error, iframes)
 *  @return void
 */
var fetchIframe = function (url, options, iframes, length, callback, encode) {
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
        return fetchIframe(url, iframes, length, callback, true);
      }
      return callback(new Error(errMsg), iframes);
    }
    var $ = cheerio.load(buf);
    helpers.setImageSrc($, options);
    helpers.fixLinks($, url, options);
    var iframe = { url: url, buf: $.html() };
    if (res && res.responseHeaders) {
      iframe.ifmType = res.responseHeaders['content-type'];
    }
    grabImages(iframe.buf, $, function (err, images) {
      if (err) {
        logger.error('grabImages error:', err);
      }
      iframe.imgs = images;
      iframes.push(iframe);
      if (iframes.length == length) {
        logger.info('iframes:', iframes);
        callback(null, iframes);
      }
    });
  });
};

module.exports = grabIframes;