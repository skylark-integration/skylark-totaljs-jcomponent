/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-langx/langx","./jc","./caches","./Component"],function(t,e,n,r){function i(t,e){if(null!=t){37===t.charCodeAt(0)&&(t="jctmp."+t.substring(1));var n="="+t;if(c[n])return c[n](e||MD.scope);if(-1===t.indexOf("?")){for(var r=x(t),i=[],a=0,o=r.length-1;a<o;a++){var u=r[a];"["!==u.substring(0,1)&&(u="."+u),i.push("if(!w"+u+")return")}var s=r[r.length-1];"["!==s.substring(0,1)&&(s="."+s);var l=new Function("w",i.join(";")+";return w"+s);return c[n]=l,l(e||MD.scope)}}}var a=/\.\*/;function o(t,e){if(!t)return t;var n,r="";e&&(-1!==(n=t.indexOf(" "))&&(r=t.substring(n),t=t.substring(0,n)));if(37===t.charCodeAt(0))return"jctmp."+t.substring(1)+r;if(64===t.charCodeAt(0))return t;if(-1===(n=t.indexOf("/")))return t+r;var i=t.substring(0,n);return(plugins.find(i)?"PLUGINS."+i:i+"_plugin_not_found")+"."+t.substring(n+1)+r}var u=/\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi,s={},l=" + ",f=/\[\d+\]$/,c={},d={};function p(t,e,n){for(var r=d[t],i=0;i<r.length;i++){var a=r[i];a.ticks!==n&&(a.ticks=n,a.exec(g(a.path),e))}}var h=[];function v(t,e,n){for(var r=0,i=h.length;r<i;r++){var a=h[r];if("*"===a.path)a.fn.call(a.context,t,a.format?a.format(e,t,n):e,n);else if(t.length>a.path.length){var o=t.lastIndexOf(".",a.path.length);if(-1!==o&&a.path===t.substring(0,o)){var u=g(a.path);a.fn.call(a.context,t,a.format?a.format(u,t,n):u,n)}}else for(var s=0,l=a.$path.length;s<l;s++)if(a.$path[s]===t){u=get2(a.path);a.fn.call(a.context,t,a.format?a.format(u,t,n):u,n);break}}}function g(t,e){return t=o(t),!0===e&&(e=null,reset(t,!0)),i(t,e)}function b(t,e,n){if(null!=t){var r="+"+t;if(c[r])return c[r](MD.scope,e,t,d,p,n);if(-1===t.indexOf("?")){for(var i=x(t),a=[],o=[],u=0;u<i.length-1;u++){var s=i[u],l=i[u+1]&&f.test(i[u+1])?"[]":"{}",h="w"+("["===s.substring(0,1)?"":".")+s;a.push("if(typeof("+h+")!=='object'||"+h+"==null)"+h+"="+l)}for(u=0;u<i.length-1;u++){s=i[u];o.push("binders['"+s+"']&&binderbind('"+s+"','"+t+"',$ticks)")}var v=i[i.length-1];o.push("binders['"+v+"']&&binderbind('"+v+"','"+t+"',$ticks)"),o.push("binders['!"+v+"']&&binderbind('!"+v+"','"+t+"',$ticks)"),"["!==v.substring(0,1)&&(v="."+v);var g=new Function("w","a","b","binders","binderbind","nobind","var $ticks=Math.random().toString().substring(2,8);if(!nobind){"+a.join(";")+";var v=typeof(a)=='function'?a(MAIN.compiler.get(b)):a;w"+v+"=v}"+o.join(";")+";return a");return c[r]=g,g(MD.scope,e,t,d,p,n),C}t=""}}function m(t,e,r){if(t instanceof Array){for(var a=0;a<t.length;a++)m(t[a],e,r);return M}if(!(t=o(t)))return M;if(33===t.charCodeAt(0)&&(t=t.substring(1)),43===t.charCodeAt(0))return t=t.substring(1),M.push(t,e,r);if(!t)return M;var u="object"==typeof e&&!(e instanceof Array)&&null!=e,s=!0===r;if(s&&(r=1),M.skipproxy=t,b(t,e),u)return P(t,s,r,!0);var l=i(t),f=[];void 0===r&&(r=1);for(var c=M.components.all,d=(a=0,c.length);a<d;a++){var p=c[a];p&&!p.disabled&&!p.$removed&&p.$loaded&&p.path&&p.$compare(t)&&(p.setter&&(p.path===t?p.setter&&(p.setterX(l,t,r),p.$interaction(r)):p.setter&&(p.setterX(i(p.path),t,r),p.$interaction(r))),p.$ready||(p.$ready=!0),3!==r&&p.state&&f.push(p),s?(p.$dirty_disabled||(p.$dirty=!0),p.$valid_disabled||(p.$valid=!0,p.$validate=!1,p.validate&&(p.$valid=p.validate(l),p.$interaction(102))),findcontrol2(p)):p.validate&&!p.$valid_disabled&&p.valid(p.validate(l),!0))}s&&n.clear("dirty","valid");for(a=0,d=f.length;a<d;a++)f[a].stateX(r,5);return v(t,l,r),M}function y(t,e,n,r){var i=typeof n;return"boolean"===i?m(t,e,n):!n||n<10||"number"!==i?m(t,e,n):(setTimeout(function(){m(t,e,r)},n),this)}function x(t){for(var e=t.split("."),n=[],r=[],i=0;i<e.length;i++){var a=e[i],o=a.indexOf("[");if(-1===o)if(-1===a.indexOf("-"))r.push(a),n.push(r.join("."));else{var u=r.splice(r.length-1);r.push(u+"['"+a+"']"),n.push(r.join("."))}else-1===a.indexOf("-")?(r.push(a.substring(0,o)),n.push(r.join(".")),r.splice(r.length-1),r.push(a),n.push(r.join("."))):(r.push("['"+a.substring(0,o)+"']"),n.push(r.join("")),r.push(a.substring(o)),n.push(r.join("")))}return n}function k(t,e,n){switch(typeof t){case"function":e=t,t={};break;case"string":var r=t,a=!0;return null==(t=i(r))&&(a=!1,t={}),e.call(t,t,r,function(e,n){y(t,e,n)}),!a||void 0!==n&&!0!==n?C.ready?$set(r,t):m(r,t,!0):P(r,!0),t}return e.call(t,t,""),t}Array.prototype.findValue=function(e,r,a,o,u){t.isFunction(e)&&(o=a,a=r,r=void 0,u=!1);var s,l=o;if(u&&(s="fv_"+e+"="+r,n.temp[s]))return n.temp[s];var f=this.findIndex(e,r);if(-1!==f){var c=this[f];c=-1===a.indexOf(".")?c[a]:i(a,c),u&&(n.temp[s]=l),l=null==c?o:c}return l},String.prototype.params=String.prototype.arg=function(t){return this.replace(u,function(e){var n=123===e.charCodeAt(1)?2:1,r=i(e.substring(n,e.length-n).trim(),t);return null==r?e:r})};function w(t,e,n){if(t instanceof Array){for(var r=0;r<t.length;r++)w(t[r],e,n);return this}if(!(t=o(t)))return this;var a=i(t);return a?typeof a!==TYPE_N&&(a=parseFloat(a),isNaN(a)&&(a=0)):a=0,m(t,a+=e,n),this}function A(t,e,n,r){null==e&&(e=1);var i=typeof n;return"boolean"===i?w(t,e,n):!n||n<10||i!==TYPE_N?w(t,e,n):(setTimeout(function(){w(t,e,r)},n),W)}function T(t,e,n){if(t=o(t)){var r=i(t);null==r&&(r={}),m(t,$.extend(r,e),n)}return this}function j(t,e,n,r){var i=typeof n;return"boolean"===i?T(t,e,n):!n||n<10||"number"!==i?T(t,e,n):(setTimeout(function(){T(t,e,r)},n),this)}function _(t,e,n,r){var i=typeof n;return"boolean"===i?M.push(t,e,n):!n||n<10||"number"!==i?M.push(t,e,n):(setTimeout(function(){M.push(t,e,r)},n),this)}function P(t,e,n,r){if(t instanceof Array){for(var u=0;u<t.length;u++)P(t[u],e,n);return M}if(!(t=o(t)))return M;if(33===t.charCodeAt(0)&&(t=t.substring(1)),!(t=t.replace(a,"")))return M;!r&&$set(t,$get(t),!0);var s=[];void 0===n&&(n=1),M.skipproxy=t;for(var l=M.components.all,f=(u=0,l.length);u<f;u++){var c=l[u];if(c&&!c.disabled&&!c.$removed&&c.$loaded&&c.path&&c.$compare(t)){var d=c.get();c.setter&&(c.$skip=!1,c.setterX(d,t,n),c.$interaction(n)),c.$ready||(c.$ready=!0),!0===e?(c.$dirty_disabled||(c.$dirty=!0,c.$interaction(101)),c.$valid_disabled||(c.$valid=!0,c.$validate=!1,c.validate&&(c.$valid=c.validate(d),c.$interaction(102))),findcontrol2(c)):c.validate&&!c.$valid_disabled&&c.valid(c.validate(d),!0),c.state&&s.push(c)}}e&&clear("dirty","valid");for(u=0,f=s.length;u<f;u++)s[u].stateX(1,4);return v(t,i(t),n),M}function E(t,e,n){var r=typeof e;return"boolean"===r?P(t,e):!e||e<10||r!==TYPE_N?P(t,n,e):void setTimeout(function(){P(t,n)},e)}return e.$parser.push(function(e,n,r){switch(r){case"number":case"currency":case"float":var i=+(t.isString(n)?n.replace(REGEMPTY,"").replace(REGCOMMA,"."):n);return isNaN(i)?null:i;case"date":case"datetime":return n?n instanceof Date?n:(n=n.parseDate())&&n.getTime()?n:null:null}return n}),setInterval(function(){c={}},3e5),e.paths={Scope:Scope,unwatch:function t(e,n){if(-1!==e.indexOf(l)){for(var r=e.split(l).trim(),i=0;i<r.length;i++)t(r[i],n);return this}return topic.off("watch",e,n)},watch:function e(n,r,i){if(-1!==n.indexOf(l)){for(var a=n.split(l).trim(),u=0;u<a.length;u++)e(a[u],r,i);return this}t.isFunction(n)&&(i=r,r=n,n="*");var s="";return"^"===n.substring(0,1)&&(n=n.substring(1),s="^"),n=o(n,!0),topic.on(s+"watch",n,r,i),this},get:i,getx:g,getr:function(t){return g(t,!0)},set:b,set2:function(t,e,n){if(null!=e){var r="++"+e;if(c[r])return c[r](t,n,e);for(var i=x(e),a=[],o=0;o<i.length-1;o++){var u=i[o],s=i[o+1]&&f.test(i[o+1])?"[]":"{}",l="w"+("["===u.substring(0,1)?"":".")+u;a.push("if(typeof("+l+")!=='object'||"+l+"==null)"+l+"="+s)}var d=i[i.length-1];"["!==d.substring(0,1)&&(d="."+d);var p=new Function("w","a","b",a.join(";")+";w"+d+"=a;return a");return c[r]=p,p(t,n,e),t}},immSetx:m,setx:y,setx2:function(t,e,n){return y(t,e,n),change(t),this},setr:function(t,e,n){return m(t,e,n),reset(t),this},toggle:function(t,e,n){return y(t,!g(t),e,n),this},toogle2:function(t,e){return toogle(t,e),change(t),this},cache:function(t,e,n){var r="$jcpath";if(WATCH(t,function(n,i){var a=storages.get(r);a?a[t]=i:(a={})[t]=i,storages.put(r,a,e)}),void 0===n||n){var a=storages.get(r);a&&void 0!==a[t]&&a[t]!==i(t)&&m(t,a[t],!0)}return this},immInc:w,inc:A,inc2:function(t,e,n){return A(t,e,n),change(t),this},immExtend:T,extend:j,extend2:function(t,e,n){return j(t,e,n),change(t),this},immPush:function t(e,n,r){if(e instanceof Array){for(var a=0;a<e.length;a++)t(e[a],n,r);return this}var o=i(e),u=!1;o instanceof Array||(o=[],u=!0);var s=!0;return M.skipproxy=e,n instanceof Array?n.length?o.push.apply(o,n):s=!1:o.push(n),u?m(e,o,r):s&&P(e,void 0,r),this},push:_,push2:function(t,e,n){return _(t,e,n),change(t),this},immUpdate:P,update:E,update2:function(t,e){return E(t,e),W.CHANGE(t),this},bind:function t(e){if(e instanceof Array){for(var n=0;n<e.length;n++)t(e[n]);return this}if(!(e=o(e)))return this;33===e.charCodeAt(0)&&(e=e.substring(1)),(e=e.replace(a,""))&&b(e,i(e),!0)},create:function(t){var e,n=!1;if(typeof t===TYPE_S){if(s[t])return s[t];n=!0,e=function(e){var n=t+(e?"."+e:"");M.skipproxy!==n?setTimeout(function(){M.skipproxy===n?M.skipproxy="":(function(){for(var t=arguments,e=M.components.all,n=Math.random().toString().substring(2,8),r=0;r<t.length;r++){var i=t[r];d[i]&&p(i,i,n)}for(var a=0,o=e.length;a<o;a++){var u=e[a];if(u&&!u.$removed&&!u.disabled&&u.$loaded&&u.path){for(var s=0,r=0;r<t.length;r++)if(u.path===t[r]){s=1;break}if(s){var l=u.get();u.setter&&u.setterX(l,u.path,1),u.state&&u.stateX(1,6),u.$interaction(1)}}}for(var r=0;r<t.length;r++)v(t[r],g(t[r]),1)}(n),reset(n))},MD.delaybinder):M.skipproxy=""}}else e=t;var r=!1,i=t&&get2(t)||{},a={get:function(t,e,n){try{return new Proxy(t[e],a)}catch(r){return Reflect.get(t,e,n)}},defineProperty:function(t,n,i){return!r&&e(n,i),Reflect.defineProperty(t,n,i)},deleteProperty:function(t,n){return!r&&e(n),Reflect.deleteProperty(t,n)},apply:function(t,n,i){if(BLACKLIST[t.name]){r=!0;var a=Reflect.apply(t,n,i);return e("",i[0]),r=!1,a}return Reflect.apply(t,n,i)}},o=new Proxy(i,a);return n?(M.skipproxy=t,null==g(t)&&y(t,i,!0),s[t]=o):o},defaultValue:function(t,e,n){var r=t.split(REGMETA);if(r.length>1){var i=r[1],a=(t=r[0]).indexOf(".*");-1!==a&&(t=t.substring(0,a)),SET(t,new Function("return "+i)(),e>10?e:3,e>10?3:null)}return M.default(r[0],e,null,n)},errors:errors,make:k,evaluate:function(t,e,r){var a="eval"+e,o=n.temp[a],u=null;return u=r?t:i(t),o?o.call(u,u,t):(-1===e.indexOf("return")&&(e="return "+e),o=new Function("value","path",e),n.temp[a]=o,o.call(u,u,t))},make:k,modified:modified,pathmaker:o,rewrite:function(t,e,n){return(t=o(t))&&(M.skipproxy=t,b(t,e),v(t,e,n)),this},validate:function(t,e){var n=[],r=!0;t=function(t){return o(t.replace(a,""))}(t);var u=null;if(e){var s=!1;u={},e=e.remove(function(t){return"@"===t.substring(0,1)&&(u[t.substring(1)]=!0,s=!0,!0)}),!s&&(u=null),!e.length&&(e=null)}for(var l=M.components.all,f=0,c=l.length;f<c;f++){var d=l[f];d&&!d.$removed&&!d.disabled&&d.$loaded&&d.path&&d.$compare(t)&&(u&&(u.visible&&!d.visible()||u.hidden&&!d.hidden()||u.enabled&&d.find(SELINPUT).is(":disabled")||u.disabled&&d.find(SELINPUT).is(":enabled"))||(d.state&&n.push(d),d.$valid_disabled||(d.$validate=!0,d.validate&&(d.$valid=d.validate(i(d.path)),d.$interaction(102),d.$valid||(r=!1)))))}return clear("valid"),state(n,1,1),r}}});
//# sourceMappingURL=sourcemaps/paths.js.map
