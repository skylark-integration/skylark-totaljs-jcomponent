/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define([],function(){return function(n){var e={};return{get:function(n){return e[n]},set:function(n,t){return e[n]=t,this},clear:function(){if(arguments.length)for(var n=langx.keys(e),t=0,r=n.length;t<r;t++){for(var f=n[t],i=!1,u=arguments,l=0;l<u.length;l++)if(f.substring(0,u[l].length)===u[l]){i=!0;break}i&&delete e[f]}else e={}}}}});
//# sourceMappingURL=../sourcemaps/views/cache.js.map
