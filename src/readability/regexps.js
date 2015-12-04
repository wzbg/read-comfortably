/* 
* @Author: zyc
* @Date:   2015-11-24 16:50:36
* @Last Modified by:   zyc
* @Last Modified time: 2015-11-29 19:42:29
*/
'use strict';

module.exports = {
  // 排除候选人
  unlikelyCandidatesRe:    /combx|pager|comment|disqus|foot|header|menu|meta|nav|rss|shoutbox|sidebar|sponsor|share|bookmark|social|advert|leaderboard|instapaper_ignore|entry-unrelated/i,
  // 可能是候选人
  okMaybeItsACandidateRe:  /and|article|body|column|main|shadow|post|text|lazy|title|photo/i,
  // 积极
  positiveRe:              /article|body|content|entry|hentry|main|page|pagination|post|text|blog|story/i,
  // 消极
  negativeRe:              /combx|comment|com-|captcha|contact|foot|footer|footnote|masthead|link|media|meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|shopping|utility|tags|tool|widget|tip|dialog/i,
  // 附加排除候选人
  extraneousRe:            /login|register|signin|signup|related|nothing|button|control|more|option/i,
  // div -> p
  divToPElementsRe:        /<(a|blockquote|dl|div|img|ol|p|pre|table|ul)/i,
  // 替换换行标签 ?
  replaceBrsRe:            /(<br[^>]*>[ \n\r\t]*){2,}/gi,
  // 替换字体标签 ?
  replaceFontsRe:          /<(\/?)font[^>]*>/gi,
  // 头尾
  trimRe:                  /^\s+|\s+$/g,
  // 正常化空白
  normalizeRe:             /\s{2,}/g,
  // 删除多余空白
  killBreaksRe:            /(<br\s*\/?>(\s|&nbsp;?)*){1,}/g,
  // 视频
  videoRe:                 /https?:\/\/(w+\.)?(youtube|vimeo|youku|tudou|56|yinyuetai|iqiyi|letv|hulu|soundcloud|whipclip)\.com/i,
  // 跳过脚注链接 ?
  skipFootnoteLinkRe:      /^\s*(\[?[a-z0-9]{1,2}\]?|^|edit|citation needed)\s*$/i,
  // 下一链接 ?
  nextLinkRe:              /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i, // Match: next, continue, >, >>, » but not >|, »| as those usually mean last.
  // 上一链接 ?
  prevLinkRe:              /(prev|earl|old|new|<|«)/i
};