/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./langx","./caches"],function(e,r,n){var t=[],c=0;return c=0,setInterval(function(){if(t.length){c++;for(var e=r.now(!0),n=0,a=t.length;n<a;n++){var i=t[n];if("m"===i.type){if(c%30!=0)continue}else if("h"===i.type&&c%900!=0)continue;for(var o=e.add(i.expire),l=FIND(i.selector,!0),s=0;s<l.length;s++){var u=l[s];u&&u.usage.compare(i.name,o)&&i.callback(u)}}}},3500),e.schedulers={clear:function(e){return t=t.remove("id",e),this},clearAll:function(e){return t.remove("owner",e),this},schedule:function(e,r,n,c){"-"!==n.substring(0,1)&&(n="-"+n);var a=n.split(" ")[1].toLowerCase().substring(0,1),i=GUID(10);return t.push({id:i,name:r,expire:n,selector:e,callback:c,type:"y"===a||"d"===a?"h":a,owner:current_owner}),i}}});
//# sourceMappingURL=sourcemaps/schedulers.js.map
