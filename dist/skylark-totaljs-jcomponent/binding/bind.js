/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../stores","./pathmaker"],function(r,t){return function e(n){if(n instanceof Array){for(var i=0;i<n.length;i++)e(n[i]);return this}if(!(n=t(n)))return this;33===n.charCodeAt(0)&&(n=n.substring(1)),(n=n.replaceWildcard())&&r.set(n,r.get(n),!0)}});
//# sourceMappingURL=../sourcemaps/binding/bind.js.map
