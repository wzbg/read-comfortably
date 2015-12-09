/* 
* @Author: zyc
* @Date:   2015-11-29 17:51:25
* @Last Modified by:   zyc
* @Last Modified time: 2015-12-10 02:02:30
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
const logger = log4js.getLogger('grabImages');
logger.setLevel('FATAL');
// logger.setLevel('DEBUG');

/**
 *  Fetch url contents.
 *  Supports gzipped content for quicker download, redirects (with automatic cookie handling, so no eternal redirect loops), streaming and piping etc.
 */
const fetchUrl = require('fetch-promise');
const sizeOf = require('image-size'); // get dimensions of any image file.

/**
 *  grab tht article content's images
 *  @param Element
 *  @param $
 *  @return Promise
 */
const grabImages = (node, $) => {
  const imgs = $(node).find('img[src]'), images = [];
  return new Promise((resolve, reject) => {
    if (!imgs.length) resolve(images);
    imgs.each((index, element) => {
      const url = $(element).attr('src');
      const image = { url };
      fetchUrl(url).then(
        result => {
          const { res, buf } = result;
          if (res.status != 200) {
            logger.error('fetch url[%s] status:', url, res.status);
          } else if (!buf) {
            logger.error('fetch url[%s] Empty body', url);
          }
          image.buf = buf;
          if (res && res.responseHeaders) {
            image.imgType = res.responseHeaders['content-type'];
          }
          const dimensions = sizeOf(buf);
          if (dimensions) {
            image.width = dimensions.width;
            image.height = dimensions.height;
          }
          images.push(image);
          if (images.length == imgs.length) {
            resolve(images);
          }
        },
        err => {
          images.push(image);
          if (images.length == imgs.length) {
            resolve(images);
          }
        }
      );
    });
  });
};

module.exports = grabImages;