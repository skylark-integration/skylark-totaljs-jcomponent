/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../utils/domx","../utils/query","../components/Component","./vbind"],function(e,n,t,r){return n.fn.vbindarray=function(){return e.findinstance(this,"$vbindarray")},function(e,i){var l={};l.html=e,l.items=[],l.element=i instanceof t?i.element:n(i),l.element[0].$vbindarray=l,l.remove=function(){for(var e=0;e<l.items.length;e++)l.items[e].remove();l.checksum=null,l.items=null,l.html=null,l.element=null};var s=function(e){switch(typeof e){case"number":return e+"";case"boolean":return e?"1":"0";case"string":return e;default:return null==e?"":e instanceof Date?e.getTime():JSON.stringify(e)}},m=function(e){var n=0,t=l.items[0];if(t)for(var r=0;r<t.binders.length;r++){var i=t.binders[r],m=i.path;if(i.track)for(var a=0;a<i.track.length;a++)n+=s($get((m?m+".":"")+i.track[a].substring(1),e));else n+=s(m?$get(m,e):e)}return HASH(n)};return l.set=function(e,n){var t=null;if(!(e instanceof Array))return(a=l.items[e])&&(t=m(n),(c=a.element[0]).$bchecksum!==t&&(c.$bchecksum=t,a.set(n))),l;if(n=e,l.items.length>n.length)for(var i=l.items.splice(n.length),s=0;s<i.length;s++)i[s].remove();for(s=0;s<n.length;s++){var a,u=n[s];(a=l.items[s])||(a=r(l.html),l.items.push(a),a.element.attrd("index",s),a.element[0].$vbind=a,a.index=s,l.element.append(a.element));var c=a.element[0];t=m(u),c.$bchecksum!==t&&(c.$bchecksum=t,a.set(u))}},l}});
//# sourceMappingURL=../sourcemaps/binding/vbindArray.js.map
