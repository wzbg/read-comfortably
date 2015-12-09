/* 
* @Author: zyc
* @Date:   2015-11-29 17:43:37
* @Last Modified by:   zyc
* @Last Modified time: 2015-12-10 01:48:19
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

/**
 *  grab tht article html's for sources
 *  @param Root Element
 *  @param []
 *  @return Promise
 */
const grabHtmls = (html, sources) => {
  const $ = cheerio.load(html, { normalizeWhitespace: true });
  return new Promise((resolve, reject) => {
    if (sources) {
      const sourceNodes = [];
      for (let source of sources) {
        const selector = $(source.selector);
        for (let i = -1; i < selector.length; i++) {
          const node = $(selector.get(i));
          sourceNodes.push({ source, node });
        }
      }
      let count = sourceNodes.length;
      for (let sourceNode of sourceNodes) {
        const { source, node } = sourceNode;
        if(source.val) {
          node.attr(source.attr, source.val);
          if (!--count) resolve($.html());
        } else {
          const url = node.attr(source.attr);
          if (url) {
            fetchUrl(url).then(
              result => {
                const { res, buf } = result;
                if (res.status != 200) {
                  logger.error('fetch url[%s] status:', url, res.status);
                } else if (!buf) {
                  logger.error('fetch url[%s] Empty body', url);
                }
                if (buf) {
                  node.replaceWith(S(buf).wrapHTML(source.tag).s);
                }
                if (!--count) resolve($.html());
              },
              err => {
                logger.error('fetch url[%s] error:', url, err);
                if (!--count) resolve($.html());
              }
            );
          } else {
            if (!--count) resolve($.html());
          }
        }
      }
    } else {
      resolve($.html());
    }
  });
};

module.exports = grabHtmls;