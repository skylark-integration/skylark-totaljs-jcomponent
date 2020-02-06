/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../utils/domx","../utils/query","./binding","./cache","./componenter","./eventer","./compiler","./helper","./scoper","./storing"],function(t,e,n,i,o,r,s,a,c,h,p){return e.Plugin.inherit({options:{elmAttrNames:{scope:"data-scope",bind:"data-bind",store:"data-store",com:{base:"data-com",url:"data-comp-url",removed:"data-com-removed",released:"data-com-released"},compile:"data-compile"}},_construct:function(t,n){e.Plugin.prototype._construct.apply(this,arguments),this.cache=o(this),this.helper=c(this),this.eventer=s(this),this.scoper=h(this),this.binding=i(this),this.storing=p(this),this.componenter=r(this),this.compiler=a(this),this.ready=[]},add:function(t,e){if((e instanceof COM||e instanceof Scope||e instanceof Plugin)&&(e=e.element),t instanceof Array)for(var i=0;i<t.length;i++)ADD(t[i],e);else n(e||document.body).append('<div data-jc="{0}"></div>'.format(t)),setTimeout2("ADD",COMPILE,10)},compile:function(t,e){},refresh:function(){var e=this;setTimeout2("$refresh",function(){e.componenter.components.sort(function(e,n){if(e.$removed||!e.path)return 1;if(n.$removed||!n.path)return-1;var i=e.path.length,o=n.path.length;return i>o?-1:i===o?t.localCompare(e.path,n.path):1})},200)},start:function(){this.helper.startView()},end:function(){}})});
//# sourceMappingURL=../sourcemaps/views/View.js.map
