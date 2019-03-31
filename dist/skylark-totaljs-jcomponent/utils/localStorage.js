/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./defaults","./langx","./utils/caches"],function(t,e,n,r){var a="jc.";return{get:function(t){var e=localStorage.getItem(a+t);return e&&n.isString(e)&&(e=n.parse(e)),e},set:function(t,e){return localStorage.setItem(a+t,JSON.stringify(e)),this}}});
//# sourceMappingURL=../sourcemaps/utils/localStorage.js.map
