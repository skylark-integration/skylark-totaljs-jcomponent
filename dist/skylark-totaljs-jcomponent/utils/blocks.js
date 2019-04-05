/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./localStorage"],function(e){var r={},a={blocked:function(a,n,t){var o=a,l=r[o],c=Date.now();if(l>c)return!0;langx.isString(n)&&(n=n.env().parseExpire());var i=MD.localstorage&&n>1e4;return r[o]=c+n,!M.isPRIVATEMODE&&i&&e.set("blocked",r),t&&t(),!1}};return block.load=function(){var a;try{(a=e.getItem(M.$localstorage+".blocked"))&&langx.isString(a)&&(r=langx.parse(a))}catch(e){}},a});
//# sourceMappingURL=../sourcemaps/utils/blocks.js.map
