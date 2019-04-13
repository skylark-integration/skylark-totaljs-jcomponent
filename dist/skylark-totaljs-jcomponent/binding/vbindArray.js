/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../utils/domx","../utils/query","./vbind"],function(e,t,n,r){return function(t,l){var i={};i.html=t,i.items=[],i.element=l.element?l.element:n(l),i.element[0].$vbindarray=i,i.remove=function(){for(var e=0;e<i.items.length;e++)i.items[e].remove();i.checksum=null,i.items=null,i.html=null,i.element=null};var s=function(e){switch(typeof e){case"number":return e+"";case"boolean":return e?"1":"0";case"string":return e;default:return null==e?"":e instanceof Date?e.getTime():JSON.stringify(e)}},m=function(t){var n=0,r=i.items[0];if(r)for(var l=0;l<r.binders.length;l++){var m=r.binders[l],u=m.path;if(m.track)for(var a=0;a<m.track.length;a++)n+=s($get((u?u+".":"")+m.track[a].substring(1),t));else n+=s(u?$get(u,t):t)}return e.hashCode(n)};return i.set=function(e,t){var n=null;if(!(e instanceof Array))return(u=i.items[e])&&(n=m(t),(c=u.element[0]).$bchecksum!==n&&(c.$bchecksum=n,u.set(t))),i;if(t=e,i.items.length>t.length)for(var l=i.items.splice(t.length),s=0;s<l.length;s++)l[s].remove();for(s=0;s<t.length;s++){var u,a=t[s];(u=i.items[s])||(u=r(i.html),i.items.push(u),u.element.attrd("index",s),u.element[0].$vbind=u,u.index=s,i.element.append(u.element));var c=u.element[0];n=m(a),c.$bchecksum!==n&&(c.$bchecksum=n,u.set(a))}},i}});
//# sourceMappingURL=../sourcemaps/binding/vbindArray.js.map
