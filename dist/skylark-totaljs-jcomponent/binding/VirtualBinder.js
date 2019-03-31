/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../utils/query","./parsebinder"],function(n,e,t){var i="[data-bind],[bind],[data-vbind]";function r(r){var a=this,d=a.element=e(r);a.binders=[];var s=function(){var i=e(this),r=i.attrd("bind")||i.attr("bind")||i.attrd("vbind");this.$jcbind=t(this,r,n.empties.array),this.$jcbind&&a.binders.push(this.$jcbind)};d.filter(i).each(s),d.find(i).each(s)}var a=r.prototype;return a.on=function(){var n=this;return n.element.on.apply(n.element,arguments),n},a.remove=function(){var n=this,e=n.element;return e.find("*").off(),e.off().remove(),n.element=null,n.binders=null,n=null},a.set=function(n,e){var t=this;null==e&&(e=n,n="");for(var i=0;i<t.binders.length;i++){var r=t.binders[i];if(!n||n===r.path){var a=n||!r.path?e:$get(r.path,e);t.binders[i].exec(a,r.path)}}return t},r});
//# sourceMappingURL=../sourcemaps/binding/VirtualBinder.js.map
