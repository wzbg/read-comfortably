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

var regexps = require('./regexps');
var helpers = require('./helpers');
var prepArticle = require('./prepArticle');

/**
 *  grabArticle - Using a variety of metrics (content score, classname, element types), find the content that is most likely to be the stuff a user wants to read. Then return it wrapped up in a div.
 *  @return document
 *  @return options
 *  @return preserveUnlikelyCandidates
 *  @return string (Article Content)
 */
var grabArticle = function (document, options, preserveUnlikelyCandidates) {
  /**
   *  preprocess which should be a function to check or modify downloaded source before passing it to readability.
   *  options.preprocess = callback(source, response, contentType, callback);
   */
  var preprocess = options.preprocess;
  if (preprocess) {
    delete options.preprocess;
    preprocess(document, options, function(err, document, options) {
      if (err) {
        logger.error(err);
      }
      grabArticle(document, options, preserveUnlikelyCandidates);
    });
  } else {
    prepping(document, preserveUnlikelyCandidates); // First, node prepping
    var candidates = assignScore(document, options); // assign a score to them based on how content-y they look
    var topCandidate = findHighestScore(candidates, document, options); // find the one with the highest score
    var articleContent = getArticleContent(topCandidate, document, options); // Append the nodes to articleContent
    if (!preserveUnlikelyCandidates && !helpers.getInnerText(articleContent, false)) {
      articleContent = grabArticle(document, options, true); // preserve unlikely candidates grab article again
    }
    return articleContent;
  }
};

/**
 *  First, node prepping. Trash nodes that look cruddy (like ones with the class name 'comment', etc), and turn divs
 *  into P tags where they have been used inappropriately (as in, where they contain no other block level elements.)
 *  Note: Assignment from index for performance. See http://www.peachpit.com/articles/article.aspx?p=31567&seqNum=5
 *  TODO: Shouldn't this be a reverse traversal?
 *  @param document
 *  @return void
 */
var prepping = function (document, preserveUnlikelyCandidates) {
  var allElements = document.getElementsByTagName('*');
  for (var nodeIndex = 0; node = allElements[nodeIndex]; nodeIndex++) {
    /* Remove unlikely candidates */
    if (!preserveUnlikelyCandidates) {
      var unlikelyMatchString = node.className + node.id;
      if (unlikelyMatchString.search(regexps.unlikelyCandidatesRe) != -1 && unlikelyMatchString.search(regexps.okMaybeItsACandidateRe) == -1 && ['HTML', 'BODY'].indexOf(node.tagName) != -1) {
        logger.debug('Removing unlikely candidate -', unlikelyMatchString);
        node.parentNode.removeChild(node);
        nodeIndex--;
        continue;
      }
    }
    /* Turn all divs that don't have children block level elements into p's */
    if (node.tagName == 'DIV') {
      if (node.innerHTML.search(regexps.divToPElementsRe) == -1) {
        logger.debug('Altering div to p');
        var newNode = document.createElement('p');
        try {
          newNode.innerHTML = node.innerHTML;
          node.parentNode.replaceChild(newNode, node);
          nodeIndex--;
        } catch (e) {
          logger.error('Could not alter div to p, probably an IE restriction, reverting back to div.');
        }
      } else {
        /* EXPERIMENTAL */
        node.childNodes._toArray().forEach(function(childNode) {
          if (childNode.nodeType == 3) { // Node.TEXT_NODE = 3
            logger.debug('replacing text node with a p tag with the same content.');
            var p = document.createElement('p');
            p.innerHTML = childNode.nodeValue;
            p.style.display = 'inline';
            p.className = 'readability-styled';
            childNode.parentNode.replaceChild(p, childNode);
          }
        });
      }
    }
  }
};

/**
 *  Loop through all paragraphs, and assign a score to them based on how content-y they look.
 *  Then add their score to their parent node.
 *  A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
 *  @param document
 *  @param options
 *  @return candidates
 */
var assignScore = function (document, options) {
  var candidates = [];
  if (!options.nodesToScore) {
    options.nodesToScore = ['p', 'pre']; // default nodesToScore
  }
  options.nodesToScore.forEach(function(nodesToScore) {
    document.getElementsByTagName(nodesToScore)._toArray().forEach(function(paragraph) {
      var parentNode      = paragraph.parentNode;
      var grandParentNode = parentNode ? parentNode.parentNode : null;
      var innerText       = helpers.getInnerText(paragraph);
      if (!parentNode || !parentNode.tagName) {
        return;
      }
      /* If this paragraph is less than 25 characters, don't even count it. */
      if (innerText.length < 25) {
        return;
      }
      /* Initialize readability data for the parent. */
      if (!parentNode.readability) {
        helpers.initializeNode(parentNode);
        candidates.push(parentNode);
      }
      /* Initialize readability data for the grandparent. */
      if (grandParentNode && !grandParentNode.readability && grandParentNode.tagName) {
        helpers.initializeNode(grandParentNode);
        candidates.push(grandParentNode);
      }
      var contentScore = 0;
      /* Add a point for the paragraph itself as a base. */
      contentScore++;
      /* Add points for any commas within this paragraph */
      contentScore += innerText.replace('，', ',').split(',').length;
      /* For every 100 characters in this paragraph, add another point. Up to 3 points. */
      contentScore += Math.min(Math.floor(innerText.length / 100), 3);
      /* Add the score to the parent. The grandparent gets half. */
      parentNode.readability.contentScore += contentScore;
      if (grandParentNode) {
        grandParentNode.readability.contentScore += contentScore / 2;
      }
    });
  });
  return candidates;
};

