/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx"],function(e){var t="jc.";return{clear:function(){for(var e=[],r=0;r<localStorage.length;r++){var o=localStorage.key(r);0==o.indexOf(t)&&e.push(o)}for(r=0;r<e.length;r++)localStorage.removeItem(e[r])},get:function(r){var o=localStorage.getItem(t+r);return o&&e.isString(o)&&(o=e.parse(o)),o},remove:function(e){localStorage.removeItem(t+e)},set:function(e,r){return localStorage.setItem(t+e,JSON.stringify(r)),this}}});
//# sourceMappingURL=../sourcemaps/utils/localStorage.js.map
