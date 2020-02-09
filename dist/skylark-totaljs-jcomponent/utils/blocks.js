/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","./localStorage"],function(e,n){var o={},t={blocked:function(t,r,i){var a=t,l=o[a],c=Date.now();if(l>c)return!0;e.isString(r)&&(r=r.env().parseExpire());return o[a]=c+r,n.set("blocked",o),i&&i(),!1},load:function(){o=n.get("blocked")},clean:function(){for(var e in o)o[e]<=now&&(delete o[e],is2=!0);MD.localstorage&&is2&&!M.isPRIVATEMODE&&n.setItem(M.$localstorage+".blocked",JSON.stringify(o))}};return t});
//# sourceMappingURL=../sourcemaps/utils/blocks.js.map
