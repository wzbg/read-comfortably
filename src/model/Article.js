var S = require('string'); // string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.

var grabArticle = require('../readability/grabArticle');

var Article = function (window, options) {
  this.cache = {};
  this.$ = window.$;
  this.options = options;
  this._window = window;
  this._document = window.document;
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

Article.prototype.close = function () {
  if (this._window) {
    this._window.close();
  }
  this._window = null;
  this._document = null;
};

Article.prototype.getDesc = function (length) {
  var cacheKey = 'article-desc-' + length;
  if (this.cache[cacheKey]) {
    return this.cache[cacheKey];
  }
  var content = this.getContent(true);
  if (content) {
    content = S(content).stripTags().decodeHTMLEntities().trimLeft().truncate(length).s
  }
  return this.cache[cacheKey] = content;
};

Article.prototype.getContent = function (notDeprecated) {
  if (!notDeprecated) {
    console.warn('The method `getContent()` is deprecated, using `content` property instead.');
  }
  if (this.cache['article-content']) {
    return this.cache['article-content'];
  }
  var content = grabArticle(this.$, this.options).html();
  return this.cache['article-content'] = content;
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
  var title = this._document.title;
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
  return this._document.documentElement.outerHTML;
};

Article.prototype.getDOM = function (notDeprecated) {
  if (!notDeprecated) {
    console.warn('The method `getDOM()` is deprecated, using `dom` property instead.');
  }
  return this._document;
};

module.exports = Article;