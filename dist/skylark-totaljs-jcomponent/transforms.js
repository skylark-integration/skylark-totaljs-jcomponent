/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc"],function(n){var t={};return n.transforms={register:function(n,r){return t[n]=r,this},transform:function n(r,i,e){var f=t;if(2===arguments.length)return function(t){n(r,t,i)};var o=function(){typeof e===TYPE_S?SET(e,i):e(i)},u=r.split(","),a=[],c={};c.value=i;for(var l=0,s=u.length;l<s;l++){var v=u[l].trim();v&&f[v]&&a.push(f[v])}return 1===a.length?[0].call(c,i,function(n){void 0!==n&&(i=n),o()}):a.length?a.wait(function(n,t){n.call(c,i,function(n){void 0!==n&&(i=n),t()})},o):o(),this}}});
//# sourceMappingURL=sourcemaps/transforms.js.map
