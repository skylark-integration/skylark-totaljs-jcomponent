/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./langx","./topic","./caches","./storages"],function(e,t,r,n,s){var a={},i={};function o(e){var t={};return e.split("\n").forEach(function(e){var r=e.indexOf(":");-1!==r&&(t[e.substring(0,r).toLowerCase()]=e.substring(r+1).trim())}),t}function u(e,r,n,a,i){n&&!n.version&&M.$version&&(n.version=M.$version),n&&!n.language&&M.$language&&(n.language=M.$language),n=t.stringify(n);var o=t.hashCode(e+"#"+r.replace(/\//g,"")+n).toString();return s.set(o,a,i)}function c(e,t){if(i.makeurl&&(e=i.makeurl(e)),t)return e;var r=[],n=encodeURIComponent;return M.$version&&r.push("version="+n(M.$version)),M.$language&&r.push("language="+n(M.$language)),r.length?(e+=-1==e.indexOf("?")?"?":"&")+r.join("&"):e}function l(e,s,a,i,o,u){var l,d=(e=e.$env().replace(/<.*?>/,function(e){return l=e.substring(1,e.length-1).trim(),""}).trim()).substring(0,1),v="once "===e.substring(0,5).toLowerCase();if(t.isFunction(a)?(t.isFunction(i)?(u=i,o=!0):typeof o===TYPE_FN&&(u=o,o=!0),i=a,a="body"):t.isFunction(o)&&(u=o,o=!0),l){var m="()"===l.substring(l.length-2);m&&(l=l.substring(0,l.length-2));var g=GET(l);if(m&&t.isFunction(g)){if(g())return void(i&&i(0))}else if(g)return void(i&&i(0))}"//"===e.substring(0,2)&&(e=location.protocol+e);var h=e.lastIndexOf(" ."),y="";if(-1!==h&&(y=e.substring(h).trim().toLowerCase(),e=e.substring(0,h).trim()),"!"===d||v){if(e=v?e.substring(5):e.substring(1),statics[e])return i&&(2===statics[e]?i(0):t.wait(function(){return 2===statics[e]},function(){i(0)})),W;statics[e]=1}if(a&&a.setPath&&(a=a.element),a||(a="body"),!y)if(-1!==(h=e.lastIndexOf("?"))){var T=e.lastIndexOf(".",h);-1!==T&&(y=e.substring(T,h).toLowerCase())}else-1!==(h=e.lastIndexOf("."))&&(y=e.substring(h).toLowerCase());var E=document;if(".js"===y){var b=E.createElement("script");return b.type="text/javascript",b.async=!1,b.onload=function(){statics[e]=2,i&&i(1),setTimeout(compile,300)},b.src=c(e,!0),E.getElementsByTagName("head")[0].appendChild(b),r.emit("import",e,$(b)),this}if(".css"===y){var x=E.createElement("link");return x.type="text/css",x.rel="stylesheet",x.href=c(e,!0),E.getElementsByTagName("head")[0].appendChild(x),statics[e]=2,i&&setTimeout(i,200,1),r.emit("import",e,$(x)),this}return t.wait(function(){return!!W.jQuery},function(){statics[e]=2;var c="import"+HASH(e),l=function(s,l,p){if(s){e="$import"+e,u&&(s=u(s,p));var f=REGCOM.test(s);s=importscripts(importstyles(s,c)).trim(),a=$(a),s&&(n.current.element=a[0],!1===o?a.html(s):a.append(s),n.current.element=null),setTimeout(function(){f&&compile(),i&&t.wait(function(){return 0==C.is},function(){i(1)}),r.emit("import",e,a)},10)}else i&&i(0)};s?f("GET "+e,null,l,s):p("GET "+e,l)}),W}function p(e,t,n,s){typeof e===TYPE_FN&&(s=n,n=t,t=e,e=location.pathname);var u,l=typeof t,p=EMPTYARRAY;n||l!==TYPE_FN&&l!==TYPE_S||(s=n,n=t,t=void 0);var f=e.indexOf(" ");if(-1===f)return W;var d=!1;e=e.replace(/\srepeat/i,function(){return d=!0,""}),d&&(p=[e,t,n,s]);var v=e.substring(0,f).toUpperCase(),m="!"===v.substring(0,1);m&&(v=v.substring(1));var g={};return(u=e.match(/\{.*?\}/g))&&(e=e.replace(u,"").replace(/\s{2,}/g," "),typeof(u=new Function("return "+u)())===TYPE_O&&(g=u)),e=e.substring(f).trim().$env(),setTimeout(function(){if("GET"===v&&t){var s=typeof t===TYPE_S?t:jQuery.param(t,!0);s&&(e+="?"+s)}var u={};u.method=v,u.converters=i.jsonconverter,"GET"!==v&&(typeof t===TYPE_S?u.data=t:(u.contentType="application/json; charset=utf-8",u.data=STRINGIFY(t))),u.headers=$.extend(g,i.headers),e.match(/http:\/\/|https:\/\//i)?(u.crossDomain=!0,delete u.headers["X-Requested-With"],m&&(u.xhrFields={withCredentials:!0})):e=e.ROOT();var l=e.match(/\([a-z0-9\-.,]+\)/i);if(l){e=e.replace(l,"").replace(/\s+/g,""),u.url=e,l=l.toString().replace(/\(|\)/g,"").split(",");for(var f=0;f<l.length;f++){var h=a[l[f].trim()];h&&h(u)}}if(u.url||(u.url=e),r.emit("request",u),!u.cancel){u.type=u.method,delete u.method;var y={};y.url=u.url,y.process=!0,y.error=!1,y.upload=!1,y.method=v,y.data=t,delete u.url,u.success=function(e,t,s){y.response=e,y.status=s.status||999,y.text=t,y.headers=o(s.getAllResponseHeaders()),r.emit("response",y),y.process&&!y.cancel&&(typeof n===TYPE_S?remap(n,y.response):n&&n.call(y,y.response,void 0,y))},u.error=function(e,t){var s=e.status;if(!d||s&&408!==s&&502!==s&&503!==s&&504!==s&&509!==s){y.response=e.responseText,y.status=s||999,y.text=t,y.error=!0,y.headers=o(e.getAllResponseHeaders());var a=y.headers["content-type"];if(a&&-1!==a.indexOf("/json"))try{y.response=PARSE(y.response,i.jsondate)}catch(e){}r.emit("response",y),!y.cancel&&y.process&&(i.ajaxerrors?typeof n===TYPE_S?remap(n,y.response):n&&n.call(y,y.response,y.status,y):(r.emit("error",y),typeof n===TYPE_FN&&n.call(y,y.response,y.status,y)))}else setTimeout(function(){p[0]+=" REPEAT",W.AJAX.apply(M,p)},i.delayrepeat)},$.ajax(c(y.url),u)}},s||0),this}function f(e,t,r,n,s,a,i){var o=typeof t;(o===TYPE_FN||o===TYPE_S&&typeof r===TYPE_S&&typeof n!==TYPE_S)&&(a=s,s=n,n=r,r=t,t=null),"boolean"==typeof s&&(a=!0===s,s=0);var c=e.indexOf(" ");if(-1===c)return W;var l=e.substring(0,c).toUpperCase(),f=e.substring(c).trim().$env();return setTimeout(function(){var s=a?void 0:u(l,f,t,void 0,n);if(void 0===s)p(e,t,function(e,s){s&&(e=s),u(l,f,t,e,n),typeof r===TYPE_S?remap(r,e):r(e,!1)});else{var o=i?STRINGIFY(s):null;if(typeof r===TYPE_S?remap(r,s):r(s,!0),!i)return;p(e,t,function(e,s){s&&(e=s),o!==STRINGIFY(e)&&(u(l,f,t,e,n),typeof r===TYPE_S?remap(r,e):r(e,!1,!0))})}},s||1),this}return i.ajaxerrors=!1,i.pingdata={},i.baseurl="",i.makeurl=null,i.delayrepeat=2e3,i.jsondate=!0,i.jsonconverter={"text json":function(e){return PARSE(e)}},i.headers={"X-Requested-With":"XMLHttpRequest"},e.http={defaults:i,ajax:p,ajaxCache:f,ajaxCacheReview:function(e,t,r,n,s,a){return f(e,t,r,n,s,a,!0)},configure:function(e,t){return a[e]=t,this},import2:function(e,r,n,s,a){return e instanceof Array?(t.isFunction(r)&&(a=s,s=n,n=r,r=null),e.wait(function(e,t){l(e,null,r,t,s,a)},function(){n&&n()})):l(e,null,r,n,s,a),this},importCache:l,makeParams:function(e,t,r){var n,s=location;typeof e===TYPE_O&&(r=t,t=e,e=s.pathname+s.search);var a=e.indexOf("?");-1!==a?(n=M.parseQuery(e.substring(a+1)),e=e.substring(0,a)):n={};for(var i=Object.keys(t),o=0,u=i.length;o<u;o++){var c=i[o];n[c]=t[c]}var l=$.param(n,null==r||!0===r);return e+(l?"?"+l:"")},ping:function(e,t,r){if(null==navigator.onLine||navigator.onLine){"boolean"==typeof t&&(r=t,t=0);var n=(e=e.$env()).indexOf(" "),s="GET";-1!==n&&(s=e.substring(0,n).toUpperCase(),e=e.substring(n).trim());var a={},o=$.param(i.pingdata);return o&&(n=e.lastIndexOf("?"),e+=-1===n?"?"+o:"&"+o),a.type=s,a.headers={"x-ping":location.pathname,"x-cookies":navigator.cookieEnabled?"1":"0","x-referrer":document.referrer},a.success=function(e){if(e)try{new Function(e)()}catch(e){}},r&&$.ajax(c(e),a),setInterval(function(){$.ajax(c(e),a)},t||3e4)}},parseQuery:function(e){if(e||(e=location.search),!e)return{};var t=e.indexOf("?");-1!==t&&(e=e.substring(t+1));for(var r=e.split("&"),n={},s=0,a=r.length;s<a;s++){var i=r[s].split("="),o=i[0],u=decodeURIComponent((i[1]||"").replace(/\+/g,"%20"));n[o]?(n[o]instanceof Array||(n[o]=[n[o]]),n[o].push(u)):n[o]=u}return n},upload:function(e,n,s,a,u){t.isNumber(a)||null!=u||(u=a,a=null),e||(e=location.pathname);var l="POST",p=e.indexOf(" "),f=null;-1!==p&&(l=e.substring(0,p).toUpperCase());var d="!"===l.substring(0,1);d&&(l=l.substring(1));var v={};(f=e.match(/\{.*?\}/g))&&(e=e.replace(f,"").replace(/\s{2,}/g," "),typeof(f=new Function("return "+f)())===TYPE_O&&(v=f)),e=e.substring(p).trim().$env(),typeof s===TYPE_N&&(a=s,s=void 0);var m={};if(m.url=e,m.process=!0,m.error=!1,m.upload=!0,m.method=l,m.data=n,r.emit("request",m),!m.cancel)return setTimeout(function(){var e=new XMLHttpRequest;d&&(e.withCredentials=!0),e.addEventListener("load",function(){var e=this.responseText;try{e=PARSE(e,i.jsondate)}catch(e){}u&&(typeof u===TYPE_S?remap(u,100):u(100)),m.response=e,m.status=this.status,m.text=this.statusText,m.error=this.status>399,m.headers=o(this.getAllResponseHeaders()),r.emit("response",m),m.process&&!m.cancel&&(!e&&m.error&&(e=m.response=this.status+": "+this.statusText),!m.error||i.ajaxerrors?typeof s===TYPE_S?remap(s.env(),e):s&&s(e,null,m):(r.emit("error",m),m.process&&typeof s===TYPE_FN&&s({},e,m)))},!1),e.upload.onprogress=function(e){if(u){var r=0;e.lengthComputable&&(r=Math.round(100*e.loaded/e.total)),t.isString(u)?remap(u.env(),r):u(r,e.transferSpeed,e.timeRemaining)}},e.open(l,c(m.url));for(var a=Object.keys(i.headers),p=0;p<a.length;p++)e.setRequestHeader(a[p].env(),i.headers[a[p]].env());if(v)for(a=Object.keys(v),p=0;p<a.length;p++)e.setRequestHeader(a[p],v[a[p]]);e.send(n)},a||0),W},uptodate:function(e,n,s,a){t.isFunction(n)&&(a=s,s=n,n="");var i=(new Date).add(e);r.on("knockknock",function(){if(!(i>t.now())&&a&&a()){var e=setTimeout(function(){var e=window.location;n?e.href=n.$env():e.reload(!0)},5e3);s&&s(e)}})}}});
//# sourceMappingURL=sourcemaps/http.js.map