/**
 *  After we've calculated scores, loop through all of the possible candidate nodes we found and find the one with the highest score.
 *  @param candidates
 *  @param document
 *  @param options
 *  @return topCandidate
 */
var findHighestScore = function (candidates, document, options) {
  var topCandidate;
  candidates.forEach(function(candidate) {
    /**
     *  Scale the final candidates score based on link density. Good content should have a relatively small link density (5% or less) and be mostly unaffected by this operation.
     */
    candidate.readability.contentScore = candidate.readability.contentScore * (1 - helpers.getLinkDensity(candidate));
    logger.debug('Candidate: ' + candidate + ' (' + candidate.className + ':' + candidate.id + ') with score ' + candidate.readability.contentScore);
    if (!topCandidate || candidate.readability.contentScore > topCandidate.readability.contentScore) {
      topCandidate = candidate;
    }
  });
  /**
   *  If we still have no top candidate, just use the body as a last resort.
   *  We also have to copy the body node so it is something we can modify.
   */
  if (!topCandidate || topCandidate.tagName == 'BODY') {
    // With no top candidate, bail out if no body tag exists as last resort.
    topCandidate = document.createElement('DIV');
    var documentBody = document.body;
    if (!documentBody) {
      logger.warn('No body tag was found.');
      documentBody = document.documentElement;
    }
    topCandidate.innerHTML = documentBody.innerHTML;
    documentBody.innerHTML = '';
    documentBody.appendChild(topCandidate);
    helpers.initializeNode(topCandidate);
  }
  return topCandidate;
};

/**
 *  Now that we have the top candidate, look through its siblings for content that might also be related.
 *  Things like preambles, content split by ads that we removed, etc.
 *  @param topCandidate
 *  @param document
 *  @param options
 *  @return articleContent
 */
var getArticleContent = function (topCandidate, document, options) {
  var articleContent        = document.createElement('DIV');
      articleContent.id     = 'readability-content';
  var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
  var siblingNodes          = topCandidate.parentNode.childNodes;
  for (var s = 0, sl = siblingNodes.length; s < sl; s++) {
    var siblingNode = siblingNodes[s];
    var append      = false;
    /**
     *  Fix for odd IE7 Crash where siblingNode does not exist even though this should be a live nodeList.
     *  Example of error visible here: http://www.esquire.com/features/honesty0707
     */
    if (!siblingNode) {
      continue;
    }
    logger.debug('Looking at sibling node: ' + siblingNode + ' (' + siblingNode.className + ':' + siblingNode.id + ')' + (siblingNode.readability ? (' with score ' + siblingNode.readability.contentScore) : ''));
    logger.debug('Sibling has score ' + (siblingNode.readability ? siblingNode.readability.contentScore : 'Unknown'));
    if (siblingNode == topCandidate) {
      append = true;
    }
    var contentBonus = 0;
    /* Give a bonus if sibling nodes and top candidates have the example same classname */
    if (topCandidate.className && topCandidate.className ==  siblingNode.className) {
        contentBonus += topCandidate.readability.contentScore * 0.2;
    }
    if (siblingNode.readability && siblingNode.readability.contentScore + contentBonus >= siblingScoreThreshold) {
      append = true;
    }
    if (siblingNode.nodeName == 'P') {
      var linkDensity = helpers.getLinkDensity(siblingNode);
      var nodeContent = helpers.getInnerText(siblingNode);
      var nodeLength  = nodeContent.length;
      if (nodeLength > 80 && linkDensity < 0.25) {
        append = true;
      } else if (nodeLength < 80 && linkDensity == 0 && nodeContent.search(/\.( |$)/) != -1) {
        append = true;
      }
    }
    if (append) {
      logger.debug('Appending node: ' + siblingNode);
      var nodeToAppend;
      if (['DIV', 'P'].indexOf(siblingNode.nodeName) == -1) {
        /* We have a node that isn't a common block level element, like a form or td tag. Turn it into a div so it doesn't get filtered out later by accident. */
        logger.debug('Altering siblingNode of ' + siblingNode.nodeName + ' to div.');
        nodeToAppend = document.createElement('DIV');
        try {
          nodeToAppend.id = siblingNode.id;
          nodeToAppend.innerHTML = siblingNode.innerHTML;
        } catch (e) {
          logger.debug('Could not alter siblingNode to div, probably an IE restriction, reverting back to original.');
          nodeToAppend = siblingNode;
          s--;
          sl--;
        }
      } else {
        nodeToAppend = siblingNode;
        s--;
        sl--;
      }
      /* To ensure a node does not interfere with readability styles, remove its classnames */
      nodeToAppend.className = '';
      /* Append sibling and subtract from our list because it removes the node when you append to another node */
      articleContent.appendChild(nodeToAppend);
    }
  }
  /**
   *  So we have all of the content that we need. Now we clean it up for presentation.
   */
  prepArticle(articleContent, options);
  return articleContent;
};

module.exports = grabArticle;