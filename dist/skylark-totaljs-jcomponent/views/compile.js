/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./defaults","../langx","./utils/caches","./http","./plugins","./Component","./paths","./views"],function(e,t,i,n,o,s,p,c,m){extensions=p.extensions,components=m.components,C=e.compiler={};C.is=!1,C.recompile=!1,C.importing=0,C.pending=[],C.init=[],C.imports={},C.ready=[],C.get=get;setTimeout(load,2);return p.prototype.compile=function(e){return!e&&this.attrd("jc-compile")&&this.attrd("jc-compile","1"),compile(e||this.element),this},compile});
//# sourceMappingURL=../sourcemaps/views/compile.js.map
