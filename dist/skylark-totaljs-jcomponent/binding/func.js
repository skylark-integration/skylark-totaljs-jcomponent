/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./pathmaker"],function(n){var e=/[a-z0-9_-]+\/[a-z0-9_]+\(|(^|(?=[^a-z0-9]))@[a-z0-9-_]+\./i,t=function(e){var t=e.length;return n(e.substring(0,t-1))+e.substring(t-1)};function r(n){return n.replace(/&#39;/g,"'")}function u(n){return-1!==n.indexOf("value")&&(/\W/.test(n)||"value"===n)}function i(n,a){var c=(n=n.replace(e,t)).indexOf("=>");if(-1===c)return u(n)?i("value=>"+r(n),!0):new Function("return "+(-1===n.indexOf("(")?"typeof({0})=='function'?{0}.apply(this,arguments):{0}".format(n):n));var s=n.substring(0,c).trim(),o=n.substring(c+2).trim(),f=!1;(s=s.replace(/\(|\)|\s/g,"").trim())&&(s=s.split(",")),123!==o.charCodeAt(0)||a||(f=!0,o=o.substring(1,o.length-1).trim());var l=(f?"":"return ")+o;switch(s.length){case 1:return new Function(s[0],l);case 2:return new Function(s[0],s[1],l);case 3:return new Function(s[0],s[1],s[2],l);case 4:return new Function(s[0],s[1],s[2],s[3],l);case 0:default:return new Function(l)}}return i.rebinddecode=r,i.isValue=u,i});
//# sourceMappingURL=../sourcemaps/binding/func.js.map
