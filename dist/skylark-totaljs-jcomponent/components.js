/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./langx","./utils/domx","./utils/query","./components/Component","./components/configs","./components/configure","./components/extensions","./components/extend","./components/registry","./components/register","./components/Usage","./components/versions"],function(n,e,o,t,s,r,i,c,f,m,u,p,a){return t.fn.component=function(){return o.findInstance(this,"$com")},t.fn.components=function(n){var e=helper.nested(this),o=null;return e.forEach(function(e){if(e instanceof Array)e.forEach(function(e){if(e&&e.$ready&&!e.$removed){if(n)return n.call(e,index);o||(o=[]),o.push(e)}});else if(e&&e.$ready&&!e.$removed){if(n)return n.call(e,index);o||(o=[]),o.push(e)}}),n?e:o},n.components={Component:s,configs:r,configure:i,extensions:c,extend:f,registry:m,register:u,Usage:p,versions:a}});
//# sourceMappingURL=sourcemaps/components.js.map
