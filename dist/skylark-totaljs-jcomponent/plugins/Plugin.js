/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-utils-dom/query","../jc","../utils/cache","./_registry","./schedulers"],function(e,t,n,l,i){function r(e,t){/\W/.test(e)&&warn("Plugin name must contain A-Z chars only."),l[e]&&l[e].$remove(!0);var n=this;n.id="plug"+e,n.name=e,l[e]=n,t.call(n,n)}return r.prototype.$remove=function(){return!this.element||(i.clearAll(this.id),this.element=null,delete l[this.name],!0)},r});
//# sourceMappingURL=../sourcemaps/plugins/Plugin.js.map
