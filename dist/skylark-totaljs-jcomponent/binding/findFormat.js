/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./func","./pathmaker"],function(n,e){return function(e){var i=e.indexOf("--\x3e"),r=3;return-1===i&&(i=e.indexOf("->"),r=2),-1!==i&&-1!==e.indexOf("/")&&-1===e.indexOf("(")&&(e+="(value)"),-1===i?null:{path:e.substring(0,i).trim(),fn:n(e.substring(i+r).trim())}}});
//# sourceMappingURL=../sourcemaps/binding/findFormat.js.map
