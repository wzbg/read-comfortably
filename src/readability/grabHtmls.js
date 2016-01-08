/* 
* @Author: zyc
* @Date:   2015-11-29 17:43:37
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-08 13:39:33
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
const logger = log4js.getLogger('grabHtmls');
logger.setLevel('FATAL');
// logger.setLevel('DEBUG');

/**
 *  Fetch url contents.
 *  Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
 */
const fetchUrl = require('fetch-promise');
const cheerio = require('cheerio'); // Tiny, fast, and elegant implementation of core jQuery designed specifically for the server.
/**
 *  string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.
 */
const S = require('string');

const helpers = require('./helpers');

/**
 *  grab tht article html's for sources
 *  @param Root Element
 *  @param []
 *  @param string
 *  @param object
 *  @return Promise
 */
const grabHtmls = (html, sources, base, options) => {
  const $ = cheerio.load(html, { normalizeWhitespace: true });
  helpers.setImageSrc($, options); // Set the src attribute of the images or other tags for use
  helpers.fixLinks($, base, options); // Converts relative urls to absolute for images and links
  const promises = [];
  if (sources) {
    for (let source of sources) {
      const selector = $(source.selector);
      for (let i = -1; i < selector.length; i++) {
        const node = $(selector.get(i));
        if(source.val) {
          node.attr(source.attr, source.val);
        } else {
          const url = node.attr(source.attr);
          if (url) {
            promises.push(replaceUrl(url, node, source.tag));
          }
        }
      }
    }
  }
  return new Promise(resolve => Promise.all(promises).then(result => resolve($.html())));
};

const replaceUrl = (url, node, tag) => {
  return new Promise(resolve => {
    fetchUrl(url).then(result => {
      const { res, buf } = result;
      if (res.status != 200) {
        logger.error('fetch url[%s] status:', url, res.status);
      } else if (!buf) {
        logger.error('fetch url[%s] Empty body', url);
      }
      if (buf && buf.toString().indexOf('@import url') == -1) {
        node.replaceWith(S(buf).wrapHTML(tag).s);
      }
      resolve();
    }).catch(err => resolve());
  });
};

module.exports = grabHtmls;