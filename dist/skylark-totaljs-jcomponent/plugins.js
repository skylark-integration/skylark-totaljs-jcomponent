/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./utils/query","./jc","./plugins/_registry","./plugins/Plugin"],function(n,u,i,r){return u.plugins={Plugin:r,plugin:function(n,u){return u?new r(n,u):i[n]},find:function(n){return i[n]}}});
//# sourceMappingURL=sourcemaps/plugins.js.map
