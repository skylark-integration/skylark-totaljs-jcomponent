/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-utils-dom/query","./jc","./caches","./topic","./schedulers"],function(e,n,t,r,i){var o={};function u(n,i){/\W/.test(n)&&warn("Plugin name must contain A-Z chars only."),o[n]&&o[n].$remove(!0);var u=this;u.element=e(t.current.element||document.body),u.id="plug"+n,u.name=n,o[n]=u;var c=t.current.owner;t.current.owner=u.id,i.call(u,u),t.current.owner=c,r.emit("plugin",u)}return u.prototype.$remove=function(){var e=this;return!e.element||(r.emit("plugin.destroy",e),e.destroy&&e.destroy(),Object.keys(events).forEach(function(n){var t=events[n];(t=t.remove("owner",e.id)).length||delete events[n]}),watches=watches.remove("owner",e.id),r.off(e.id+"#watch"),i.clearAll(e.id),e.element=null,delete o[e.name],!0)},n.plugins={Plugin:u,find:function(e){return o[e]},registry:o,register:function(e,n){return n?new u(e,n):o[e]}}});
//# sourceMappingURL=sourcemaps/plugins.js.map
