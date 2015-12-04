/* 
* @Author: zyc
* @Date:   2015-11-29 17:05:54
* @Last Modified by:   zyc
* @Last Modified time: 2015-11-30 01:46:37
*/
'use strict';

/**
 *  string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.
 */
const S = require('string');
const URL = require('url'); // The core url packaged standalone for use with Browserify.
const cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.

const grabArticle = require('../readability/grabArticle');
const grabIframes = require('../readability/grabIframes');
const grabImages = require('../readability/grabImages');
const grabHtmls = require('../readability/grabHtmls');

module.exports = class {
  constructor(dom, url, options) { // 构造函数
    this.cache = {};
    this.$ = dom;
    this.url = url;
    this.options = options;
    this._html = this.$.html();
  }

  isEmpty(content) { // 判断传入内容是否为空
    if (/<iframe.*<\/iframe>/.test(content)) return false;
    if (!content) return true;
    const $ = cheerio.load(content);
    $('head,script').remove();
    return /^\s*(false)?\s*$/.test(S($.html()).stripTags().s);
  }

  get dom() { // 获取dom值(注意此值可能会因content等属性的调用而改变)
    return this.$;
  }

  get html() { // 获取网页源代码
    const cacheKey = 'article-html';
    if (this.cache[cacheKey]) return this.cache[cacheKey];
    if (!this.url) return this.cache[cacheKey] = this._html;
    const $ = cheerio.load(this._html);
    $('[src],[href]').each((index, element) => {
      const node = $(element);
      let use = 'src';
      let link = node.attr(use);
      if (!link) link = node.attr(use = 'href');
      if (link) node.attr(use, URL.resolve(this.url, link));
    });
    return this.cache[cacheKey] = $.html();
  }

  get title() { // 获取文章标题
    const cacheKey = 'article-title';
    if (this.cache[cacheKey]) return this.cache[cacheKey];
    let betterTitle;
    const $ = cheerio.load(this._html);
    const title = $('title').text().trim();
    const commonSeparatingCharacters = [' | ', ' _ ', ' - ', '«', '»', '—'];
    for (let char of commonSeparatingCharacters) {
      const tmpArray = title.split(char);
      if (tmpArray.length > 1) {
        if (betterTitle) return this.cache[cacheKey] = title;
        betterTitle = tmpArray[0].trim();
      }
    }
    if (betterTitle && betterTitle.length > 10) {
      return this.cache[cacheKey] = betterTitle;
    }
    return this.cache[cacheKey] = title;
  }

  get content() { // 获取文章内容
    const cacheKey = 'article-content';
    if (this.cache[cacheKey]) return this.cache[cacheKey];
    let content;
    const iframe = this.options.iframe;
    if (iframe) {
      content = cheerio.load('<iframe src="' + iframe.url + '"></iframe>').html();
    } else {
      content = grabArticle(this.$, this.url, this.options).html();
      if (this.isEmpty(content)) { // preserve unlikely candidates grab article again
        content = grabArticle(cheerio.load(this.html), this.url, this.options, true).html();
      }
    }
    return this.cache[cacheKey] = this.isEmpty(content) ? this.html : content;
  }

  getDesc(length) { // 获取文章短文
    const cacheKey = 'article-desc-' + length;
    if (this.cache[cacheKey]) return this.cache[cacheKey];
    let content = this.content;
    if (content) { // 去标签、解码实体、消除左空白、截取前(length)个字符
      content = S(content).stripTags().decodeHTMLEntities().trimLeft().truncate(length).s;
    }
    return this.cache[cacheKey] = content;
  }

  getHtmls(sources) { // 获取网页源代码(自定义替换属性)
    return grabHtmls(this.html, sources);
  }

  get iframes() { // 获取文章内嵌内容
    return grabIframes(this.content, this.$, this.options);
  }

  get images() { // 获取文章内的所有图片
    return grabImages(this.content, this.$);
  }
};