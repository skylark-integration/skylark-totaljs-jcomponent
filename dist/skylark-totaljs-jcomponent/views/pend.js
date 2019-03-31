/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define([],function(){var a=[];function e(){C.importing?setTimeout(e,1e3):langx.setTimeout2("$fallback",function(){a.splice(0).wait(function(a,e){Component.registry[a]?e():(warn("Downloading: "+a),http.importCache(MD.fallback.format(a),MD.fallbackcache,e))},3)},100)}return function(){var l=C.pending.shift();if(l)l();else if($domready&&(C.ready&&(C.is=!1),MD.fallback&&fallback.$&&!C.importing)){for(var n=Object.keys(fallback),t=0;t<n.length;t++)"$"!==n[t]&&1===fallback[n[t]]&&(a.push(n[t].toLowerCase()),fallback[n[t]]=2);fallback.$=0,a.length&&e()}}});
//# sourceMappingURL=../sourcemaps/views/pend.js.map
