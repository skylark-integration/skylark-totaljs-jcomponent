/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","./compose","./crawler","./download","./pend"],function(e,t,n,i,o){var r;return Evented.inherit({options:{elmComAttrNames:{base:"data-jc",url:"data-jc-url",removed:"data-jc-removed",released:"data-jc-released",scope:"data-jc-scope"}},_construct:function(e){this.is=!1,this.recompile=!1,this.importing=0,this.pending=[],this.init=[],this.imports={},this.ready=[]},attrcom:function(e){return attrcom(e)},compile:function(a,s){var c=this;if(c.is)c.recompile=!0;else{var p=[];if(W.READY instanceof Array&&p.push.apply(p,W.READY),W.jComponent instanceof Array&&p.push.apply(p,W.jComponent),W.components instanceof Array&&p.push.apply(p,W.components),p.length)for(;;){var l=p.shift();if(!l)break;l()}if(c.is=!0,i(c),c.pending.length)!function(e){c.pending.push(function(){compile(c,e)})}(a);else{if(n(c,a,t),r&&clearTimeout(r),r=setTimeout(function(){for(var e=bindersnew.splice(0),t=0;t<e.length;t++){var n=e[t];n.init||(n.com?n.exec(n.com.data(n.path),n.path):n.exec(getx(n.path),n.path))}},50),c.is=!1,void 0!==a||!toggles.length)return o();e.async(toggles,function(e,t){for(var n=0,i=e.toggle.length;n<i;n++)e.element.tclass(e.toggle[n]);t()},o)}}},refresh:function(){setTimeout2("$refresh",function(){all.sort(function(e,t){if(e.$removed||!e.path)return 1;if(t.$removed||!t.path)return-1;var n=e.path.length,i=t.path.length;return n>i?-1:n===i?LCOMPARER(e.path,t.path):1})},200)}})});
//# sourceMappingURL=../sourcemaps/views/View.js.map
