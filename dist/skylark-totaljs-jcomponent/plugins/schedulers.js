/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../jc","../langx"],function(e,r){var n=[],t=0;return t=0,setInterval(function(){if(n.length){t++;for(var e=r.now(!0),i=0,a=n.length;i<a;i++){var c=n[i];if("m"===c.type){if(t%30!=0)continue}else if("h"===c.type&&t%900!=0)continue;for(var o=e.add(c.expire),l=FIND(c.selector,!0),u=0;u<l.length;u++){var s=l[u];s&&s.usage.compare(c.name,o)&&c.callback(s)}}}},3500),e.schedulers={clear:function(e){return n=n.remove("id",e),this},clearAll:function(e){return n.remove("owner",e),this},schedule:function(e,t,i,a){"-"!==i.substring(0,1)&&(i="-"+i);var c=i.split(" ")[1].toLowerCase().substring(0,1),o=r.guid(10);return n.push({id:o,name:t,expire:i,selector:e,callback:a,type:"y"===c||"d"===c?"h":c,owner:current_owner}),o}}});
//# sourceMappingURL=../sourcemaps/plugins/schedulers.js.map
