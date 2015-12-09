/* 
* @Author: zyc
* @Date:   2015-11-29 05:31:39
* @Last Modified by:   zyc
* @Last Modified time: 2015-12-10 01:01:30
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
  if (!html) return reject('Empty html');
  if (!isUrl(html)) {
    return new Promise(resolve => resolve({ article: getArticle(html) }));
  }
  const urlprocess = options.urlprocess;
  if (typeof urlprocess == 'function') {
    html = urlprocess(html, options);
  }
  const asyncprocess = options.asyncprocess
  if (typeof asyncprocess == 'function') {
    asyncprocess(html, options).then(
      () => getUrlHtml(html, options),
      err => getUrlHtml(html, options)
    );
  } else {
    return getUrlHtml(html, options);
  }
};

const getUrlHtml = (url, options) => {
  return new Promise((resolve, reject) => {
    fetchUrl(url, options).then(
      result => {
        let { res, buf: article } = result;
        article = getArticle(article, res.finalUrl, options);
        const newUrl = helpers.getNewUrl(url, options);
        if (newUrl) {
          fetchUrl(newUrl, options).then(
            result => {
              const { res: newRes, buf: newBuf } = result;
              if (newRes.status == 200 && newBuf) {
                const newArticle = getArticle(newBuf, newRes.finalUrl, options);
                if (newArticle.content.length > article.content.length) {
                  article = newArticle; res = newRes;
                }
              }
              resolve({ res, article });
            },
            err => resolve({ res, article })
          );
        } else resolve({ res, article });
      },
      err => reject(err)
    );
  });
};

const getArticle = (html, url, options) => {
  let $ = cheerio.load(html, { normalizeWhitespace: true });
  if ($('body').length < 1) {
    $ = cheerio.load('<body>' + html + '</body>', { normalizeWhitespace: true });
  }
  return new Article($, url, options);
};