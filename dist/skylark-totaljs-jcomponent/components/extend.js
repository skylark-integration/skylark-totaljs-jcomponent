/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","./extensions"],function(n,e){var f=n.topic;return function(n,i,o){if(typeof i===TYPE_FN){var t=o;o=i,i=t}e[n]?e[n].push({config:i,fn:o}):e[n]=[{config:i,fn:o}],f.publish("skylark.vvm.component.extend",n)}});
//# sourceMappingURL=../sourcemaps/components/extend.js.map
