/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","./configs"],function(n,i){return function(t,a){if(n.isString(t)){var r=[];t.split(" ").forEach(function(n){var i="";switch(n.trim().substring(0,1)){case"*":return void r.push("com.path.indexOf('{0}')!==-1".format(n.substring(1)));case".":i="path";break;case"#":i="id";break;default:i="$name"}r.push("com.{0}=='{1}'".format(i,"$name"===i?n:n.substring(1)))}),t=FN("com=>"+r.join("&&"))}i.push({fn:t,config:a})}});
//# sourceMappingURL=../sourcemaps/components/configure.js.map
