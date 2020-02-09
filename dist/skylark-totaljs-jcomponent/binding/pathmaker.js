/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define([],function(n){return function(r,t){if(!r)return r;var i,u="";if(t&&-1!==(i=r.indexOf(" "))&&(u=r.substring(i),r=r.substring(0,i)),37===r.charCodeAt(0))return"jctmp."+r.substring(1)+u;if(64===r.charCodeAt(0))return r;if(-1===(i=r.indexOf("/")))return r+u;var e=r.substring(0,i);return(n.find(e)?"PLUGINS."+e:e+"_plugin_not_found")+"."+r.substring(i+1)+u}});
//# sourceMappingURL=../sourcemaps/binding/pathmaker.js.map
