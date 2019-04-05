/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx"],function(t){var e="jc.";return{get:function(n){var r=localStorage.getItem(e+n);return r&&t.isString(r)&&(r=t.parse(r)),r},set:function(t,n){return localStorage.setItem(e+t,JSON.stringify(n)),this}}});
//# sourceMappingURL=../sourcemaps/utils/localStorage.js.map
