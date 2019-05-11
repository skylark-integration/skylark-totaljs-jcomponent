/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../binding/pathmaker"],function(t,e){var r={sort:1,reverse:1,splice:1,slice:1,pop:1,unshift:1,shift:1,push:1},n=/\[\d+\]$/;return function(i){var a={},o="",s=i.eventer,u=i.binding,d=i.option("store");function l(t){for(var e=t.split("."),r=[],n=[],i=0;i<e.length;i++){var a=e[i],o=a.indexOf("[");if(-1===o)if(-1===a.indexOf("-"))n.push(a),r.push(n.join("."));else{var s=n.splice(n.length-1);n.push(s+"['"+a+"']"),r.push(n.join("."))}else-1===a.indexOf("-")?(n.push(a.substring(0,o)),r.push(n.join(".")),n.splice(n.length-1),n.push(a),r.push(n.join("."))):(n.push("['"+a.substring(0,o)+"']"),r.push(n.join("")),n.push(a.substring(o)),r.push(n.join("")))}return r}var c={},f={},v=[],h={};function a(t,e,r){var n="$jcpath";if(WATCH(t,function(r,i){var a=storages.get(n);a?a[t]=i:(a={})[t]=i,storages.put(n,a,e)}),void 0===r||r){var i=storages.get(n);i&&void 0!==i[t]&&i[t]!==p(t)&&g(t,i[t],!0)}return this}function p(t,e){if(null!=t){37===t.charCodeAt(0)&&(t="jctmp."+t.substring(1));var r="="+t;if(c[r])return c[r](e||d.data);if(-1===t.indexOf("?")){for(var n=l(t),i=[],a=0,o=n.length-1;a<o;a++){var s=n[a];"["!==s.substring(0,1)&&(s="."+s),i.push("if(!w"+s+")return")}var u=n[n.length-1];"["!==u.substring(0,1)&&(u="."+u);var f=new Function("w",i.join(";")+";return w"+u);return c[r]=f,f(e||d.data)}}}function b(t,e,r){if(null!=t){var i="+"+t;if(c[i])return c[i](d.data,e,t,u.binders,u.binderbind,r);if(-1===t.indexOf("?")){for(var a=l(t),o=[],s=[],f=0;f<a.length-1;f++){var v=a[f],h=a[f+1]&&n.test(a[f+1])?"[]":"{}",p="w"+("["===v.substring(0,1)?"":".")+v;o.push("if(typeof("+p+")!=='object'||"+p+"==null)"+p+"="+h)}for(f=0;f<a.length-1;f++)v=a[f],s.push("binders['"+v+"']&&binderbind('"+v+"','"+t+"',$ticks)");var b=a[a.length-1];s.push("binders['"+b+"']&&binderbind('"+b+"','"+t+"',$ticks)"),s.push("binders['!"+b+"']&&binderbind('!"+b+"','"+t+"',$ticks)"),"["!==b.substring(0,1)&&(b="."+b);var g=new Function("w","a","b","binders","binderbind","nobind","var $ticks=Math.random().toString().substring(2,8);if(!nobind){"+o.join(";")+";var v=typeof(a)=='function'?a(MAIN.compiler.get(b)):a;w"+b+"=v}"+s.join(";")+";return a");return c[i]=g,g(d.data,e,t,u.binders,u.binderbind,r),this}t=""}}function g(t,r,n){if(t instanceof Array){for(var a=0;a<t.length;a++)g(t[a],r,n);return this}if(!(t=e(t)))return this;if(33===t.charCodeAt(0)&&(t=t.substring(1)),43===t.charCodeAt(0))return y(t=t.substring(1),r,n);if(!t)return this;var u="object"==typeof r&&!(r instanceof Array)&&null!=r,d=!0===n;if(d&&(n=1),o=t,b(t,r),u)return $(t,d,n,!0);var l=p(t),c=[];void 0===n&&(n=1);for(var f=i.componenter.components,v=(a=0,f.length);a<v;a++){var h=f[a];h&&!h.disabled&&!h.$removed&&h.$loaded&&h.path&&h.$compare(t)&&(h.setter&&(h.path===t?h.setter&&(h.setterX(l,t,n),h.$interaction(n)):h.setter&&(h.setterX(p(h.path),t,n),h.$interaction(n))),h.$ready||(h.$ready=!0),3!==n&&h.state&&c.push(h),d?(h.$dirty_disabled||(h.$dirty=!0),h.$valid_disabled||(h.$valid=!0,h.$validate=!1,h.validate&&(h.$valid=h.validate(l),h.$interaction(102))),findControl2(h)):h.validate&&!h.$valid_disabled&&h.valid(h.validate(l),!0))}for(d&&caches.clear("dirty","valid"),a=0,v=c.length;a<v;a++)c[a].stateX(n,5);return s.emitwatch(t,l,n),this}function $(t,r,n,a){if(t instanceof Array){for(var u=0;u<t.length;u++)$(d,t[u],r,n);return this}if(!(t=e(t)))return this;if(33===t.charCodeAt(0)&&(t=t.substring(1)),!(t=t.replaceWildcard()))return this;a||p(t,p(t));var l=[];void 0===n&&(n=1),o=t;for(var c=i.componenter.components,f=(u=0,c.length);u<f;u++){var v=c[u];if(v&&!v.disabled&&!v.$removed&&v.$loaded&&v.path&&v.$compare(t)){var h=v.get();v.setter&&(v.$skip=!1,v.setterX(h,t,n),v.$interaction(n)),v.$ready||(v.$ready=!0),!0===r?(v.$dirty_disabled||(v.$dirty=!0,v.$interaction(101)),v.$valid_disabled||(v.$valid=!0,v.$validate=!1,v.validate&&(v.$valid=v.validate(h),v.$interaction(102))),findControl2(v)):v.validate&&!v.$valid_disabled&&v.valid(v.validate(h),!0),v.state&&l.push(v)}}for(r&&clear("dirty","valid"),u=0,f=l.length;u<f;u++)l[u].stateX(1,4);return s.emitwatch(t,p(t),n),this}function y(t,e,r){if(t instanceof Array){for(var n=0;n<t.length;n++)y(t[n],e,r);return this}var i=p(t),a=!1;i instanceof Array||(i=[],a=!0);var s=!0;return o=t,e instanceof Array?e.length?i.push.apply(i,e):s=!1:i.push(e),a?g(t,i,r):s&&$(t,void 0,r),this}function m(t,e){return null==e&&(e=!0),!i.componenter.com_dirty(t,!e)}function x(e){var r,n=[],i=1,a=!1,o=this;!0===e&&(a=!0,e=arguments[1],i=2),e=e.env();for(var s=i;s<arguments.length;s++)n.push(arguments[s]);var u=e.charCodeAt(0);if(35===u)return r=e.substring(1),a?!events[r]&&exechelper(o,e,n):EMIT.call(o,r,n[0],n[1],n[2],n[3],n[4]),EXEC;var d=0;if(64===u){var l=e.indexOf(".");if(r=e.substring(1,l),v=plugins.find(r)){var f=v[e.substring(l+1)];t.isFunction(f)&&(f.apply(o===Window?v:o,n),d=1)}return a&&!d&&exechelper(o,e,n),EXEC}if(-1!==(l=e.indexOf("/"))){r=e.substring(0,l);var v=plugins.find(r);return f=e.substring(l+1),v&&t.isFunction(v[f])&&(v[f].apply(o===W?v:o,n),d=1),a&&!d&&exechelper(o,e,n),EXEC}return f=c.get(e),t.isFunction(f)&&(f.apply(o,n),d=1),a&&!d&&exechelper(o,e,n),x}function _(t,r,n){if(r>0)return setTimeout(function(){_(t)},r),this;t=e(t).replaceWildcard();for(var a=[],o=i.componenter.components,s=0,u=o.length;s<u;s++){var d=o[s];d&&!d.$removed&&!d.disabled&&d.$loaded&&d.path&&d.$compare(t)&&(d.state&&a.push(d),n&&n._id!==d._id||(findControl2(d),d.$dirty_disabled||(d.$dirty=!0,d.$interaction(101)),d.$valid_disabled||(d.$valid=!0,d.$validate=!1,d.validate&&(d.$valid=d.validate(d.get()),d.$interaction(102)))))}return clear("valid","dirty"),state(a,1,3),this}function w(e,r,n){if(t.isFunction(e))return!0===r?$parser.unshift(e):$parser.push(e),this;var i=$parser;if(i&&i.length)for(var a=0,o=i.length;a<o;a++)e=i[a].call(this,r,e,n);return e}return $parser=[],nmCache={},temp={},w(function(e,r,n){switch(n){case"number":case"currency":case"float":var i=+(t.isString(r)?r.trimAll().replace(REGCOMMA,"."):r);return isNaN(i)?null:i;case"date":case"datetime":return r?r instanceof Date?r:(r=r.parseDate())&&r.getTime()?r:null:null}return r}),{bind:function t(r){if(r instanceof Array){for(var n=0;n<r.length;n++)t(r[n]);return this}if(!(r=e(r)))return this;33===r.charCodeAt(0)&&(r=r.substring(1)),(r=r.replaceWildcard())&&b(r,p(r),!0)},cache:a,can:function(t,r){return t=e(t),!i.componenter.com_dirty(t,r)&&i.componenter.com_valid(t,r)},change:m,changed:function(t){return!i.componenter.com_dirty(t)},create:function(e){var n,i=!1;if(t.isString(e)){if(proxy[e])return proxy[e];i=!0,n=function(t){var r=e+(t?"."+t:"");o!==r?setTimeout(function(){o===r?o="":(notify(r),_(r))},MD.delaybinder):o=""}}else n=e;var a=!1,s=e&&p(e)||{},u={get:function(t,e,r){try{return new Proxy(t[e],u)}catch(n){return Reflect.get(t,e,r)}},defineProperty:function(t,e,r){return!a&&n(e,r),Reflect.defineProperty(t,e,r)},deleteProperty:function(t,e){return!a&&n(e),Reflect.deleteProperty(t,e)},apply:function(t,e,i){if(r[t.name]){a=!0;var o=Reflect.apply(t,e,i);return n("",i[0]),a=!1,o}return Reflect.apply(t,e,i)}},d=new Proxy(s,u);return i?(o=e,null==p(e)&&g(e,s,!0),proxy[e]=d):d},default:function r(n,o,s,u){if(o>0)return setTimeout(function(){r(n,0,s,u)},o),this;"boolean"==typeof s&&(u=s,s=null),void 0===u&&(u=!0);var d=(n=e(n.replaceWildcard())).replace(/\.\*$/,""),l=f["#"+t.hashCode(d)];l&&b(d,l());for(var c=[],v=i.componenter.components,h=0,p=v.length;h<p;h++){var g=v[h];if(g&&!g.$removed&&!g.disabled&&g.$loaded&&g.path&&g.$compare(n)&&(g.state&&c.push(g),!s||s._id===g._id)){if(g.$default&&g.set(g.$default(),3),!u)return;findControl2(g),g.$dirty_disabled||(g.$dirty=!0),g.$valid_disabled||(g.$valid=!0,g.$validate=!1,g.validate&&(g.$valid=g.validate(g.get()),g.$interaction(102)))}}return u&&(a.clearPageData("valid","dirty"),t.state(c,3,3)),this},disabled:function(t,r){return t=e(t),i.componenter.com_dirty(t,r)||!i.componenter.com_valid(t,r)},errors:function(r,n,i){r instanceof Array&&(n=r,r=void 0),!0===n&&(n=i instanceof Array?i:null,i=!0);var a=[];return each(function(t){t.disabled||n&&t.$except(n)||!1!==t.$valid||t.$valid_disabled||a.push(t)},e(r)),i&&t.state(a,1,1),a},evaluate:function(t,e,r){var n="eval"+e,i=temp[n],a=null;return a=r?t:p(t),i?i.call(a,a,t):(-1===e.indexOf("return")&&(e="return "+e),i=new Function("value","path",e),temp[n]=i,i.call(a,a,t))},exec:x,exec2:function(t,e){var r=!0===t;return function(n,i,a,o){r?x(e,t,n,i,a,o):x(t,n,i,a,o)}},extend:function(r,n,i){if(r=e(r)){var a=p(r);null==a&&(a={}),g(r,t.extend(a,n),i)}return this},format:function(e,r,n){if(t.isFunction(e))return!0===r?v.unshift(e):v.push(e),this;var i=v;if(i&&i.length)for(var a=0,o=i.length;a<o;a++){var s=i[a].call(M,r,e,n);void 0!==s&&(e=s)}return e},get:p,inc:function e(r,n,i){if(r instanceof Array){for(var a=0;a<r.length;a++)e(r[a],n,i);return this}if(!r)return this;var o=p(r);return o?t.isNumber(o)||(o=parseFloat(o),isNaN(o)&&(o=0)):o=0,g(r,o+=n,i),this},invalid:function(t,r){return(t=e(t))&&(i.componenter.com_dirty(t,!1,r,!0),i.componenter.com_valid(t,!1,r)),W},make:function(t,e,r){switch(typeof t){case"function":e=t,t={};break;case"string":var n=t,i=!0;return null==(t=p(n))&&(i=!1,t={}),e.call(t,t,n,function(e,r){g(t,e,r)}),!i||void 0!==r&&!0!==r?C.ready?b(n,t):g(n,t,!0):r(n,!0),t}return e.call(t,t,""),t},modify:function e(r,n,i){return r&&"object"==typeof r?Object.keys(r).forEach(function(t){e(t,r[t],n)}):(t.isFunction(n)&&(n=n(p(r))),g(r,n,i),i?t.setTimeout(m,i+5,r):m(r)),this},modified:function(t){var r=[];return each(function(t){t.disabled||t.$dirty_disabled||!1===t.$dirty&&r.push(t.path)},e(t)),r},parser:w,paths:c,push:y,reset:_,rewrite:function(t,r,n){return(t=e(t))&&(o=t,b(t,r),s.emitwatch(t,r,n)),this},set:b,set2:function(t,e,r){if(null!=e){var i="++"+e;if(c[i])return c[i](t,r,e);for(var a=l(e),o=[],s=0;s<a.length-1;s++){var u=a[s],d=a[s+1]&&n.test(a[s+1])?"[]":"{}",f="w"+("["===u.substring(0,1)?"":".")+u;o.push("if(typeof("+f+")!=='object'||"+f+"==null)"+f+"="+d)}var v=a[a.length-1];"["!==v.substring(0,1)&&(v="."+v);var h=new Function("w","a","b",o.join(";")+";w"+v+"=a;return a");return c[i]=h,h(t,r,e),t}},setx:g,skipInc:function(){for(var t=0;t<arguments.length;t++)for(var e=arguments[t].split(","),r=0,n=e.length;r<n;r++){var i=e[r].trim();h[i]?h[i]++:h[i]=1}},skipDec:function(t){return!(h[t]&&--h[t]<=0&&(delete h[t],1))},update:$,used:function(t){return each(function(t){!t.disabled&&t.used()},t),this}}}});
//# sourceMappingURL=../sourcemaps/views/storing.js.map
