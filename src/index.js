var fetchUrl = require('fetch').fetchUrl; // Fetch url contents. Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
var jsdom = require('node-jsdom'); // A JavaScript implementation of the DOM and HTML standards cloned from the original jsdom branch 3.x

var Article = require('./model/Article');

var scripts = ['http://code.jquery.com/jquery.js'];

module.exports = function (html, options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options = {};
  }
  fetchUrl(html, options, function(err, res, buf){
    if (err) {
      return callback(err);
    }
    jsdom.env(buf.toString(), scripts, options, function (err, window) {
      if (err) {
        return callback(err);
      }
      if (!window.document.documentElement.outerHTML) {
        return callback(new Error('Empty html'));
      }
      return callback(null, new Article(window, options), res);
    });
  });
};