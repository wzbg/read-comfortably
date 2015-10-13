/**
 *  Fetch url contents.
 *  Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
 */
var fetchUrl = require('fetch').fetchUrl;
var cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.
var isImageUrl = require('is-image-url'); // Check if a url is an image.
var isUrl = require('is-url'); // Check whether a string is a URL.

var Article = require('./model/Article');
var helpers = require('./readability/helpers');

var getArticle = function (html, url, options) {
  var $ = cheerio.load(html, { normalizeWhitespace: true });
  if ($('body').length < 1) {
    $ = cheerio.load('<body>' + html + '</body>', { normalizeWhitespace: true });
  }
  return new Article($, url, options);
};

var getUrlHtml = function (url, options, callback, encode) {
  fetchUrl(url, options, function (err, res, buf) {
    var errMsg;
    if (err) {
      errMsg = 'fetch url[' + url + '] error:' + err.message;
    } else if (res.status != 200) {
      errMsg = 'fetch url[' + url + '] status:' + res.status;
    } else if (!buf) {
      errMsg = 'fetch url[' + url + '] Empty body';
    }
    if (errMsg) {
      if (encode) {
        return callback(new Error(errMsg), buf, res);
      }
      return getUrlHtml(encodeURI(url), options, callback, true);
    }
    if (isImageUrl(url)) {
      return callback(null, buf, res);
    }
    var body = buf.toString();
    if (!body) {
      return callback(new Error('Empty body'));
    }
    var article = getArticle(body, res.finalUrl, options);
    var newUrl = helpers.getNewUrl(url, options);
    if (!newUrl) {
      return callback(null, article, res);
    }
    fetchUrl(newUrl, options, function (err, newRes, newBuf) {
      if (err || newRes.status != 200) {
        return callback(null, article, res);
      }
      var newBody = newBuf.toString();
      if (!newBody) {
        return callback(null, article, res);
      }
      var newArticle = getArticle(newBody, newRes.finalUrl, options);
      if (newArticle.content.length > article.content.length) {
        return callback(null, newArticle, newRes);
      }
      return callback(null, article, res);
    });
  });
};

module.exports = function (html, options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options = {};
  }
  if (!html) {
    return callback(new Error('Empty html'));
  }
  if (!isUrl(html)) {
    return callback(null, getArticle(html));
  }
  var urlprocess = options.urlprocess;
  if (typeof urlprocess == 'function') {
    html = urlprocess(html);
  }
  if (!options.asyncprocess) {
    return getUrlHtml(html, options, callback);
  }
  options.asyncprocess(html, options, function (err) {
    if (err) {
      return callback(err);
    }
    return getUrlHtml(html, options, callback);
  });
};