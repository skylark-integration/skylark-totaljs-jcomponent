/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","./registry"],function(n,e){return function(i,r,t,o){n.isFunction(r)&&(o=t,t=r,r=null),-1===i.indexOf(",")?(e[i]&&warn("Components: Overwriting component:",i),e[i]={name:i,config:r,declaration:t,shared:{},dependencies:o instanceof Array?o:null}):i.split(",").forEach(function(n,e){(n=n.trim())&&add(n,r,t,e?null:o)})}});
//# sourceMappingURL=../sourcemaps/components/register.js.map
