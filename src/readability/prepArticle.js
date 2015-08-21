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
var logger = log4js.getLogger('prepArticle');
logger.setLevel('FATAL');

var url = require('url'); // The core url packaged standalone for use with Browserify

var regexps = require('./regexps');
var helpers = require('./helpers');

/**
 *  Prepare the article node for display. Clean out any inline styles,
 *  iframes, forms, strip extraneous <p> tags, etc.
 *  @param Element
 *  @param Object
 *  @return void
 */
var prepArticle = function (articleContent, options) {
  cleanStyles(articleContent);
  killBreaks(articleContent);
  /**
   *  cleanRulers which allow set your own validation rule for tags.
   *  If true rule is valid, otherwise no. options.cleanRulers = [callback(obj, tagName)]
   */
  var cleanRules = options.cleanRules;
  /* Clean out junk from the article content */
  clean(articleContent, 'form', cleanRules);
  clean(articleContent, 'object', cleanRules);
  /**
   *  If there is only one h1, they are probably using it as a header and not a subheader, so remove it since we already have a header.
   */
  if (articleContent.getElementsByTagName('h1').length == 1) {
    clean(articleContent, 'h1', cleanRules);
  }
  /**
   *  If there is only one h2, they are probably using it as a header and not a subheader, so remove it since we already have a header.
   */
  if (articleContent.getElementsByTagName('h2').length == 1) {
    clean(articleContent, 'h2', cleanRules);
  }
  clean(articleContent, 'iframe', cleanRules);
  cleanHeaders(articleContent);
  /* Do these last as the previous stuff may have removed junk that will affect these */
  cleanConditionally(articleContent, 'table');
  cleanConditionally(articleContent, 'ul');
  cleanConditionally(articleContent, 'div');
  /* Remove extra paragraphs */
  var articleParagraphs = articleContent.getElementsByTagName('p');
  articleParagraphs.forEach(function(articleParagraph) {
    var imgCount    = articleParagraph.getElementsByTagName('img').length;
    var embedCount  = articleParagraph.getElementsByTagName('embed').length;
    var objectCount = articleParagraph.getElementsByTagName('object').length;
    if (imgCount == 0 && embedCount == 0 && objectCount == 0 && !helpers.getInnerText(articleParagraphs, false)) {
      articleParagraph.parentNode.removeChild(articleParagraph);
    }
  });
  try {
    articleContent.innerHTML = articleContent.innerHTML.replace(/<br[^>]*>\s*<p/gi, '<p');    
  } catch (e) {
    logger.error('Cleaning innerHTML of breaks failed. This is an IE strict-block-elements bug. Ignoring.');
  }
  fixLinks(articleContent);
};

/**
 *  Remove the style attribute on every e and under.
 *  TODO: Test if getElementsByTagName(*) is faster.
 *  @param Element
 *  @return void
 */
var cleanStyles = function (e) {
  if (!e) {
    return;
  }
  // Remove any root styles, if we're able.
  if (e.removeAttribute && e.className != 'readability-styled') {
    e.removeAttribute('style');
  }
  var cur = e.firstChild;
  // Go until there are no more child nodes
  while (cur) {
    if (cur.nodeType == 1) {
      // Remove style attribute(s) :
      if (cur.className != 'readability-styled') {
        cur.removeAttribute('style');         
      }
      cleanStyles(cur);
    }
    cur = cur.nextSibling;
  }
};

/**
 *  Remove extraneous break tags from a node.
 *  @param Element
 *  @return void
 */
var killBreaks = function (e) {
  try {
    e.innerHTML = e.innerHTML.replace(regexps.killBreaksRe, '<br />');   
  } catch (e) {
    logger.error('KillBreaks failed - this is an IE bug. Ignoring.');
  }
};

/**
 *  Clean a node of all elements of type 'tag'.
 *  (Unless it's a youtube/vimeo video. People love movies.)
 *  @param Element
 *  @param string tag to clean
 *  @param Array clean rules for tag
 *  @return void
 */
var clean = function (e, tag, cleanRules) {
  var targetList = e.getElementsByTagName(tag);
  var isEmbed    = tag == 'object' || tag == 'embed';
  targetList.forEach(function(target) {
    /* user clean rules handler */
    var validRule = false;
    cleanRules.forEach(function(cleanRule) {
      if (cleanRule(target, tag)) {
        validRule = true;
      }
    });
    if (!validRule) {
      return;
    }
    /* Allow youtube and vimeo videos through as people usually want to see those. */
    if (isEmbed && target.innerHTML.search(regexps.videoRe) != -1) {
      return;
    }
    target.parentNode.removeChild(target);
  });
};

