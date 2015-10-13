/**
 *  string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.
 */
var S = require('string');
var url = require('url'); // The core url packaged standalone for use with Browserify.
var cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.

var grabArticle = require('../readability/grabArticle');
var grabIframes = require('../readability/grabIframes');
var grabImages = require('../readability/grabImages');
var grabHtmls = require('../readability/grabHtmls');

var Article = function (dom, url, options) {
  this.cache = {};
  this.$ = dom;
  this.url = url;
  this.options = options;
  this._html = this.$.html();
  this.__defineGetter__('content', function () {
    return this.getContent(true);
  });
  this.__defineGetter__('title', function () {
    return this.getTitle(true);
  });
  this.__defineGetter__('html', function () {
    return this.getHTML(true);
  });
  this.__defineGetter__('dom', function () {
    return this.getDOM(true);
  });
};

Article.prototype.isEmpty = function (content) {
  var text = S(content).stripTags().s;
  return /^\s*(false)?\s*$/.test(text);
}

Article.prototype.getDesc = function (length) {
  var cacheKey = 'article-desc-' + length;
  if (this.cache[cacheKey]) {
    return this.cache[cacheKey];
  }
  var content = this.getContent(true);
  if (content) {
    content = S(content).stripTags().decodeHTMLEntities().trimLeft().truncate(length).s;
  }
  return this.cache[cacheKey] = content;
};

Article.prototype.getIframes = function (callback) {
  if (this.cache['article-iframes']) {
    return callback(null, this.cache['article-iframes']);
  }
  var content = this.getContent(true);
  if (!content) {
    return callback(new Error('Empty content'));
  }
  var self = this;
  grabIframes(content, this.$, function (error, iframes) {
    if (error) {
      return callback(error);
    }
    return callback(null, self.cache['article-iframes'] = iframes);
  });
};

Article.prototype.getImages = function (callback) {
  if (this.cache['article-images']) {
    return callback(null, this.cache['article-images']);
  }
  var content = this.getContent(true);
  if (!content) {
    return callback(new Error('Empty content'));
  }
  var self = this;
  grabImages(content, this.$, function (error, images) {
    if (error) {
      return callback(error);
    }
    return callback(null, self.cache['article-images'] = images);
  });
};

Article.prototype.getHtmls = function (sources, callback) {
  grabHtmls(this.getHTML(true), sources, function (error, html) {
    if (error) {
      return callback(error);
    }
    return callback(null, html);
  });
};

Article.prototype.getContent = function (notDeprecated) {
  if (!notDeprecated) {
    console.warn('The method `getContent()` is deprecated, using `content` property instead.');
  }
  if (this.cache['article-content']) {
    return this.cache['article-content'];
  }
  var content = grabArticle(this.$, this.url, this.options).html();
  if (this.isEmpty(content)) { // preserve unlikely candidates grab article again
    content = grabArticle(cheerio.load(this._html), this.url, this.options, true).html();
  }
  return this.cache['article-content'] = this.isEmpty(content) ? this.getHTML(true) : content;
};

Article.prototype.getTitle = function (notDeprecated) {
  if (!notDeprecated) {
    console.warn('The method `getTitle()` is deprecated, using `title` property instead.');
  }
  if (this.cache['article-title']) {
    return this.cache['article-title'];
  }
  var self = this;
  var betterTitle;
  var $ = cheerio.load(this._html);
  var title = $('title').text().trim();
  var commonSeparatingCharacters = [' | ', ' _ ', ' - ', '«', '»', '—'];
  commonSeparatingCharacters.forEach(function (char) {
    var tmpArray = title.split(char);
    if (tmpArray.length > 1) {
      if (betterTitle) {
        return self.cache['article-title'] = title;
      }
      betterTitle = tmpArray[0].trim();
    }
  });
  if (betterTitle && betterTitle.length > 10) {
    return this.cache['article-title'] = betterTitle;
  }
  return this.cache['article-title'] = title;
};

Article.prototype.getHTML = function (notDeprecated) {
  if (!notDeprecated) {
    console.warn('The method `getHTML()` is deprecated, using `html` property instead.');
  }
  if (this.cache['article-html']) {
    return this.cache['article-html'];
  }
  if (!this.url) {
    return this.cache['article-html'] = this._html;
  }
  var self = this;
  var $ = cheerio.load(this._html);
  $('[src],[href]').each(function (index, element) {
    var node = $(element);
    var link = node.attr('src');
    var use = 'src';
    if (!link) {
      link = node.attr('href');
      var use = 'href';
    }
    if (link) {
      node.attr(use, url.resolve(self.url, link));
    }
  });
  return this.cache['article-html'] = $.html();
};

Article.prototype.getDOM = function (notDeprecated) {
  if (!notDeprecated) {
    console.warn('The method `getDOM()` is deprecated, using `dom` property instead.');
  }
  return this.$;
};

module.exports = Article;