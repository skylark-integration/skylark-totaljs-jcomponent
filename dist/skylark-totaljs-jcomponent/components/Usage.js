/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx"],function(t){function a(){var t=this;t.init=0,t.manually=0,t.input=0,t.default=0,t.custom=0,t.dirty=0,t.valid=0}return a.prototype.compare=function(a,i){t.isString(i)&&"-"!==i.substring(0,1)&&(i=t.now().add("-"+i));var e=this[a];return 0===e||e<i.getTime()},a.prototype.convert=function(t){var a=Date.now(),i={},e=1,n=this;switch(t.toLowerCase().substring(0,3)){case"min":case"mm":case"m":e=6e4;break;case"hou":case"hh":case"h":e=36e4;break;case"sec":case"ss":case"s":e=1e3}return i.init=0===n.init?0:(a-n.init)/e>>0,i.manually=0===n.manually?0:(a-n.manually)/e>>0,i.input=0===n.input?0:(a-n.input)/e>>0,i.default=0===n.default?0:(a-n.default)/e>>0,i.custom=0===n.custom?0:(a-n.custom)/e>>0,i.dirty=0===n.dirty?0:(a-n.dirty)/e>>0,i.valid=0===n.valid?0:(a-n.valid)/e>>0,i},a});
//# sourceMappingURL=../sourcemaps/components/Usage.js.map
