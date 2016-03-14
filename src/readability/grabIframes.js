/* 
* @Author: zyc
* @Date:   2015-11-29 18:10:39
* @Last Modified by:   zyc
* @Last Modified time: 2016-03-14 11:39:41
*/
'use strict';

/**
 *  日志
 *  trace 跟踪
 *  debug 调试
 *  info  信息
 *  warn  警告
 *  error 错误
 *  fatal 致命
 */
const log4js = require('log4js'); // Port of Log4js to work with node
const logger = log4js.getLogger('grabIframes');
logger.setLevel('FATAL');
// logger.setLevel('DEBUG');

/**
 *  Fetch url contents.
 *  Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
 */
const fetchUrl = require('fetch-promise');
const cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.
const isPdf = require('is-pdf'); // Check if a Buffer/Uint8Array is a 7ZIP file.
const isUrl = require('is-url'); // Check whether a string is a URL.
const isImageUrl = require('is-image-url'); // Check if a url is an image.

const grabImages = require('./grabImages');
const regexps = require('./regexps');
const helpers = require('./helpers');

/**
 *  grab tht article content's iframes
 *  @param Element
 *  @param $
 *  @param object
 *  @return Promise
 */
const grabIframes = (node, $, options) => {
  const ifms = $(node).find('iframe[src]'), iframes = [];
  if (!ifms.length) return Promise.resolve(iframes);
  const promises = [];
  ifms.each((index, element) => {
    const url = $(element).attr('src');
    if (isUrl(url)) {
      promises.push(grabIframe(url));
    }
  });
  return new Promise(resolve => Promise.all(promises).then(iframes => resolve(iframes)));
};

/**
 *  grab tht article content's iframes
 *  @param Element
 *  @param $
 *  @param object
 *  @return Promise
 */
const grabIframe = url => {
  const iframe = { url, isVideo: url.search(regexps.videoRe) != -1 };
  if (iframe.isVideo) return Promise.resolve(iframe);
  return new Promise(resolve => {
    fetchUrl(url).then(result => {
      const { res, buf } = result;
      if (res.status != 200) {
        logger.error('fetch url[%s] status:', url, res.status);
      } else if (!buf) {
        logger.error('fetch url[%s] Empty body', url);
      }
      iframe.buf = buf;
      if (res && res.responseHeaders) {
        iframe.ifmType = res.responseHeaders['content-type'];
      }
      if (!isImageUrl(url) && !isPdf(buf)) {
        const $ = cheerio.load(buf, { normalizeWhitespace: true });
        helpers.setImageSrc($, options);
        helpers.fixLinks($, url, options);
        iframe.buf = $.html();
        grabImages(iframe.buf, $).then(images => {
          iframe.imgs = images;
          resolve(iframe);
        });
      } else {
        resolve(iframe);
      }
    }).catch(err => resolve(iframe));
  });
};

module.exports = grabIframes;