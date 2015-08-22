var isImageUrl = require('is-image-url'); // Check if a url is an image

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
  { tagNames: ['DIV'], score: 5 },
  { tagNames: ['PRE', 'TD', 'BLOCKQUTE'], score: 3 },
  { tagNames: ['ADDRESS', 'OL', 'UL', 'DL', 'DD', 'DT', 'LT', 'FORM'], score: -3 },
  { tagNames: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TH'], score: -5 }
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
  nodeTypes.forEach(function (nodeType) {
    if (nodeType.tagNames.indexOf(node.prop('tagName')) != -1) {
      node.data('readability', nodeType.score + getClassWeight(node));
    }
  });
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
  var weight = node.prop('tagName') == 'ARTICLE' ? 25 : 0;
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
 *  May be it's an image url
 */
var srcs = [
  'rel:bf_image_src',
  'data-original',
  'data-lazy-src',
  'data-srcset',
  'data-medsrc',
  'data-smsrc',
  'data-lgsrc',
  'data-src',
  'src'
];

/**
 *  Set the src attribute of the image for use
 *  @param Element
 *  @param $
 *  @return void
 */
var setImageSrc = module.exports.setImageSrc = function (node, $) {
  node.find('img,span').each(function (index, element) {
    var url, use;
    var img = $(element);
    for (var i = 0; use = srcs[i]; i++) {
      url = img.attr(use);
      if (isImageUrl(url)) {
        break;
      }
    }
    var isImg = img.prop('tagName') == 'IMG';
    if (isImg && !isImageUrl(url)) {
      img.remove();
      return;
    }
    if (isImageUrl(url)) {
      if (!isImg) {
        img = $('<img src="' + url + '">');
        $(element).append(img);
      }
      img.attr('use', use);
    }
  });
};