/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-utils-dom/query","../jc","../utils/cache","../topic","./schedulers"],function(e,t,r,n,i){function o(t,i){/\W/.test(t)&&warn("Plugin name must contain A-Z chars only."),registry[t]&&registry[t].$remove(!0);var o=this;o.element=e(r.current.element||document.body),o.id="plug"+t,o.name=t,registry[t]=o;var c=r.current.owner;r.current.owner=o.id,i.call(o,o),r.current.owner=c,n.emit("plugin",o)}return o.prototype.$remove=function(){var e=this;return!e.element||(n.emit("plugin.destroy",e),e.destroy&&e.destroy(),Object.keys(events).forEach(function(t){var r=events[t];(r=r.remove("owner",e.id)).length||delete events[t]}),watches=watches.remove("owner",e.id),n.off(e.id+"#watch"),i.clearAll(e.id),e.element=null,delete registry[e.name],!0)},o});
//# sourceMappingURL=../sourcemaps/plugins/Plugin.js.map
