/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define([],function(){var n,e={},t=[];return{addType:function(n,t){e[n.toLowerCase()]=t},hasType:function(n){return!!e[n.toLowerCase()]},createInstance:function(t,o){var r,a,i;if(!n){for(a in i=tinymce.ui)e[a.toLowerCase()]=i[a];n=!0}if("string"==typeof t?(o=o||{}).type=t:t=(o=t).type,t=t.toLowerCase(),!(r=e[t]))throw new Error("Could not find control by type: "+t);return(r=new r(o)).type=t,r},types:e,instances:t,addInstance:function(n){t.push(n)},allInstances:function(){return t}}});
//# sourceMappingURL=../sourcemaps/components/registry.js.map
