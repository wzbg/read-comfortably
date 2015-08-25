/**
 *  日志
 *  trace 跟踪
 *  debug 调试
 *  info  信息
 *  warn  警告
 *  error 错误
 *  fatal 致命
 */
var log4js = require('log4js'); // Port of Log4js to work with node
var logger = log4js.getLogger('grabArticle');
logger.setLevel('FATAL');
// logger.setLevel('DEBUG');

var regexps = require('./regexps');
var helpers = require('./helpers');

/**
 *  grabArticle - Using a variety of metrics (content score, classname, element types),
 *           find the content that is most likely to be the stuff a user wants to read.
 *           Then return it wrapped up in a div.
 *  @param $
 *  @param url
 *  @param options
 *  @param preserveUnlikelyCandidates
 *  @return string (Article Content)
 */
var grabArticle = function ($, url, options, preserveUnlikelyCandidates) {
  /**
   *  preprocess which should be a function to check or modify downloaded source before passing it to readability.
   *  options.preprocess = callback($, options);
   */
  var preprocess = options.preprocess;
  if (typeof preprocess == 'function') {
    preprocess($, options);
  }
  prepping($, options, preserveUnlikelyCandidates); // First, node prepping
  var candidates     = assignScore($, options); // assign a score to them based on how content-y they look
  var topCandidate   = findHighestScore(candidates, $); // find the top candidate with the highest score
  var articleContent = getArticleContent(topCandidate, $, options); // Append the nodes to articleContent
  if (!preserveUnlikelyCandidates && !helpers.getInnerText(articleContent, false)) {
    articleContent = grabArticle($, options, true); // preserve unlikely candidates grab article again
  }
  helpers.setImageSrc(articleContent, $); // Set the src attribute of the images or other tags for use
  helpers.fixLinks(articleContent, $, url); // Converts relative urls to absolute for images and links
  /**
   *  postprocess which should be a function to check or modify article content after passing it to readability.
   *  options.postprocess = callback(node, $);
   */
  var postprocess = options.postprocess;
  if (typeof postprocess == 'function') {
    postprocess(articleContent, $);
  }
  return articleContent;
};

/**
 *  First, node prepping. Trash nodes that look cruddy (like ones with the class name 'comment', etc), and turn divs
 *  into P tags where they have been used inappropriately (as in, where they contain no other block level elements.)
 *  Note: Assignment from index for performance. See http://www.peachpit.com/articles/article.aspx?p=31567&seqNum=5
 *  TODO: Shouldn't this be a reverse traversal?
 *  @param $
 *  @param options
 *  @param preserveUnlikelyCandidates
 *  @return void
 */
