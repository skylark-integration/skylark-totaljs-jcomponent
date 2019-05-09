/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx"],function(n){var t=n.topic,i="skylark.vmm.env",r=/(\[.*?\])/gi,e={};function u(n){return n.replace(r,function(n){return e[n.substring(1,n.length-1)]||n})}return String.prototype.env=function(){return u(this)},String.prototype.$env=function(){var n=this.indexOf("?");return-1===n?this.env():this.substring(0,n).env()+this.substring(n)},{variant:function(r,u){return n.isObject(r)?(r&&Object.keys(r).forEach(function(n){e[n]=r[n],t.publish(i,n,r[n])}),r):void 0!==u?(t.publish(i,r,u),u):e[r]},replace:u}});
//# sourceMappingURL=../sourcemaps/utils/envs.js.map
