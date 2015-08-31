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

module.exports = function (html, options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options = {};
  }
  if (isUrl(html)) {
    fetchUrl(html, options, function (err, res, buf) {
      if (err) {
        return callback(err);
      }
      if (isImageUrl(html)) {
        return callback(null, buf, res);
      }
      var body = buf.toString();
      if (!body) {
        return callback(new Error('Empty html'));
      }
      var article = getArticle(body, res.finalUrl);
      var newHtml = helpers.getNewUrl(html, options);
      if (!newHtml) {
        return callback(null, article, res);
      }
      fetchUrl(newHtml, options, function (err, newRes, newBuf) {
        if (err) {
          return callback(null, article, res);
        }
        var newBody = newBuf.toString();
        if (!newBody) {
          return callback(null, article, res);
        }
        var newArticle = getArticle(newBody, newRes.finalUrl);
        if (newArticle.content.length > article.content.length) {
          return callback(null, newArticle, newRes);
        }
        return callback(null, article, res);
      });
    });
  } else {
    if (!html) {
      return callback(new Error('Empty html'));
    }
    return callback(null, getArticle(html));
  }
  var getArticle = function (html, url) {
    var $ = cheerio.load(html, { normalizeWhitespace: true });
    if ($('body').length < 1) {
      $ = cheerio.load('<body>' + html + '</body>');
    }
    return new Article($, url, options);
  };
};