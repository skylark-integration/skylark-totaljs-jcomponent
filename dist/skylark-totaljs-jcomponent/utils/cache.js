/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","./localStorage"],function(e,t){var n={},r={},a={};function i(){t.setItem("cache",a)}function o(e,t,n){return void 0!==t?o.set(e,t,n):o.get(e)}function i(){t.set("cache",a)}return o.get=function(e,t){var n,i=!t||"session"!=t;if((!t||"session"==t)&&(n=r[e]),void 0===n&&i){var o=a[e];o&&o.expire>now&&(n=o.value)}return n},o.set=function(t,n,o){if(!o||"session"===o)return r[t]=n,this;e.isString(o)&&(o=o.parseExpire());var s=Date.now();return a[t]={expire:s+o,value:n},i(),this},o.remove=function(e,t){if(t)for(var n in a)-1!==n.indexOf(e)&&delete a[e];else delete a[e];return i(),this},o.clean=function(){for(var e in a){var t=a[e];(!t.expire||t.expire<=now)&&delete a[e]}return i(),this},o.clear=function(){if(!M.isPRIVATEMODE){var e=t.removeItem,n=$localstorage;e(n),e(n+".cache"),e(n+".blocked")}return this},o.getPageData=function(e){return n[e]},o.setPageData=function(e,t){return n[e]=t,this},o.clearPageData=function(){if(arguments.length)for(var t=e.keys(n),r=0,a=t.length;r<a;r++){for(var i=t[r],o=!1,s=arguments,c=0;c<s.length;c++)if(i.substring(0,s[c].length)===s[c]){o=!0;break}o&&delete n[i]}else n={}},o.getSessionData=function(e){return r[e]},o.setSessionData=function(e,t){return r[e]=t,this},o.clearSessionData=function(){if(arguments.length)for(var t=e.keys(n),a=0,i=t.length;a<i;a++){for(var o=t[a],s=!1,c=arguments,l=0;l<c.length;l++)if(o.substring(0,c[l].length)===c[l]){s=!0;break}s&&delete r[o]}else r={}},o.getStorageData=function(e){return r[e]},o.setStorageData=function(e,t){return r[e]=t,this},o.clearStorageData=function(){if(arguments.length)for(var t=e.keys(n),a=0,o=t.length;a<o;a++){for(var s=t[a],c=!1,l=arguments,f=0;f<l.length;f++)if(s.substring(0,l[f].length)===l[f]){c=!0;break}c&&delete r[s]}else r={};i()},o.load=function(){var n;if(clearTimeout($ready),MD.localstorage)try{(n=t.getItem(M.$localstorage+".cache"))&&e.isString(n)&&(a=e.parse(n))}catch(e){}if(a){var r=a.$jcpath;r&&Object.keys(r.value).forEach(function(e){immSetx(e,r.value[e],!0)})}M.loaded=!0},o});
//# sourceMappingURL=../sourcemaps/utils/cache.js.map