var prepping = function ($, options, preserveUnlikelyCandidates) {
  /* Removing unnecessary nodes */
  if (options.nodesToRemove) {
    $(options.nodesToRemove.join()).remove();
  }
  $('*', 'body').each(function (index, element) {
    var node = $(element);
    /* If node is null, return, otherwise Illegal Access Error */
    if (!node || !node.length) {
      return;
    }
    var nodeType = element.name;
    logger.trace('%d[%s]:', index, nodeType, node.html());
    /* Remove unlikely candidates */
    if (!preserveUnlikelyCandidates) {
      var unlikelyMatchString = (node.attr('class') || '') + '|' + (node.attr('id') || '');
      if (unlikelyMatchString) {
        var unlikelyCandidatesReIndex = unlikelyMatchString.search(regexps.unlikelyCandidatesRe);
        logger.trace('%s[unlikelyCandidatesReIndex=%d]', unlikelyMatchString, unlikelyCandidatesReIndex);
        if (unlikelyCandidatesReIndex != -1) {
          var classAndIDs = node.find('[class],[id]');
          classAndIDs.add(node);
          var remove = true;
          for (var i = 0; i < classAndIDs.length; i++) {
            var classAndID = $(classAndIDs.get(i));
            var okMaybeItsAMatchString = (classAndID.attr('class') || '') + '|' + (classAndID.attr('id') || '');
            if (okMaybeItsAMatchString.search(regexps.okMaybeItsACandidateRe) != -1) {
              remove = false;
              break;
            }
          }
          if (remove) {
            logger.debug('Removing unlikely candidate -', unlikelyMatchString);
            return node.remove();
          }
        }
      }
    }
    /* Remove Elements that have no children and have no content */
    if (nodeType == 'div' && !node.children().length && !node.text().trim()) {
      return node.remove();
    }
    /* Remove Style */
    node.removeAttr('style');
    /* Turn all divs that don't have children block level elements into p's */
    var considerDIVs = options.considerDIVs;
    if (typeof considerDIVs == 'undefined') {
      considerDIVs = true;
    }
    if (considerDIVs && nodeType == 'div') {
      if (node.html().search(regexps.divToPElementsRe) == -1) {
        try {
          logger.debug('Altering div to p:', node.html());
          node.replaceWith('<p class="readability-div2p">' + node.html() + '</p>');
        } catch (e) {
          logger.error('Could not alter div to p, reverting back to div.', e);
        }
      } else { /* EXPERIMENTAL */
        node.contents().each(function (index, element) {
          var child = $(element);
          if (!child || !child.length) {
            return;
          }
          if (element.type == 'text' && element.data && element.data.trim()) {
            logger.debug('replacing text node with a p tag with the same content.', element.data);
            child.replaceWith('<p class="readability-txt2p">' + element.data + '</p>');
          }
        });
      }
    }
  });
};

/**
 *  Loop through all paragraphs, and assign a score to them based on how content-y they look.
 *  Then add their score to their parent node.
 *  A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
 *  @param $
 *  @param options
 *  @return candidates
 */
var assignScore = function ($, options) {
  var candidates = [];
  if (!options.nodesToScore) {
    /* default nodesToScore */
    options.nodesToScore = ['p', 'pre'];
  }
  $(options.nodesToScore.join()).each(function (index, element) {
    var paragraph       = $(element);
    var parentNode      = paragraph.parent();
    var grandParentNode = parentNode ? parentNode.parent() : null;
    var innerText       = helpers.getInnerText(paragraph);
    if (!parentNode || !parentNode.length) {
      return;
    }
    /* If this paragraph is less than 25 characters, don't even count it. */
    if (innerText.length < 25) {
      return;
    }
    /* Initialize readability data for the parent. */
    if (!parentNode.data('readabilityScore')) {
      helpers.initializeNode(parentNode);
      candidates.push(parentNode);
    }
    /* Initialize readability data for the grandparent. */
    if (grandParentNode && grandParentNode.length && !grandParentNode.data('readabilityScore')) {
      helpers.initializeNode(grandParentNode);
      candidates.push(grandParentNode);
    }
    /* Add a point for the paragraph itself as a base. */
    var contentScore = 1;
    /* Add points for any commas within this paragraph */
    /* support Chinese commas. */
    var commas = innerText.match(/[,，.。;；?？、]/g);
    if (commas && commas.length) {
      contentScore += commas.length;
    }
    /* For every 100 characters in this paragraph, add another point. Up to 3 points. */
    contentScore += Math.min(Math.floor(innerText.length / 100), 3);
    /* Add the score to the parent. The grandparent gets half. */
    parentNode.data('readabilityScore', parentNode.data('readabilityScore') + contentScore);
    if (grandParentNode) {
      grandParentNode.data('readabilityScore', grandParentNode.data('readabilityScore') + contentScore / 2);
    }
  });
  return candidates;
};

/**
 *  After we've calculated scores, loop through all of the possible candidate nodes we found and find the one with the highest score.
 *  @param candidates
 *  @param $
 *  @return topCandidate
 */
