var jsdom = require('node-jsdom'); // A JavaScript implementation of the DOM and HTML standards cloned from the original jsdom branch 3.x

var Article = require('./model/Article');

var scripts = ['http://code.jquery.com/jquery.js'];

module.exports = function (html, options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options = { considerDIVs: true };
  }
  jsdom.env(html, scripts, options, function (err, window) {
    if (err) {
      return callback(err);
    }
    if (!window.document.documentElement.outerHTML) {
      return callback(new Error('Empty html'));
    }
    return callback(null, new Article(window, options));
  });
};