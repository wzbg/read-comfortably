/* 
* @Author: zyc
* @Date:   2015-11-29 17:43:37
* @Last Modified by:   zyc
* @Last Modified time: 2015-11-30 02:03:02
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
  return new Promise(async (resolve, reject) => {
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
              try {
                let { res, buf } = await fetchUrl(url);
                if (res.status != 200) {
                  logger.error('fetch url[%s] status:', url, res.status);
                } else if (!buf) {
                  logger.error('fetch url[%s] Empty body', url);
                }
                if (buf) {
                  node.replaceWith(S(buf).wrapHTML(source.tag).s);
                }
              } catch (err) {
                logger.error('fetch url[%s] error:', url, err);
              }
            }
          }
        }
      }
    }
    resolve($.html());
  });
};

module.exports = grabHtmls;