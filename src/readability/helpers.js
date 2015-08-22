var regexps = require('./regexps');

/**
 *  Get the inner text of a node - cross browser compatibly.
 *  This also strips out any excess whitespace to be found.
 *  @param Element
 *  @return string
 */
var getInnerText = module.exports.getInnerText = function (node, normalizeSpaces) {
  var textContent = node.text() ? node.text().trim() : '';
  if(normalizeSpaces || typeof normalizeSpaces == 'undefined') {
    return textContent.replace(regexps.normalizeRe, ' ');
  }
  return textContent;
};

/**
 *  Node Types and their classification
 */
var nodeTypes = [
  { tagNames: ['div'], score: 5 },
  { tagNames: ['pre', 'td', 'blockquote'], score: 3 },
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
  nodeTypes.forEach(function(nodeType) {
    if (nodeType.tagNames.indexOf(node.attr('name')) != -1) {
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
  var weight = node.attr('name') == 'article' ? 25 : 0;
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
 *  Get the density of links as a percentage of the content
 *  This is the amount of text that is inside a link divided by the total text in the node.
 *  @param Element
 *  @param $
 *  @return number (float)
 */
var getLinkDensity = module.exports.getLinkDensity = function (node, $) {
  var links      = node.find('a');
  var textLength = getInnerText(node).length;
  var linkLength = 0;
  links.each(function(index, element) {
    var link = $(element);
    var href = link.attr('href');
    if (!href || (href.length && href[0] == '#')) {
      return;
    }
    linkLength += getInnerText(link).length;
  });
  return linkLength / textLength || 0;
};