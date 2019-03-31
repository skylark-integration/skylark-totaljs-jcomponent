/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-utils-dom/query","./jc","./plugins/Plugin"],function(n,u,i){var r={};return{Plugin:i,plugin:function(n,u){return u?new i(n,u):r[n]},find:function(n){return r[n]}}});
//# sourceMappingURL=sourcemaps/plugins.js.map
