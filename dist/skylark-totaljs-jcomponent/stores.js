/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-langx/langx","./jc","./stores/Store"],function(t,r,e){var n=/\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi;return Array.prototype.findValue=function(r,e,n,i,a){t.isFunction(r)&&(i=n,n=e,e=void 0,a=!1);var o,s=i;if(a&&(o="fv_"+r+"="+e,caches.temp[o]))return caches.temp[o];var c=this.findIndex(r,e);if(-1!==c){var u=this[c];u=-1===n.indexOf(".")?u[n]:get(n,u),a&&(caches.temp[o]=s),s=null==u?i:u}return s},String.prototype.params=String.prototype.arg=function(t){return this.replace(n,function(r){var e=123===r.charCodeAt(1)?2:1,n=get(r.substring(e,r.length-e).trim(),t);return null==n?r:n})},r.stores={Store:e}});
//# sourceMappingURL=sourcemaps/stores.js.map
