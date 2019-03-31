/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../jc","../topic","../defaults"],function(n,t,e){var i="environment",r=/(\[.*?\])/gi,u=e.environment={};return SP.env=function(){return this.replace(r,function(n){return ENV[n.substring(1,n.length-1)]||n})},SP.$env=function(){var n=this.indexOf("?");return-1===n?this.env():this.substring(0,n).env()+this.substring(n)},n.env=function(n,t){return langx.isObject(n)?(n&&Object.keys(n).forEach(function(t){u[t]=n[t],EMIT(i,t,n[t])}),n):void 0!==t?(EMIT(i,n,t),ENV[n]=t,t):u[n]}});
//# sourceMappingURL=../sourcemaps/utils/env.js.map
