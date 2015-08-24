var fetchUrl = require('fetch').fetchUrl; // Fetch url contents. Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
var cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.
var isUrl = require('is-url'); // Check whether a string is a URL.

var Article = require('./model/Article');

module.exports = function (html, options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options = {};
  }
  if (isUrl(html)) {
    fetchUrl(html, options, function(err, res, buf){
      if (err) {
        return callback(err);
      }
      parseDOM(buf.toString(), html, res);
    });
  } else {
    parseDOM(html);
  }
  var parseDOM = function (html, url, res) {
    if (!html) return callback(new Error('Empty html'));
    var $ = cheerio.load(html, { normalizeWhitespace: true });
    if ($('body').length < 1) {
      $ = cheerio.load('<body>' + html + '</body>');
    }
    return callback(null, new Article($, url, options), res);
  };
};