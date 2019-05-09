/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx"],function(e){var r=[],n=0;return n=0,setInterval(function(){if(r.length){n++;for(var t=e.now(!0),i=0,a=r.length;i<a;i++){var o=r[i];if("m"===o.type){if(n%30!=0)continue}else if("h"===o.type&&n%900!=0)continue;for(var c=t.add(o.expire),l=FIND(o.selector,!0),u=0;u<l.length;u++){var s=l[u];s&&s.usage.compare(o.name,c)&&o.callback(s)}}}},3500),{clear:function(e){return r=r.remove("id",e),this},clearAll:function(e){return r.remove("owner",e),this},schedule:function(n,t,i,a){"-"!==i.substring(0,1)&&(i="-"+i);var o=i.split(" ")[1].toLowerCase().substring(0,1),c=e.guid(10);return r.push({id:c,name:t,expire:i,selector:n,callback:a,type:"y"===o||"d"===o?"h":o,owner:current_owner}),c}}});
//# sourceMappingURL=../sourcemaps/others/schedulers.js.map
