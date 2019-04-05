/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./langx","./utils/domx","./utils/query","./utils/cache","./components/Component","./components/configs","./components/configure","./components/extensions","./components/extend","./components/registry","./components/register","./components/Usage"],function(e,n,o,t,r,s,c,i,f,a,u,m,l){s.components=[];return t.fn.component=function(){return o.findInstance(this,"$com")},t.fn.components=function(e){var n=helper.nested(this),o=null;return n.forEach(function(n){if(n instanceof Array)n.forEach(function(n){if(n&&n.$ready&&!n.$removed){if(e)return e.call(n,index);o||(o=[]),o.push(n)}});else if(n&&n.$ready&&!n.$removed){if(e)return e.call(n,index);o||(o=[]),o.push(n)}}),e?n:o},e.components={cleaner:cleaner,cleaner2:cleaner2,each:each,find:find,refresh:refresh,reset:reset,setter:setter,usage:usage,version:version}});
//# sourceMappingURL=sourcemaps/components.js.map
