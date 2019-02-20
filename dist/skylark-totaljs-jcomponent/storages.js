/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./defaults","./langx","./caches"],function(e,r,t,n){var i=e,s=r,a={},o="jc";function c(e,r,i){var s=Date.now();if(void 0!==r)return"session"===i?(n.set("$session"+e,r),r):(t.isString(i)&&(i=i.parseExpire()),a[e]={expire:s+i,value:r},u(),r);var o=n.get("$session"+e);return o||((o=a[e])&&o.expire>s?o.value:void 0)}function u(){!i.isPRIVATEMODE&&s.localstorage&&localStorage.setItem(o+".cache",JSON.stringify(a))}return e.storages={get:function(e){return c(e)},put:function(e,r,t){return c(e,r,t)},remove:function(e,r){if(r)for(var t in a)-1!==t.indexOf(e)&&delete a[e];else delete a[e];return u(),this},clearCache:function(){if(!i.isPRIVATEMODE){var e=localStorage.removeItem,r=o;e(r),e(r+".cache"),e(r+".blocked")}return this},save:u}});
//# sourceMappingURL=sourcemaps/storages.js.map
