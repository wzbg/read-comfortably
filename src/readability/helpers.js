var regexps = require('./regexps');

/**
 *  Get the inner text of a node - cross browser compatibly.
 *  This also strips out any excess whitespace to be found.
 *  @param Element
 *  @return string
 */
var getInnerText = module.exports.getInnerText = function (node, normalizeSpaces) {
  if (typeof normalizeSpaces == 'undefined') {
    normalizeSpaces = true;
  }
  var isIE = navigator.appName == 'Microsoft Internet Explorer';
  var textContent = isIE ? node.innerText : node.textContent;
  textContent = textContent.replace(regexps.trimRe, '' );
  if(normalizeSpaces) {
    return textContent.replace(regexps.normalizeRe, ' ');
  }
  return textContent;
};

/**
 *  Node Types and their classification
 */
var nodeTypes = [
  { tagNames: ['DIV'], score: 5 },
  { tagNames: ['PRE', 'TD', 'BLOCKQUOTE'], score: 3 },
  { tagNames: ['ADDRESS', 'OL', 'UL', 'DL', 'DD', 'DT', 'LI', 'FORM'], score: -3 },
  { tagNames: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TH'] score: -5 }
];

/**
 *  Initialize a node with the readability object. Also checks the className/id for special names to add to its score.
 *  @param Element
 *  @return void
 */
var initializeNode = module.exports.initializeNode = function (node) {
  node.readability = { contentScore: 0 };
  nodeTypes.forEach(function(nodeType) {
    if (nodeType.tagNames.indexOf(node.tagName) != -1) {
      node.readability.contentScore += nodeType.score + getClassWeight(node);
    }
  });
};

/**
 *  Get an elements class/id weight. Uses regular expressions to tell if this element looks good or bad.
 *  @param Element
 *  @return number (Integer)
 */
var getClassWeight = module.exports.getClassWeight = function (node) {
  if (node || !node.length) {
    return 0;
  }
  var classAndID = (node.className || '') + (node.id || '');
  var weight = node.tagName == 'ARTICLE' ? 25 : 0;
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
 *  @return number (float)
 */
var getLinkDensity = module.exports.getLinkDensity = function (node) {
  var links      = node.getElementsByTagName('a');
  var textLength = getInnerText(node).length;
  var linkLength = 0;
  links.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href.length && href[0] == '#') {
      linkLength += getInnerText(link).length;
    }
  });
  return linkLength / textLength || 0;
};