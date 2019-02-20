/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./topic","./defaults"],function(n,e,t){var c=t.environment={};return n.env=function(n,e){return langx.isObject(n)?(n&&Object.keys(n).forEach(function(e){c[e]=n[e],EMIT(KEY_ENV,e,n[e])}),n):void 0!==e?(EMIT(KEY_ENV,n,e),ENV[n]=e,e):c[n]}});
//# sourceMappingURL=sourcemaps/env.js.map
