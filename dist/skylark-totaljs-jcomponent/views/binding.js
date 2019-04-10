/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../utils/domx","../binding/parsebinder"],function(r,e){return function(n){var i=[];return{parse:function(r,n,f){return e(r,n,f,{binders:i})},binder:function(r){return r.$jcbind},clean:function(){keys=Object.keys(i);for(var e=0;e<keys.length;e++){arr=i[keys[e]];for(var n=0;;){var f=arr[n++];if(!f)break;if(!r.inDOM(f.el[0])){var t=f.el;t[0].$br||(t.off(),t.find("*").off(),t[0].$br=1),n--,arr.splice(n,1)}}arr.length||delete i[keys[e]]}}}}});
//# sourceMappingURL=../sourcemaps/views/binding.js.map
