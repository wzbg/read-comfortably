/**
 *  string contains methods that aren't included in the vanilla JavaScript string such as escaping html, decoding html entities, stripping tags, etc.
 */
var S = require('string');
var isImageUrl = require('is-image-url'); // Check if a url is an image.
var URL = require('url'); // The core url packaged standalone for use with Browserify.

var regexps = require('./regexps');

/**
 *  Get the inner text of a node - cross browser compatibly.
 *  This also strips out any excess whitespace to be found.
 *  @param Element
 *  @return string
 */
var getInnerText = module.exports.getInnerText = function (node, normalizeSpaces) {
  var textContent = node.text() ? node.text().trim() : '';
  if (normalizeSpaces || typeof normalizeSpaces == 'undefined') {
    return textContent.replace(regexps.normalizeRe, ' ');
  }
  return textContent;
};

/**
 *  Node Types and their classification
 */
var nodeTypes = [
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
var initializeNode = module.exports.initializeNode = function (node) {
  if (!node || !node.length) {
    return 0;
  }
  node.data('readabilityScore', 0);
  for (var i = 0; nodeType = nodeTypes[i]; i++) {
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
var getClassWeight = module.exports.getClassWeight = function (node) {
  if (!node || !node.length) {
    return 0;
  }
  var classAndID = (node.attr('class') || '') + (node.attr('id') || '');
  var weight = node.get(0).name == 'article' ? 25 : 0;
  /* Look for a special classname and ID */
  if (classAndID.search(regexps.positiveRe) != -1) {
    weight += 25;
  }
  if (classAndID.search(regexps.negativeRe) != -1) {
    weight -= 25;
  }
  return weight;
};

/**
 *  Get the density of links as a percentage of the content.
 *  This is the amount of text that is inside a link divided by the total text in the node.
 *  @param Element
 *  @param $
 *  @return number (float)
 */
var getLinkDensity = module.exports.getLinkDensity = function (node, $) {
  var links      = node.find('a');
  var textLength = getInnerText(node).length;
  var linkLength = 0;
  links.each(function (index, element) {
    var link = $(element);
    var href = link.attr('href');
    if (!href || (href.length && href[0] == '#')) {
      return;
    }
    linkLength += getInnerText(link).length;
  });
  return linkLength / textLength || 0;
};

/**
 *  Set the src attribute of the image for use
 *  @param $
 *  @param object
 *  @return void
 */
var setImageSrc = module.exports.setImageSrc = function ($, options) {
  if (!options.maybeImgsAttr) { // May be it's an image attr
    /* default maybeImgsAttr */
    options.maybeImgsAttr = ['src', 'href'];
  }
  $('a,img,span,div').each(function (index, element) {
    var url, use;
    var img = $(element);
    for (var i = 0; use = options.maybeImgsAttr[i]; i++) {
      url = img.attr(use);
      if (isImageUrl(url)) {
        break;
      }
    }
    if (!isImageUrl(url) && img.css('background-image')) {
      url = S(img.css('background-image')).between('url(', ')').replaceAll(/['"]/, '').s;
    }
    var isImg = element.name == 'img';
    if (isImg && !isImageUrl(url)) {
      img.remove();
      return;
    }
    if (isImageUrl(url)) {
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
var fixLinks = module.exports.fixLinks = function ($, base, options) {
  if (!base) {
    return;
  }
  $('img,a').each(function (index, element) {
    var imgA = $(element);
    var use = element.name == 'a' ? 'href' : 'src';
    var link = imgA.attr(use);
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
var getNewUrl = module.exports.getNewUrl = function (base, options) {
  if (!options.hostnameParse) {
    return;
  }
  var uri = URL.parse(base);
  var hostname = options.hostnameParse[uri.hostname];
  if (!hostname) {
    return;
  }
  var newUrl = uri.protocol + '//' + hostname;
  if (uri.port && uri.port != 80) {
    newUrl += ':' + uri.port;
  }
  newUrl += uri.path;
  return newUrl;
};