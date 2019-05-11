/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-langx/langx","./jc","./langx/localCompare","./langx/regexp","./langx/now","./langx/statics","./langx/ArrayEx","./langx/DateEx","./langx/NumberEx","./langx/StringEx"],function(e,t,n,r,i,u){var o={},a={jsoncompress:!1,jsondate:!0};function s(e,t){switch(typeof e){case"number":case"boolean":return e;case"string":return t?e:s(get(e),!0)}return null==e?e:e instanceof Date?new Date(e.getTime()):f(JSON.stringify(e))}function f(t,n){var r=t.substring(0,1);if("#"===r||"."===r)return f($(t).html(),n);void 0===n&&(n=a.jsondate);try{return JSON.parse(t,function(t,r){return e.isString(r)&&n&&r.isJSONDate()?new Date(r):r})}catch(e){return null}}function l(e,t,n){void 0===t&&(t=a.jsoncompress);var r=typeof n;return JSON.stringify(e,function(e,i){if(!e)return i;if(n)if(n instanceof Array){if(-1===n.indexOf(e))return}else if(langx.isFunction(r)){if(!n(e,i))return}else if(!1===n[e])return;if(!0===t){if(langx.isString(i))return(i=i.trim())||void 0;if(!1===i||null==i)return}return i})}var c={array:[],object:{},fn:function(){}},g={};return Object.freeze&&(Object.freeze(c.array),Object.freeze(c.object)),t.langx={Evented:e.Evented,extend:e.extend,hoster:e.hoster,isFunction:e.isFunction,isNumber:e.isNumber,isObject:e.isObject,isPlainObject:e.isPlainObject,isString:e.isString,klass:e.klass,mixin:e.mixin,result:e.result,topic:e.topic,Xhr:e.Xhr,async:function e(t,n,r){var i=t.shift();if(null==i)return r&&r();n(i,function(){e(t,n,r)})},clearTimeout2:function(e){var t=":"+e;return!!u[t]&&(clearTimeout(u[t]),u[t]=void 0,u[t+":limit"]&&(u[t+":limit"]=void 0),!0)},clone:s,copy:function(e,t){for(var n=Object.keys(e),r=0;r<n.length;r++){var i=n[r],u=e[i],o=typeof u;t[i]=o===TYPE_O&&u?s(u):u}return t},empties:c,Evented:e.Evented,guid:function(e){e||(e=10);for(var t=1+(e/10>>0),n=[],r=0;r<t;r++)n.push(Math.random().toString(36).substring(2));return n.join("").substring(0,e)},hashCode:function(e){if(!e)return 0;var t=typeof e;if("number"===t)return e;if("boolean"===t)return e?1:0;if(e instanceof Date)return e.getTime();"object"===t&&(e=l(e));var n,r=0;if(!e.length)return r;var i=e.length;for(n=0;n<i;n++)r=(r<<5)-r+e.charCodeAt(n),r|=0;return r},localCompare:n,now:i,parse:f,regexp:r,result:e.result,setTimeout2:function(e,t,n,r,i){var o=":"+e;if(r>0){var a=o+":limit";if(u[a]>=r)return;return u[a]=(u[a]||0)+1,u[o]&&clearTimeout(u[o]),u[o]=setTimeout(function(e){u[a]=void 0,t&&t(e)},n,i)}return u[o]&&clearTimeout(u[o]),u[o]=setTimeout(t,n,i)},singleton:function(e,t){return g[e]||(g[e]=new Function("return "+(t||"{}"))())},stringify:l,statics:u,wait:function(e,t,n,r){var i=(1e4*Math.random()>>0).toString(16),u=r>0?i+"_timeout":0;if("number"==typeof t){var a=n;n=t,t=a}var s="string"==typeof e,f=!1;s?get(e)&&(f=!0):e()&&(f=!0),f?t(null,function(i){setTimeout(function(){WAIT(e,t,n,r)},i||1)}):(u&&(o[u]=setTimeout(function(){clearInterval(o[i]),delete o[u],delete o[i],t(new Error("Timeout."))},r)),o[i]=setInterval(function(){if(s){if(null==get(e))return}else if(!e())return;clearInterval(o[i]),delete o[i],u&&(clearTimeout(o[u]),delete o[u]),t&&t(null,function(r){setTimeout(function(){WAIT(e,t,n)},r||1)})},n||500))}}});
//# sourceMappingURL=sourcemaps/langx.js.map
