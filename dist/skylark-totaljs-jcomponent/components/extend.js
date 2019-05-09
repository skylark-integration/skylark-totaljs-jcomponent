/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","./extensions"],function(n,i){var o=n.topic;return function(e,f,t){if(n.isFunction(f)){var c=t;t=f,f=c}i[e]?i[e].push({config:f,fn:t}):i[e]=[{config:f,fn:t}],o.publish("skylark.vvm.component.extend",e)}});
//# sourceMappingURL=../sourcemaps/components/extend.js.map
