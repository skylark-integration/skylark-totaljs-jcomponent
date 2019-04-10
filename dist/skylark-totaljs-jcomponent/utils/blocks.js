/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./localStorage"],function(e){var n={},o={blocked:function(o,t,r){var a=o,l=n[a],i=Date.now();if(l>i)return!0;langx.isString(t)&&(t=t.env().parseExpire());MD.localstorage;return n[a]=i+t,e.set("blocked",n),r&&r(),!1},load:function(){n=e.get("blocked")},clean:function(){for(var o in n)n[o]<=now&&(delete n[o],is2=!0);MD.localstorage&&is2&&!M.isPRIVATEMODE&&e.setItem(M.$localstorage+".blocked",JSON.stringify(n))}};return o});
//# sourceMappingURL=../sourcemaps/utils/blocks.js.map