/**
 *  Clean out spurious headers from an Element. Checks things like classnames and link density.
 *  @param Element
 *  @return void
 */
var cleanHeaders = function (e) {
  for (var headerIndex = 1; headerIndex < 7; headerIndex++) {
    var headers = e.getElementsByTagName('h' + headerIndex);
    headers.forEach(function(header) {
      if (helpers.getClassWeight(header) < 0 || helpers.getLinkDensity(header) > 0.33 || !header.nextSibling) {
        header.parentNode.removeChild(header);
      }
    });
  }
};

/**
 *  Clean an element of all tags of type 'tag' if they look fishy.
 *  'Fishy' is an algorithm based on content length, classnames, link density, number of images & embeds, etc.
 *  @param Element
 *  @param string tag to clean
 *  @return void
 */
var cleanConditionally = function (e, tag) {
  var tagsList      = e.getElementsByTagName(tag);
  /**
   *  Gather counts for other typical elements embedded within.
   *  Traverse backwards so we can remove nodes at the same time without effecting the traversal.
   *  TODO: Consider taking into account original contentScore here.
   */
  tagsList.forEach(function(target) {
    var weight = helpers.getClassWeight(tags);
    logger.debug('Cleaning Conditionally ' + tags + ' (' + tags.className + ':' + tags.id + ')' + (tags.readability ? (' with score ' + tags.readability.contentScore) : ''));
    if (weight < 0) {
      tags.parentNode.removeChild(tags);
    } else if (getCharCount(tags) < 10) {
      /**
       *  If there are not very many commas, and the number of non-paragraph elements is more than paragraphs or other ominous signs, remove the element.
       */
      var p      = tags.getElementsByTagName('p').length;
      var img    = tags.getElementsByTagName('img').length;
      var li     = tags.getElementsByTagName('li').length - 100;
      var input  = tags.getElementsByTagName('input').length;
      var embedCount = 0;
      var embeds     = tags.getElementsByTagName('embed');
      embeds.forEach(function(embed) {
        if (embed.src.search(regexps.videoRe) == -1) {
          embedCount++; 
        }
      });
      var linkDensity   = helpers.getLinkDensity(tags);
      var contentLength = helpers.getInnerText(tags).length;
      var toRemove      = false;
      if (img > 1 && img > p) {
        toRemove = true;
      } else if (li > p && tag != 'ul' && tag != 'ol') {
        toRemove = true;
      } else if (input > Math.floor(p / 3)) {
        toRemove = true; 
      } else if (contentLength < 25 && (img == 0 || img > 2)) {
        toRemove = true;
      } else if (weight < 25 && linkDensity > .2) {
        toRemove = true;
      } else if (weight >= 25 && linkDensity > .5) {
        toRemove = true;
      } else if ((embedCount == 1 && contentLength < 75) || embedCount > 1) {
        toRemove = true;
      }
      if (toRemove) {
        tags.parentNode.removeChild(tags);
      }
    }
  });
};

/**
 *  Get the number of times a string s appears in the node e.
 *  @param Element
 *  @param string - what to split on. Default is ','
 *  @return number (integer)
 */
var getCharCount = function (e, s) {
  s = s || ',';
  return helpers.getInnerText(e).split(s).length;
};

/**
 *  Converts relative urls to absolute for images and links
 *  @param Element
 *  @return void
 */
var fixLinks = function (e) {
  if (!e.ownerDocument.originalURL) {
    return;
  }
  var fixLink = function (link) {
    var fixed = url.resolve(e.ownerDocument.originalURL, link);
    return fixed;
  }
  var imgs = e.getElementsByTagName('img');
  imgs.forEach(function(img) {
    var src = img.getAttribute('src');
    if (src) {
      img.setAttribute('src', fixLink(src));
    }
  });
  var as = e.getElementsByTagName('a');
  as.forEach(function(a) {
    var href = a.getAttribute('href');
    if (href) {
      a.setAttribute('href', fixLink(href));
    }
  });
};

module.exports = prepArticle;