/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx"],function(e){return function(e){var n={};return{get:function(e){return n[e]},set:function(e,t){return n[e]=t,this},clear:function(){if(arguments.length)for(var e=Object.keys(n),t=0,r=e.length;t<r;t++){for(var f=e[t],i=!1,u=arguments,l=0;l<u.length;l++)if(f.substring(0,u[l].length)===u[l]){i=!0;break}i&&delete n[f]}else n={}}}}});
//# sourceMappingURL=../sourcemaps/views/cache.js.map