var findHighestScore = function (candidates, $) {
  var topCandidate;
  candidates.forEach(function (candidate) {
    var score       = candidate.data('readabilityScore');
    var linkDensity = helpers.getLinkDensity(candidate, $);
    var siblings    = 0;
    candidate.children('p').each(function (index, element) {
      if ($(element).text().trim().length) {
        siblings++;
      }
    });
    var imgs = candidate.find('img').length;
    imgs = Math.min(2, Math.max(imgs, 1));
    /**
     *  Scale the final candidates score based on link density.
     *  Good content should have a relatively small link density (5% or less) and be mostly unaffected by this operation.
     */
    candidate.data('readabilityScore', Math.min(2, Math.max(siblings, 1)) * score * (1 - linkDensity) * imgs);
    logger.debug('Candidate with score %d (%s|%s): %s', candidate.data('readabilityScore'), candidate.attr('class'), candidate.attr('id'), candidate);
    if (!topCandidate || candidate.data('readabilityScore') > topCandidate.data('readabilityScore')) {
      topCandidate = candidate;
    }
  });
  /**
   *  If we still have no top candidate, just use the body as a last resort.
   *  We also have to copy the body node so it is something we can modify.
   *  Should not happen.
   */
  if (!topCandidate) {
    /* With no top candidate, bail out if no body tag exists as last resort. */
    return $('body');
  }
  return topCandidate;
};

/**
 *  Now that we have the top candidate, look through its siblings for content that might also be related.
 *  Things like preambles, content split by ads that we removed, etc.
 *  @param topCandidate
 *  @param $
 *  @param options
 *  @return articleContent
 */
var getArticleContent = function (topCandidate, $, options) {
  var articleContent = $('<div id="readability-content"></div>');
  /* Perhaps the topCandidate haven't parent? */
  var parentNode = topCandidate.parent();
  if (!parentNode || !parentNode.length) {
    articleContent.appendChild(topCandidate);
    return;
  }
  var siblingNodes = parentNode.children();
  siblingNodes.each(function (index, element) {
    var siblingNode = $(element);
    /**
     *  Fix for odd IE7 Crash where siblingNode does not exist even though this should be a live nodeList.
     *  Example of error visible here: http://www.esquire.com/features/honesty0707
     */
    if (!siblingNode || !siblingNode.length) {
      return;
    }
    logger.debug('Looking at sibling node with score %d (%s|%s): %s', siblingNode.data('readabilityScore'), siblingNode.attr('class'), siblingNode.attr('id'), siblingNode);
    /* siblingNode is topCandidate */
    var append = siblingNode.is(topCandidate);
    /* siblingNode is img or have imgs */
    if (!append) {
      append = element.name == 'img' || siblingNode.find('img').length;
    }
    /* siblingNode's readabilityScore + contentBonus > siblingScoreThreshold */
    if (!append) {
      var siblingScore = siblingNode.data('readabilityScore');
      if (siblingScore) {
        var contentBonus = 0;
        var topNodeScore = topCandidate.data('readabilityScore');
        /* Give a bonus if sibling nodes and top candidates have the example same classname */
        if (topCandidate.attr('class') && topCandidate.attr('class') == siblingNode.attr('class')) {
          contentBonus += topNodeScore * 0.2;
        }
        var siblingScoreThreshold = Math.max(10, topNodeScore * 0.2);
        append = siblingScore + contentBonus >= siblingScoreThreshold;
      }
    }
    /* siblingNode's linkDensity < 0.25 */
    if (!append) {
      if (!options.nodesToAppend) {
        /* default nodesToAppend */
        options.nodesToAppend = ['p'];
      }
      if (options.nodesToAppend.indexOf(element.name) != -1) {
        siblingNode.find('a').each(function (index, element) {
          if (!$(element).text().trim()) {
            $(element).remove();
          }
        });
        append = helpers.getLinkDensity(siblingNode, $) < 0.25;
      }
    }
    /* append siblingNode to articleContent */
    if (append) {
      logger.debug('Appending node: ', siblingNode);
      /* To ensure a node does not interfere with readability styles, remove its classnames */
      siblingNode.attr('origClass', siblingNode.attr('class'));
      /* Append sibling and subtract from our list because it removes the node when you append to another node */
      articleContent.append(siblingNode);
    }
  });
  return articleContent;
};

module.exports = grabArticle;