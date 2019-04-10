/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../utils/domx","../utils/query","./vbind"],function(e,n,t,r){return t.fn.vbindarray=function(){return n.findinstance(this,"$vbindarray")},function(n,i){var l={};l.html=n,l.items=[],l.element=i.element?i.element:t(i),l.element[0].$vbindarray=l,l.remove=function(){for(var e=0;e<l.items.length;e++)l.items[e].remove();l.checksum=null,l.items=null,l.html=null,l.element=null};var s=function(e){switch(typeof e){case"number":return e+"";case"boolean":return e?"1":"0";case"string":return e;default:return null==e?"":e instanceof Date?e.getTime():JSON.stringify(e)}},a=function(n){var t=0,r=l.items[0];if(r)for(var i=0;i<r.binders.length;i++){var a=r.binders[i],m=a.path;if(a.track)for(var u=0;u<a.track.length;u++)t+=s($get((m?m+".":"")+a.track[u].substring(1),n));else t+=s(m?$get(m,n):n)}return e.hashCode(t)};return l.set=function(e,n){var t=null;if(!(e instanceof Array))return(m=l.items[e])&&(t=a(n),(c=m.element[0]).$bchecksum!==t&&(c.$bchecksum=t,m.set(n))),l;if(n=e,l.items.length>n.length)for(var i=l.items.splice(n.length),s=0;s<i.length;s++)i[s].remove();for(s=0;s<n.length;s++){var m,u=n[s];(m=l.items[s])||(m=r(l.html),l.items.push(m),m.element.attrd("index",s),m.element[0].$vbind=m,m.index=s,l.element.append(m.element));var c=m.element[0];t=a(u),c.$bchecksum!==t&&(c.$bchecksum=t,m.set(u))}},l}});
//# sourceMappingURL=../sourcemaps/binding/vbindArray.js.map
