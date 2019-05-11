/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["skylark-langx/langx","./jc","./stores/Store"],function(r,t,e){var n=/\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi;return Array.prototype.findValue=function(t,e,n,i,a){r.isFunction(t)&&(i=n,n=e,e=void 0,a=!1);var o,s=i;if(a&&(o="fv_"+t+"="+e,caches.temp[o]))return caches.temp[o];var u=this.findIndex(t,e);if(-1!==u){var c=this[u];c=-1===n.indexOf(".")?c[n]:get(n,c),a&&(caches.temp[o]=s),s=null==c?i:c}return s},String.prototype.params=String.prototype.arg=function(t){return this.replace(n,function(e){var n=123===e.charCodeAt(1)?2:1,i=r.result(t,e.substring(n,e.length-n).trim());return null==i?e:i})},t.stores={Store:e}});
//# sourceMappingURL=sourcemaps/stores.js.map
