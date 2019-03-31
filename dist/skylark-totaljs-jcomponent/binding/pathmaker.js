/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../plugins"],function(n){return function(r,i){if(!r)return r;var t,u="";if(i&&-1!==(t=r.indexOf(" "))&&(u=r.substring(t),r=r.substring(0,t)),37===r.charCodeAt(0))return"jctmp."+r.substring(1)+u;if(64===r.charCodeAt(0))return r;if(-1===(t=r.indexOf("/")))return r+u;var e=r.substring(0,t);return(n.find(e)?"PLUGINS."+e:e+"_plugin_not_found")+"."+r.substring(t+1)+u}});
//# sourceMappingURL=../sourcemaps/binding/pathmaker.js.map
