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
var logger = log4js.getLogger('grabHtmls');
logger.setLevel('FATAL');
// logger.setLevel('DEBUG');

/**
 *  Fetch url contents.
 *  Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
 */
var fetchUrl = require('fetch').fetchUrl;
var cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.
/**
 *  string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.
 */
var S = require('string');

/**
 *  grab tht article html's for sources
 *  @param Root Element
 *  @param []
 *  @param callback(error, html)
 *  @return void
 */
var grabHtmls = function (html, sources, callback) {
  var count = 0;
  var $ = cheerio.load(html, { normalizeWhitespace: true });
  sources.forEach(function (source) {
    var nodes = $(source.selector);
    count += nodes.length;
    source.nodes = nodes;
  });
  if (!count) {
    callback(null, $.html());
    return;
  }
  sources.forEach(function (source) {
    source.nodes.each(function (index, element) {
      var node = $(element);
      if(source.val) {
        node.attr(source.attr, source.val);
        if (!--count) {
          callback(null, $.html());
        }
        return;
      }
      var url = node.attr(source.attr);
      if (url) {
        fetchUrl(url, function (err, res, buf) {
          if (err) {
            logger.error('fetch url[%s] error:', url, err);
          } else if (res.status != 200) {
            logger.error('fetch url[%s] status:', url, res.status);
          } else if (!buf) {
            logger.error('fetch url[%s] Empty body', url);
          }
          if (buf) {
            node.replaceWith(S(buf.toString()).wrapHTML(source.tag).s);
          }
          if (!--count) {
            callback(null, $.html());
          }
        });
      } else {
        return callback(new Error('Empty url'));
      }
    });
  });
};

module.exports = grabHtmls;