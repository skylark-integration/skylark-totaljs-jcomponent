/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../jc"],function(n,e){var i=n.topic,c="skylark.vmm.env",t={};return e.env=function(e,r){return n.isObject(e)?(e&&Object.keys(e).forEach(function(n){t[n]=e[n],i.publish(c,n,e[n])}),e):void 0!==r?(i.publish(c,e,r),r):t[e]}});
//# sourceMappingURL=../sourcemaps/utils/env.js.map
