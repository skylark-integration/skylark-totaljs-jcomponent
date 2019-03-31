/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-utils-dom/query"],function(t){var e="data-jc-scope";t.fn.scope=function(){if(!this.length)return null;var t=this[0].$scopedata;if(t)return t;var n=this.closest("["+e+"]");return n.length&&(t=n[0].$scopedata)?t:null}});
//# sourceMappingURL=../sourcemaps/components/helper.js.map
