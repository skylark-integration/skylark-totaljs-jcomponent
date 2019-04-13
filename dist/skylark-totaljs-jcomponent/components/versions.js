/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define([],function(){var n={};return{get:function(r){return n[r]},set:function(){for(var r=0;r<arguments.length;r++)for(var t=arguments[r].split(","),i=0;i<t.length;i++){var e=t[i].trim(),f=e.indexOf("@");if(-1!==f){var u=e.substring(f+1);e=e.substring(0,f),u&&(n[e]=u)}}}}});
//# sourceMappingURL=../sourcemaps/components/versions.js.map
