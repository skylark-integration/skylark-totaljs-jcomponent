/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./defaults","./langx"],function(e,n,t){var r={};var l={};return setInterval(function(){for(var e in l)delete l[e]},3e5),{get:function(e){return r[e]},put:function(e,n){return r[e]=n,this},clear:function(){if(arguments.length)for(var e=t.keys(r),n=0,l=e.length;n<l;n++){for(var u=e[n],f=!1,a=arguments,i=0;i<a.length;i++)if(u.substring(0,a[i].length)===a[i]){f=!0;break}f&&delete r[u]}else r={}},temp:l,autofill:[],cache:r,current:{owner:null,element:null,com:null}}});
//# sourceMappingURL=sourcemaps/caches.js.map
