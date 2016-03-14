/* 
* @Author: zyc
* @Date:   2015-11-29 05:31:39
* @Last Modified by:   zyc
* @Last Modified time: 2016-03-14 11:27:58
*/
'use strict';

/**
 *  Fetch url contents.
 *  Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
 */
const fetchUrl = require('fetch-promise');
const cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.
const isImageUrl = require('is-image-url'); // Check if a url is an image.
const isUrl = require('is-url'); // Check whether a string is a URL.

const Article = require('./model/Article');
const helpers = require('./readability/helpers');

module.exports = (html, options) => {
  if (!options) options = {};
  if (!html) return Promise.reject('Empty html');
  if (!isUrl(html)) {
    return Promise.resolve({ article: getArticle(html) });
  }
  const urlprocess = options.urlprocess;
  if (typeof urlprocess == 'function') {
    html = urlprocess(html, options);
  }
  const asyncprocess = options.asyncprocess
  if (typeof asyncprocess == 'function') {
    asyncprocess(html, options)
      .then(() => getUrlHtml(html, options))
      .catch(err => getUrlHtml(html, options));
  }
  return getUrlHtml(html, options);
};

const getUrlHtml = (url, options) => {
  return new Promise((resolve, reject) => {
    const promises = [ fetchUrl(url, options) ];
    const newUrl = helpers.getNewUrl(url, options);
    if (newUrl) promises.push(fetchUrl(newUrl, options));
    Promise.all(promises).then(results => {
      let res, article;
      for (let result of results) {
        const { res: newRes, buf: newBuf } = result;
        const newArticle = getArticle(newBuf, newRes.finalUrl, options);
        if (!article || article.content.length < newArticle.content.length) {
          article = newArticle;
          res = newRes;
        }
      }
      resolve({ res, article });
    }).catch(err => {
      promises[0].then(result => {
        const { res, buf } = result;
        const article = getArticle(buf, res.finalUrl, options);
        resolve({ res, article });
      }).catch(err => reject(err));
    });
  });
};

const getArticle = (html, url, options) => {
  let $ = cheerio.load(html, { normalizeWhitespace: true });
  if ($('body').length < 1) {
    $ = cheerio.load('<body>' + html + '</body>', { normalizeWhitespace: true });
  }
  return new Article($, url, options);
};