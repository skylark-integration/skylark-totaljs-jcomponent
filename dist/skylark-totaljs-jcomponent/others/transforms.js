/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define([],function(){var n={};return{register:function(t,r){return n[t]=r,this},transform:function t(r,i,e){var u=n;if(2===arguments.length)return function(n){t(r,n,i)};var f=function(){"string"==typeof e?SET(e,i):e(i)},o=r.split(","),a=[],c={};c.value=i;for(var l=0,v=o.length;l<v;l++){var h=o[l].trim();h&&u[h]&&a.push(u[h])}return 1===a.length?[0].call(c,i,function(n){void 0!==n&&(i=n),f()}):a.length?a.wait(function(n,t){n.call(c,i,function(n){void 0!==n&&(i=n),t()})},f):f(),this}}});
//# sourceMappingURL=../sourcemaps/others/transforms.js.map
