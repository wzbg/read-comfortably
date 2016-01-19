/* 
* @Author: zyc
* @Date:   2015-11-29 18:38:43
* @Last Modified by:   zyc
* @Last Modified time: 2016-01-19 18:41:28
*/
'use strict';

/**
 *  string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.
 */
const S = require('string');
const isImageUrl = require('is-image-url'); // Check if a url is an image.
const URL = require('url'); // The core url packaged standalone for use with Browserify.

const regexps = require('./regexps');

/**
 *  Get the inner text of a node - cross browser compatibly.
 *  This also strips out any excess whitespace to be found.
 *  @param Element
 *  @return string
 */
const getInnerText = module.exports.getInnerText = (node, normalizeSpaces) => {
  const textContent = node.text() ? node.text().trim() : '';
  if (normalizeSpaces || normalizeSpaces == undefined) {
    return textContent.replace(regexps.normalizeRe, ' ');
  }
  return textContent;
};

/**
 *  Node Types and their classification
 */
const nodeTypes = [
  { tagNames: ['div'], score: 5 },
  { tagNames: ['pre', 'td', 'blockqute'], score: 3 },
  { tagNames: ['address', 'ol', 'ul', 'dl', 'dd', 'dt', 'lt', 'form'], score: -3 },
  { tagNames: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'th'], score: -5 }
];

/**
 *  Initialize a node with the readability object. Also checks the className/id for special names to add to its score.
 *  @param Element
 *  @return void
 */
const initializeNode = module.exports.initializeNode = node => {
  if (!node || !node.length) return 0;
  node.data('readabilityScore', 0);
  for (let nodeType of nodeTypes) {
    if (nodeType.tagNames.indexOf(node.get(0).name) != -1) {
      node.data('readabilityScore', nodeType.score + getClassWeight(node));
      break;
    }
  }
};

/**
 *  Get an elements class/id weight. Uses regular expressions to tell if this element looks good or bad.
 *  @param Element
 *  @return number (Integer)
 */
const getClassWeight = module.exports.getClassWeight = node => {
  if (!node || !node.length) return 0;
  const classAndID = (node.attr('class') || '') + '|' + (node.attr('id') || '');
  let weight = node.get(0).name == 'article' ? 25 : 0;
  /* Look for a special classname and ID */
  if (classAndID.search(regexps.positiveRe) != -1) weight += 25;
  if (classAndID.search(regexps.negativeRe) != -1) weight -= 25;
  return weight;
};

/**
 *  Get the density of links as a percentage of the content.
 *  This is the amount of text that is inside a link divided by the total text in the node.
 *  @param Element
 *  @param $
 *  @return number (float)
 */
const getLinkDensity = module.exports.getLinkDensity = (node, $) => {
  const links      = node.find('a');
  const textLength = getInnerText(node).length;
  let linkLength   = 0;
  links.each((index, element) => {
    const link = $(element);
    const href = link.attr('href');
    if (href && href.length && href[0] != '#') {
      linkLength += getInnerText(link).length;
    }
  });
  return linkLength / textLength || 0;
};

/**
 *  Set the src attribute of the image for use
 *  @param $
 *  @param object
 *  @return void
 */
const setImageSrc = module.exports.setImageSrc = ($, options) => {
  if (!options.maybeImgsAttr) { // May be it's an image attr
    /* default maybeImgsAttr */
    options.maybeImgsAttr = ['src', 'href'];
  }
  $('noscript').each((index, element) => {
    const node = $(element);
    if (node.find('img').length && !node.siblings('img').length) {
      node.replaceWith(node.html());
    }
  });
  $('a,img,span,div').each((index, element) => {
    let url, use, img = $(element);
    const isImg = element.name == 'img';
    for (use of options.maybeImgsAttr) {
      if (isImageUrl(img.attr(use), isImg, options.setImgTimeout)) {
        url = img.attr(use);
        break;
      }
    }
    let isImgUrl = url != undefined;
    if (!url && img.css('background-image')) {
      url = S(img.css('background-image')).between('url(', ')').replaceAll(/['"]/, '').s;
      isImgUrl = isImageUrl(url, isImg);
    }
    if (isImgUrl) {
      url = url.replace(/\{\w+\}/g, '');
      if (!isImg && !img.find('img').length && !$('img[src="' + url + '"]').length) {
        img = $('<img src="' + url + '">');
        $(element).append(img);
      }
      img.attr('orig-height', img.attr('height'));
      img.attr('orig-width', img.attr('width'));
      img.attr('orig-src', img.attr('src'));
      img.attr('src', url);
      img.attr('use', use);
      img.removeAttr('width');
      img.removeAttr('height');
    } else if (isImg) {
      img.remove();
    }
  });
};

/**
 *  Converts relative urls to absolute for images and links
 *  @param $
 *  @param string
 *  @param object
 *  @return void
 */
const fixLinks = module.exports.fixLinks = ($, base, options) => {
  if (!base) return;
  $('iframe,img,a').each((index, element) => {
    const imgA = $(element);
    const use = element.name == 'a' ? 'href' : 'src';
    const link = imgA.attr(use);
    if (link) {
      imgA.attr(use, URL.resolve(base, link));
    }
  });
};

/**
 *  get new url by options.hostnameParse if hostname's key is exist
 *  @param string
 *  @param object
 *  @return string
 */
const getNewUrl = module.exports.getNewUrl = (base, options) => {
  if (!options.hostnameParse) return;
  const uri = URL.parse(base);
  const hostname = options.hostnameParse[uri.hostname];
  if (!hostname) return;
  let newUrl = uri.protocol + '//' + hostname;
  if (uri.port && uri.port != 80) newUrl += ':' + uri.port;
  newUrl += uri.path;
  return newUrl;
};