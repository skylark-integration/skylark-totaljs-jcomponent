/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./localStorage"],function(e){var n={},r={blocked:function(r,o,t){var a=r,l=n[a],c=Date.now();if(l>c)return!0;langx.isString(o)&&(o=o.env().parseExpire());MD.localstorage;return n[a]=c+o,e.set("blocked",n),t&&t(),!1},load:function(){n=e.get("blocked")}};return r});
//# sourceMappingURL=../sourcemaps/utils/blocks.js.map
