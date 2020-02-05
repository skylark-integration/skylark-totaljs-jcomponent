/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../utils/query","../utils/cache","./_registry"],function(e,t,n){function i(e,t){/\W/.test(e)&&warn("Plugin name must contain A-Z chars only."),n[e]&&n[e].$remove(!0);var i=this;i.id="plug"+e,i.name=e,n[e]=i,t.call(i,i)}return i.prototype.$remove=function(){return!this.element||(this.element=null,delete n[this.name],!0)},i});
//# sourceMappingURL=../sourcemaps/plugins/Plugin.js.map
