/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../binding/pathmaker"],function(t,e){var r={sort:1,reverse:1,splice:1,slice:1,pop:1,unshift:1,shift:1,push:1};return function(n,i){var a={};function s(t){for(var e=t.split("."),r=[],n=[],i=0;i<e.length;i++){var a=e[i],s=a.indexOf("[");if(-1===s)if(-1===a.indexOf("-"))n.push(a),r.push(n.join("."));else{var o=n.splice(n.length-1);n.push(o+"['"+a+"']"),r.push(n.join("."))}else-1===a.indexOf("-")?(n.push(a.substring(0,s)),r.push(n.join(".")),n.splice(n.length-1),n.push(a),r.push(n.join("."))):(n.push("['"+a.substring(0,s)+"']"),r.push(n.join("")),n.push(a.substring(s)),r.push(n.join("")))}return r}n.data;var o={},u={},l={},d=[],c={};function f(t,e,r){for(var n=o[t],i=0;i<n.length;i++){var a=n[i];a.ticks!==r&&(a.ticks=r,a.exec(getx(a.path),e))}}function a(t,e,r){var n="$jcpath";if(WATCH(t,function(r,i){var a=storages.get(n);a?a[t]=i:(a={})[t]=i,storages.put(n,a,e)}),void 0===r||r){var i=storages.get(n);i&&void 0!==i[t]&&i[t]!==v(t)&&h(t,i[t],!0)}return this}function v(t,e){if(null!=t){37===t.charCodeAt(0)&&(t="jctmp."+t.substring(1));var r="="+t;if(u[r])return u[r](e||stores.root);if(-1===t.indexOf("?")){for(var n=s(t),i=[],a=0,o=n.length-1;a<o;a++){var l=n[a];"["!==l.substring(0,1)&&(l="."+l),i.push("if(!w"+l+")return")}var d=n[n.length-1];"["!==d.substring(0,1)&&(d="."+d);var c=new Function("w",i.join(";")+";return w"+d);return u[r]=c,c(e||MD.scope)}}}function p(t,e,r){if(null!=t){var i="+"+t;if(u[i])return u[i](n.data,e,t,o,f,r);if(-1===t.indexOf("?")){for(var a=s(t),l=[],d=[],c=0;c<a.length-1;c++){var v=a[c],p=a[c+1]&&REGISARR.test(a[c+1])?"[]":"{}",h="w"+("["===v.substring(0,1)?"":".")+v;l.push("if(typeof("+h+")!=='object'||"+h+"==null)"+h+"="+p)}for(c=0;c<a.length-1;c++)v=a[c],d.push("binders['"+v+"']&&binderbind('"+v+"','"+t+"',$ticks)");var g=a[a.length-1];d.push("binders['"+g+"']&&binderbind('"+g+"','"+t+"',$ticks)"),d.push("binders['!"+g+"']&&binderbind('!"+g+"','"+t+"',$ticks)"),"["!==g.substring(0,1)&&(g="."+g);var y=new Function("w","a","b","binders","binderbind","nobind","var $ticks=Math.random().toString().substring(2,8);if(!nobind){"+l.join(";")+";var v=typeof(a)=='function'?a(MAIN.compiler.get(b)):a;w"+g+"=v}"+d.join(";")+";return a");return u[i]=y,y(n.data,e,t,o,f,r),this}t=""}}function h(t,r,n){if(t instanceof Array){for(var a=0;a<t.length;a++)h(t[a],r,n);return M}if(!(t=e(t)))return M;if(33===t.charCodeAt(0)&&(t=t.substring(1)),43===t.charCodeAt(0))return y(t=t.substring(1),r,n);if(!t)return M;var s="object"==typeof r&&!(r instanceof Array)&&null!=r,o=!0===n;if(o&&(n=1),M.skipproxy=t,p(t,r),s)return g(t,o,n,!0);var u=v(t),l=[];void 0===n&&(n=1);for(var d=i.components,c=(a=0,d.length);a<c;a++){var f=d[a];f&&!f.disabled&&!f.$removed&&f.$loaded&&f.path&&f.$compare(t)&&(f.setter&&(f.path===t?f.setter&&(f.setterX(u,t,n),f.$interaction(n)):f.setter&&(f.setterX(v(f.path),t,n),f.$interaction(n))),f.$ready||(f.$ready=!0),3!==n&&f.state&&l.push(f),o?(f.$dirty_disabled||(f.$dirty=!0),f.$valid_disabled||(f.$valid=!0,f.$validate=!1,f.validate&&(f.$valid=f.validate(u),f.$interaction(102))),findControl2(f)):f.validate&&!f.$valid_disabled&&f.valid(f.validate(u),!0))}for(o&&caches.clear("dirty","valid"),a=0,c=l.length;a<c;a++)l[a].stateX(n,5);return emitwatch(t,u,n),M}function g(t,r,a,s){if(t instanceof Array){for(var o=0;o<t.length;o++)g(n,t[o],r,a);return this}if(!(t=e(t)))return this;if(33===t.charCodeAt(0)&&(t=t.substring(1)),!(t=t.replaceWildcard()))return this;s||v(t,v(t));var u=[];void 0===a&&(a=1),M.skipproxy=t;for(var l=i.components,d=(o=0,l.length);o<d;o++){var c=l[o];if(c&&!c.disabled&&!c.$removed&&c.$loaded&&c.path&&c.$compare(t)){var f=c.get();c.setter&&(c.$skip=!1,c.setterX(f,t,a),c.$interaction(a)),c.$ready||(c.$ready=!0),!0===r?(c.$dirty_disabled||(c.$dirty=!0,c.$interaction(101)),c.$valid_disabled||(c.$valid=!0,c.$validate=!1,c.validate&&(c.$valid=c.validate(f),c.$interaction(102))),findControl2(c)):c.validate&&!c.$valid_disabled&&c.valid(c.validate(f),!0),c.state&&u.push(c)}}for(r&&clear("dirty","valid"),o=0,d=u.length;o<d;o++)u[o].stateX(1,4);return emitwatch(t,v(t),a),this}function y(t,e,r){if(t instanceof Array){for(var n=0;n<t.length;n++)y(t[n],e,r);return this}var i=v(t),a=!1;i instanceof Array||(i=[],a=!0);var s=!0;return M.skipproxy=t,e instanceof Array?e.length?i.push.apply(i,e):s=!1:i.push(e),a?h(t,i,r):s&&g(t,void 0,r),this}function $(t,e){return null==e&&(e=!0),!com_dirty(t,!e)}function b(e){var r,n=[],i=1,a=!1,s=this;!0===e&&(a=!0,e=arguments[1],i=2),e=e.env();for(var o=i;o<arguments.length;o++)n.push(arguments[o]);var l=e.charCodeAt(0);if(35===l)return r=e.substring(1),a?!events[r]&&exechelper(s,e,n):EMIT.call(s,r,n[0],n[1],n[2],n[3],n[4]),EXEC;var d=0;if(64===l){var c=e.indexOf(".");if(r=e.substring(1,c),v=plugins.find(r)){var f=v[e.substring(c+1)];t.isFunction(f)&&(f.apply(s===Window?v:s,n),d=1)}return a&&!d&&exechelper(s,e,n),EXEC}if(-1!==(c=e.indexOf("/"))){r=e.substring(0,c);var v=plugins.find(r);return f=e.substring(c+1),v&&typeof v[f]===TYPE_FN&&(v[f].apply(s===W?v:s,n),d=1),a&&!d&&exechelper(s,e,n),EXEC}return f=u.get(e),t.isFunction(f)&&(f.apply(s,n),d=1),a&&!d&&exechelper(s,e,n),b}function m(t,r,n){if(r>0)return setTimeout(function(){m(t)},r),this;t=e(t).replaceWildcard();for(var a=[],s=i.components,o=0,u=s.length;o<u;o++){var l=s[o];l&&!l.$removed&&!l.disabled&&l.$loaded&&l.path&&l.$compare(t)&&(l.state&&a.push(l),n&&n._id!==l._id||(findControl2(l),l.$dirty_disabled||(l.$dirty=!0,l.$interaction(101)),l.$valid_disabled||(l.$valid=!0,l.$validate=!1,l.validate&&(l.$valid=l.validate(l.get()),l.$interaction(102)))))}return clear("valid","dirty"),state(a,1,3),this}function x(e,r,n){if(t.isFunction(e))return!0===r?$parser.unshift(e):$parser.push(e),this;var i=$parser;if(i&&i.length)for(var a=0,s=i.length;a<s;a++)e=i[a].call(this,r,e,n);return e}return $parser=[],nmCache={},temp={},x(function(e,r,n){switch(n){case"number":case"currency":case"float":var i=+(t.isString(r)?r.trimAll().replace(REGCOMMA,"."):r);return isNaN(i)?null:i;case"date":case"datetime":return r?r instanceof Date?r:(r=r.parseDate())&&r.getTime()?r:null:null}return r}),{cache:a,can:function(t,r){return t=e(t),!com_dirty(t,r)&&com_valid(t,r)},change:$,changed:function(t){return!com_dirty(t)},create:function(e){var n,i=!1;if(t.isString(e)){if(proxy[e])return proxy[e];i=!0,n=function(t){var r=e+(t?"."+t:"");M.skipproxy!==r?setTimeout(function(){M.skipproxy===r?M.skipproxy="":(notify(r),m(r))},MD.delaybinder):M.skipproxy=""}}else n=e;var a=!1,s=e&&get2(e)||{},o={get:function(t,e,r){try{return new Proxy(t[e],o)}catch(n){return Reflect.get(t,e,r)}},defineProperty:function(t,e,r){return!a&&n(e,r),Reflect.defineProperty(t,e,r)},deleteProperty:function(t,e){return!a&&n(e),Reflect.deleteProperty(t,e)},apply:function(t,e,i){if(r[t.name]){a=!0;var s=Reflect.apply(t,e,i);return n("",i[0]),a=!1,s}return Reflect.apply(t,e,i)}},u=new Proxy(s,o);return i?(M.skipproxy=e,null==getx(e)&&h(e,s,!0),proxy[e]=u):u},default:function r(n,s,o,u){if(s>0)return setTimeout(function(){r(n,0,o,u)},s),this;"boolean"==typeof o&&(u=o,o=null),void 0===u&&(u=!0);var d=(n=e(n.replaceWildcard())).replace(/\.\*$/,""),c=l["#"+t.hashCode(d)];c&&p(d,c());for(var f=[],v=i.components,h=0,g=v.length;h<g;h++){var y=v[h];if(y&&!y.$removed&&!y.disabled&&y.$loaded&&y.path&&y.$compare(n)&&(y.state&&f.push(y),!o||o._id===y._id)){if(y.$default&&y.set(y.$default(),3),!u)return;findControl2(y),y.$dirty_disabled||(y.$dirty=!0),y.$valid_disabled||(y.$valid=!0,y.$validate=!1,y.validate&&(y.$valid=y.validate(y.get()),y.$interaction(102)))}}return u&&(a.clearPageData("valid","dirty"),t.state(f,3,3)),this},disabled:function(t,r){return t=e(t),com_dirty(t,r)||!com_valid(t,r)},errors:function(r,n,i){r instanceof Array&&(n=r,r=void 0),!0===n&&(n=i instanceof Array?i:null,i=!0);var a=[];return each(function(t){t.disabled||n&&t.$except(n)||!1!==t.$valid||t.$valid_disabled||a.push(t)},e(r)),i&&t.state(a,1,1),a},evaluate:function(t,e,r){var n="eval"+e,i=temp[n],a=null;return a=r?t:v(t),i?i.call(a,a,t):(-1===e.indexOf("return")&&(e="return "+e),i=new Function("value","path",e),temp[n]=i,i.call(a,a,t))},exec:b,exec2:function(t,e){var r=!0===t;return function(n,i,a,s){r?b(e,t,n,i,a,s):b(t,n,i,a,s)}},extend:function(r,n,i){if(r=e(r)){var a=v(r);null==a&&(a={}),h(r,t.extend(a,n),i)}return this},format:function(e,r,n){if(t.isFunction(e))return!0===r?d.unshift(e):d.push(e),M;var i=d;if(i&&i.length)for(var a=0,s=i.length;a<s;a++){var o=i[a].call(M,r,e,n);void 0!==o&&(e=o)}return e},get:v,inc:function e(r,n,i){if(r instanceof Array){for(var a=0;a<r.length;a++)e(r[a],n,i);return this}if(!r)return this;var s=v(r);return s?t.isNumber(s)||(s=parseFloat(s),isNaN(s)&&(s=0)):s=0,h(r,s+=n,i),this},invalid:function(t,r){return(t=e(t))&&(com_dirty(t,!1,r,!0),com_valid(t,!1,r)),W},make:function(t,e,r){switch(typeof t){case"function":e=t,t={};break;case"string":var n=t,i=!0;return null==(t=v(n))&&(i=!1,t={}),e.call(t,t,n,function(e,r){h(t,e,r)}),!i||void 0!==r&&!0!==r?C.ready?p(n,t):h(n,t,!0):r(n,!0),t}return e.call(t,t,""),t},modify:function e(r,n,i){return r&&"object"==typeof r?Object.keys(r).forEach(function(t){e(t,r[t],n)}):(t.isFunction(n)&&(n=n(v(r))),h(r,n,i),i?t.setTimeout($,i+5,r):$(r)),this},modified:function(t){var r=[];return each(function(t){t.disabled||t.$dirty_disabled||!1===t.$dirty&&r.push(t.path)},e(t)),r},parser:x,push:y,reset:m,rewrite:function(t,r,n){return(t=e(t))&&(M.skipproxy=t,p(t,r),emitwatch(t,r,n)),this},set:p,set2:function(t,e,r){if(null!=e){var n="++"+e;if(u[n])return u[n](t,r,e);for(var i=s(e),a=[],o=0;o<i.length-1;o++){var l=i[o],d=i[o+1]&&REGISARR.test(i[o+1])?"[]":"{}",c="w"+("["===l.substring(0,1)?"":".")+l;a.push("if(typeof("+c+")!=='object'||"+c+"==null)"+c+"="+d)}var f=i[i.length-1];"["!==f.substring(0,1)&&(f="."+f);var v=new Function("w","a","b",a.join(";")+";w"+f+"=a;return a");return u[n]=v,v(t,r,e),t}},setx:h,skip:function(){for(var t=0;t<arguments.length;t++)for(var e=arguments[t].split(","),r=0,n=e.length;r<n;r++){var i=e[r].trim();c[i]?c[i]++:c[i]=1}},update:g,used:function(t){return each(function(t){!t.disabled&&t.used()},t),this},validate:validate}}});
//# sourceMappingURL=../sourcemaps/views/storing.js.map
