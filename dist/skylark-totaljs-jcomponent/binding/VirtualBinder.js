/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../utils/query","./parse"],function(n,e,t){var r="[data-bind],[bind],[data-vbind]";function i(i){var a=this,d=a.element=e(i);a.binders=[];var l=function(){var r=e(this),i=r.attrd("bind")||r.attr("bind")||r.attrd("vbind");this.$jcbind=t(this,i,n.empties.array,a.binders)};d.filter(r).each(l),d.find(r).each(l)}var a=i.prototype;return a.on=function(){var n=this;return n.element.on.apply(n.element,arguments),n},a.remove=function(){var n=this,e=n.element;return e.find("*").off(),e.off().remove(),n.element=null,n.binders=null,n=null},a.set=function(e,t){var r=this;null==t&&(t=e,e="");for(var i=0;i<r.binders.length;i++){var a=r.binders[i];if(!e||e===a.path){var d=e||!a.path?t:n.result(t,a.path);r.binders[i].exec(d,a.path)}}return r},i});
//# sourceMappingURL=../sourcemaps/binding/VirtualBinder.js.map
