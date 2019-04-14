/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../utils/domx","../binding/parse","../binding/pathmaker"],function(e,r,n){return function(i){var t,a={},c=[];return{parse:function(e,n,i){return r(e,n,i,{binders:a,bindersnew:c})},pathmaker:n,binder:function(e){return e.$jcbind},binders:a,binderbind:function(e,r,n){for(var t=a[e],c=0;c<t.length;c++){var o=t[c];o.ticks!==n&&(o.ticks=n,o.exec(i.storing.get(o.path),r))}},rebindbinder:function(){t&&clearTimeout(t),t=setTimeout(function(){for(var e=c.splice(0),r=0;r<e.length;r++){var n=e[r];n.init||(n.com?n.exec(n.com.data(n.path),n.path):n.exec(i.storing.get(n.path),n.path))}},50)},clean:function(){keys=Object.keys(a);for(var r=0;r<keys.length;r++){arr=a[keys[r]];for(var n=0;;){var i=arr[n++];if(!i)break;if(!e.inDOM(i.el[0])){var t=i.el;t[0].$br||(t.off(),t.find("*").off(),t[0].$br=1),n--,arr.splice(n,1)}}arr.length||delete a[keys[r]]}}}}});
//# sourceMappingURL=../sourcemaps/views/binding.js.map
