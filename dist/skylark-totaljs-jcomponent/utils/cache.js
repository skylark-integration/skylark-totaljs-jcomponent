/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../defaults","../langx"],function(e,t){var n={},r={},i={};function a(e,t,n){}function o(){localStorage.set("cache",i)}return a.get=function(e,t){var n,a=!t||"session"!=t;if((!t||"session"==t)&&(n=r[e]),void 0===n&&a){var o=i[e];o&&o.expire>now&&(n=o.value)}return n},a.set=function(e,n,a){if(!a||"session"===a)return r[e]=n,this;t.isString(a)&&(a=a.parseExpire());var s=Date.now();return i[e]={expire:s+a,value:n},o(),this},a.remove=function(e,t){if(t)for(var n in i)-1!==n.indexOf(e)&&delete i[e];else delete i[e];return o(),this},a.clear=function(){if(!M.isPRIVATEMODE){var e=localStorage.removeItem,t=$localstorage;e(t),e(t+".cache"),e(t+".blocked")}return this},a.getPageData=function(e){return n[e]},a.setPageData=function(e,t){return n[e]=t,this},a.clearPageData=function(){if(arguments.length)for(var e=t.keys(n),r=0,i=e.length;r<i;r++){for(var a=e[r],o=!1,s=arguments,f=0;f<s.length;f++)if(a.substring(0,s[f].length)===s[f]){o=!0;break}o&&delete n[a]}else n={}},a});
//# sourceMappingURL=../sourcemaps/utils/cache.js.map
