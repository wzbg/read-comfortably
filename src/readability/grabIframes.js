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

/**
 *  grab tht article content's iframes
 *  @param Element
 *  @param $
 *  @param callback(error, iframes)
 *  @return void
 */
var grabIframes = function (node, $, callback) {
  var ifms = $(node).find('iframe[src]');
  var iframes = [];
  if (!ifms.length) {
    return callback(null, iframes);
  }
  ifms.each(function (index, element) {
    var ifm = $(element);
    var link = ifm.attr('src');
    if (link) { // iframe -> buffer
      fetchIframe(link, iframes, ifms.length, callback);
    } else {
      return callback(new Error('Empty link'));
    }
  });
};

/**
 *  fetch tht article content's iframe
 *  @param string
 *  @param []
 *  @param callback(error, iframes)
 *  @return void
 */
var fetchIframe = function (url, iframes, length, callback, encode) {
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
    }
    var iframe = { url: url, buf: buf };
    if (res && res.responseHeaders) {
      iframe.ifmType = res.responseHeaders['content-type'];
    }
    iframes.push(iframe);
    if (iframes.length == length) {
      logger.info('iframes:', iframes);
      callback(null, iframes);
    }
  });
};

module.exports = grabIframes;