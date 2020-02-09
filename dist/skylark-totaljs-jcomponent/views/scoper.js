/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../components/Scope"],function(e,t){return function(r){var s=null,a=r.helper,n=r.eventer;return{initscopes:function(i){var o=i[i.length-1];if(o.$scopedata)return o.$scopedata;var c=a.attrscope(o),l="!"===c.substring(0,1);l&&(c=c.substring(1));var u=[o];if(!l)for(var d=i.length-1;d>-1&&(u.push(i[d]),"!"!==a.attrscope(i[d]).substring(0,1));d--);var p="";u.length&&u.reverse(),d=0;for(var v=u.length;d<v;d++){var f=u[d],g=f.$scope||a.attrscope(f);if(f.$initialized=!0,f.$processed)p=g;else{f.$processed=!0,f.$isolated="!"===g.substring(0,1),f.$isolated&&(g=g.substring(1)),g&&"?"!==g||(g=e.guid(25).replace(/\d/g,"")),f.$isolated?p=g:p+=(p?".":"")+g,f.$scope=p;var h=new t(f,r);h._id=h.ID=h.id=e.guid(10),h.path=p,h.elements=u.slice(0,d+1),h.isolated=f.$isolated,h.element=$(u[0]),f.$scopedata=h;var m=a.attrcom(f,"value");if(m){var b=new Function("return "+m);defaults["#"+HASH(g)]=b,m=b(),set(g,m),n.emitwatch(g,m,1)}var w=a.attrcom(f,"class");if(w&&function(e){e=e.split(" "),setTimeout(function(){for(var t=$(f),r=0,s=e.length;r<s;r++)t.tclass(e[r])},5)}(w),(m=a.attrcom(f,"init"))&&(m=i.get(m))){var H=s;s="scope"+h._id,m.call(h,g,$(f)),s=H}}}return o.$scopedata}}}});
//# sourceMappingURL=../sourcemaps/views/scoper.js.map
