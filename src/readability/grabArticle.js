/* 
* @Author: zyc
* @Date:   2015-11-29 17:02:46
* @Last Modified by:   zyc
* @Last Modified time: 2015-11-29 22:44:03
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
const logger = log4js.getLogger('grabArticle');
logger.setLevel('FATAL');
// logger.setLevel('DEBUG');

const regexps = require('./regexps');
const helpers = require('./helpers');

/**
 *  grabArticle - Using a constiety of metrics (content score, classname, element types),
 *           find the content that is most likely to be the stuff a user wants to read.
 *           Then return it wrapped up in a div.
 *  @param $
 *  @param url
 *  @param options
 *  @param preserveUnlikelyCandidates
 *  @return string (Article Content)
 */
const grabArticle = ($, url, options, preserveUnlikelyCandidates) => {
  /**
   *  preprocess which should be a function to check or modify downloaded source before passing it to readability.
   *  options.preprocess = callback($, options);
   */
  const preprocess = options.preprocess;
  if (typeof preprocess == 'function') preprocess($, options);
  helpers.setImageSrc($, options); // Set the src attribute of the images or other tags for use
  helpers.fixLinks($, url, options); // Converts relative urls to absolute for images and links
  prepping($, options, preserveUnlikelyCandidates); // First, node prepping
  const candidates     = assignScore($, options); // assign a score to them based on how content-y they look
  const topCandidate   = findHighestScore(candidates, $); // find the top candidate with the highest score
  const articleContent = getArticleContent(topCandidate, $, options); // Append the nodes to articleContent
  if (!options.afterToRemove) options.afterToRemove = ['script', 'noscript']; // default afterToRemove
  articleContent.find(options.afterToRemove.join()).remove();
  /**
   *  postprocess which should be a function to check or modify article content after passing it to readability.
   *  options.postprocess = callback(node, $);
   */
  const postprocess = options.postprocess;
  if (typeof postprocess == 'function') postprocess(articleContent, $);
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
const prepping = ($, options, preserveUnlikelyCandidates) => {
  /* Removing unnecessary nodes */
  if (options.nodesToRemove) $(options.nodesToRemove.join()).remove();
  if (!options.noChdToRemove) options.noChdToRemove = ['div']; // default noChdToRemove
  $('*', 'body').each((index, element) => {
    const node = $(element);
    /* If node is null, return, otherwise Illegal Access Error */
    if (!node || !node.length) return;
    const nodeType = element.name;
    logger.trace('%d[%s]:', index, nodeType, node.html());
    /* Remove unlikely candidates */
    if (!preserveUnlikelyCandidates) {
      const unlikelyMatchString = (node.attr('class') || '') + '|' + (node.attr('id') || '');
      if (unlikelyMatchString) {
        const unlikelyCandidatesReIndex = unlikelyMatchString.search(regexps.unlikelyCandidatesRe);
        logger.trace('%s[unlikelyCandidatesReIndex=%d]', unlikelyMatchString, unlikelyCandidatesReIndex);
        let unlikeThisNode = unlikelyCandidatesReIndex != -1;
        if (!unlikeThisNode) {
          const extraneousReIndex = unlikelyMatchString.search(regexps.extraneousRe);
          logger.trace('%s[extraneousReIndex=%d]', unlikelyMatchString, extraneousReIndex);
          unlikeThisNode = extraneousReIndex != -1;
        }
        if (unlikeThisNode) {
          const classAndIDs = node.find('[class],[id]');
          let removeThisNode = true;
          for (let i = -1; i < classAndIDs.length; i++) {
            const classAndID = i > -1 ? $(classAndIDs.get(i)) : node;
            const okMaybeItsAMatchString = (classAndID.attr('class') || '') + '|' + (classAndID.attr('id') || '');
            const okMaybeItsACandidateReIndex = okMaybeItsAMatchString.search(regexps.okMaybeItsACandidateRe);
            logger.trace('%s[okMaybeItsACandidateReIndex=%d]', okMaybeItsAMatchString, okMaybeItsACandidateReIndex);
            if (okMaybeItsACandidateReIndex != -1) {
              removeThisNode = false;
              break;
            }
          }
          if (removeThisNode) {
            logger.debug('Removing unlikely candidate -', unlikelyMatchString);
            return node.remove();
          }
        }
      }
    }
    /* Remove Elements that have no children and have no content */
    if (options.noChdToRemove.indexOf(nodeType) != -1 && !node.children().length && !node.text().trim()) {
      logger.debug('Removing Element - %s (%s|%s)', nodeType, node.attr('class'), node.attr('id'));
      return node.remove();
    }
    /* Remove Style */
    node.removeAttr('style');
    /* Turn all divs that don't have children block level elements into p's */
    if (options.considerDIVs && nodeType == 'div') {
      if (node.html().search(regexps.divToPElementsRe) == -1) {
        try {
          logger.debug('Altering div to p:', node.html());
          node.replaceWith('<p class="readability-div2p">' + node.html() + '</p>');
        } catch (e) {
          logger.error('Could not alter div to p, reverting back to div.', e);
        }
      } else { /* EXPERIMENTAL */
        node.contents().each((index, element) => {
          const child = $(element);
          if (!child || !child.length) return;
          if (element.type == 'text' && element.data && element.data.trim()) {
            /* use span instead of p. Need more tests. */
            logger.debug('replacing text node with a span tag with the same content.', element.data);
            child.replaceWith('<span class="readability-txt2span">' + element.data + '</span>');
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
const assignScore = ($, options) => {
  const candidates = [];
  if (!options.nodesToScore) options.nodesToScore = ['p', 'article']; // default nodesToScore
  $(options.nodesToScore.join()).each((index, element) => {
    const paragraph = $(element);
    const innerText = helpers.getInnerText(paragraph);
    /* If this paragraph is less than 25 characters, don't even count it. */
    if (innerText.length < 25) return;
    /* Add a point for the paragraph itself as a base. */
    let contentScore = 1;
    /* Add points for any commas within this paragraph */
    /* support Chinese commas. */
    const commas = innerText.match(/[,，.。;；?？、]/g);
    if (commas && commas.length) contentScore += commas.length;
    /* For every 100 characters in this paragraph, add another point. Up to 3 points. */
    contentScore += Math.min(Math.floor(innerText.length / 100), 3);
    for (let parentNode = paragraph.parent(); parentNode && parentNode.length; parentNode = parentNode.parent()) {
      /* Initialize readability data for the parent. */
      if (!parentNode.data('readabilityScore')) {
        helpers.initializeNode(parentNode);
        candidates.push(parentNode);
      }
      /* Add the score to the parent. The grandparent gets half. */
      parentNode.data('readabilityScore', parentNode.data('readabilityScore') + contentScore);
      contentScore /= 2;
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
const findHighestScore = (candidates, $) => {
  let topCandidate;
  for (let candidate of candidates) {
    const score       = candidate.data('readabilityScore');
    const linkDensity = helpers.getLinkDensity(candidate, $);
    let siblings      = 0;
    candidate.children('p').each((index, element) => {
      if ($(element).text().trim().length) siblings++;
    });
    let imgs = candidate.find('img').length;
    imgs = Math.min(2.6, Math.max(imgs, 1));
    /**
     *  Scale the final candidates score based on link density.
     *  Good content should have a relatively small link density (5% or less) and be mostly unaffected by this operation.
     */
    candidate.data('readabilityScore', Math.min(2, Math.max(siblings, 1)) * score * (1 - linkDensity) * imgs);
    logger.debug('Candidate with score %d (%s|%s): %s', candidate.data('readabilityScore'), candidate.attr('class'), candidate.attr('id'), candidate);
    if (!topCandidate || candidate.data('readabilityScore') > topCandidate.data('readabilityScore')) topCandidate = candidate;
  }
  /**
   *  If we still have no top candidate, just use the body as a last resort.
   *  We also have to copy the body node so it is something we can modify.
   *  Should not happen.
   */
  if (!topCandidate) {
    /* With no top candidate, bail out if no body tag exists as last resort. */
    topCandidate = $('body');
    topCandidate.replaceWith('<div class="readability-body2div">' + topCandidate.html() + '</div>');
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
const getArticleContent = (topCandidate, $, options) => {
  logger.trace('Top candidate with score %d (%s|%s): %s', topCandidate.data('readabilityScore'), topCandidate.attr('class'), topCandidate.attr('id'), topCandidate);
  /* Perhaps the topCandidate haven't parent? */
  const parentNode = topCandidate.parent();
  if (!parentNode || !parentNode.length) return topCandidate;
  const parentNodeClass = parentNode.attr('class');
  const topCandidateClass = topCandidate.attr('class');
  if (topCandidateClass && parentNodeClass && !topCandidateClass.search(parentNodeClass.trim())) return getArticleContent(parentNode, $, options);
  const siblingNodes = parentNode.children();
  if (siblingNodes.length == 1 && parentNode.get(0).name != 'body') return getArticleContent(parentNode, $, options);
  if (!options.nodesToAppend) options.nodesToAppend = ['p']; // default nodesToAppend
  const articleContent = $('<div id="readability-content"></div>');
  siblingNodes.each((index, element) => {
    const siblingNode = $(element);
    /**
     *  Fix for odd IE7 Crash where siblingNode does not exist even though this should be a live nodeList.
     *  Example of error visible here: http://www.esquire.com/features/honesty0707
     */
    if (!siblingNode || !siblingNode.length) return;
    logger.debug('Looking at sibling node with score %d (%s|%s): %s', siblingNode.data('readabilityScore'), siblingNode.attr('class'), siblingNode.attr('id'), siblingNode);
    /* siblingNode is topCandidate */
    let append = siblingNode.is(topCandidate);
    /* siblingNode is img or have an img */
    if (!append) {
      append = element.name == 'img';
      if (!append) {
        siblingNode.find('noscript').remove();
        append = siblingNode.find('img').length == 1;
      }
    }
    /* siblingNode may be its a candidate */
    if (!append) {
      const okMaybeItsAMatchString = (siblingNode.attr('class') || '') + '|' + (siblingNode.attr('id') || '');
      append = okMaybeItsAMatchString.search(regexps.okMaybeItsACandidateRe) != -1;
    }
    /* siblingNode's readabilityScore + contentBonus > siblingScoreThreshold */
    if (!append) {
      const siblingScore = siblingNode.data('readabilityScore');
      if (siblingScore) {
        let contentBonus = 0;
        const topNodeScore = topCandidate.data('readabilityScore');
        /* Give a bonus if sibling nodes and top candidates have the example same classname */
        if (topCandidateClass && topCandidateClass == siblingNode.attr('class')) contentBonus += topNodeScore * 0.2;
        const siblingScoreThreshold = Math.max(10, topNodeScore * 0.2);
        append = siblingScore + contentBonus >= siblingScoreThreshold;
      }
    }
    /* siblingNode's linkDensity < 0.25 */
    if (!append) {
      if (options.nodesToAppend.indexOf(element.name) != -1) {
        siblingNode.find('a').each((index, element) => {
          if (!$(element).text().trim()) $(element).remove();
        });
        append = helpers.getLinkDensity(siblingNode, $) < 0.25;
      }
    }
    /* append siblingNode to articleContent */
    if (append) {
      logger.debug('Appending node: ', siblingNode);
      /* Append sibling and subtract from our list because it removes the node when you append to another node */
      articleContent.append(siblingNode);
    }
  });
  return articleContent;
};

module.exports = grabArticle;