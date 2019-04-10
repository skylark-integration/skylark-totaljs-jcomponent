/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./langx","./utils/domx","./utils/query","./utils/cache","./components/Component","./components/configs","./components/configure","./components/extensions","./components/extend","./components/registry","./components/register","./components/Usage","./components/version"],function(n,e,o,t,s,r,i,c,f,u,m,p,a,d){return t.fn.component=function(){return o.findInstance(this,"$com")},t.fn.components=function(n){var e=helper.nested(this),o=null;return e.forEach(function(e){if(e instanceof Array)e.forEach(function(e){if(e&&e.$ready&&!e.$removed){if(n)return n.call(e,index);o||(o=[]),o.push(e)}});else if(e&&e.$ready&&!e.$removed){if(n)return n.call(e,index);o||(o=[]),o.push(e)}}),n?e:o},n.components={Component:r,configs:i,configure:c,extensions:f,extend:u,registry:m,register:p,Usage:a,version:d}});
//# sourceMappingURL=sourcemaps/components.js.map
