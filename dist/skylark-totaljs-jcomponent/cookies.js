/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./langx"],function(e){function n(n,t,r){var i=typeof r;if("number"===i){var o=e.now();o.setTime(o.getTime()+24*r*60*60*1e3),r=o}else"string"===i&&(r=new Date(Date.now()+r.parseExpire()));document.cookie=n.env()+"="+t+"; expires="+r.toGMTString()+"; path=/"}return{get:function(e){e=e.env();for(var n=document.cookie.split(";"),t=0;t<n.length;t++){var r=n[t];" "===r.charAt(0)&&(r=r.substring(1));var i=r.split("=");if(i.length>1&&i[0]===e)return i[1]}return""},set:n,rem:function(e){n(e.env(),"",-1)}}});
//# sourceMappingURL=sourcemaps/cookies.js.map
