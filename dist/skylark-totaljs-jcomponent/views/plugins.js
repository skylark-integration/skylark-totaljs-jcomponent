/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../utils/query","../jc"],function(e,n){return function n(){var t={};function r(n,r){/\W/.test(n)&&warn("Plugin name must contain A-Z chars only."),t[n]&&t[n].$remove(!0);var i=this;i.element=e(".importing"),i.id="plug"+n,i.name=n,t[n]=i,r.call(i,i)}return r.prototype.$remove=function(){return!this.element||(this.element=null,delete t[this.name],!0)},{Plugin:r,register:function(e,n){return n?new r(e,n):t[e]},registry:t,find:function(e){return t[e]},clean:function(){var e=n.registry;Object.keys(e).forEach(function(n){var t=e[n];inDOM(t.element[0])&&t.element[0].innerHTML||(t.$remove(),delete e[n])})}}}});
//# sourceMappingURL=../sourcemaps/views/plugins.js.map
