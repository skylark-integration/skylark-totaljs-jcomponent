/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["../langx","../utils/domx","../utils/query","./binding","./cache","./http","./plugins","./componenter","./eventer","./compiler","./helper","./scoper","./storing"],function(t,e,i,n,o,r,s,a,c,h,p,d,l){return e.Plugin.inherit({options:{elmAttrNames:{scope:"data-scope",bind:"data-bind",store:"data-store",com:{base:"data-com",url:"data-comp-url",removed:"data-com-removed",released:"data-com-released"},compile:"data-compile"}},_construct:function(t,i){e.Plugin.prototype._construct.apply(this,arguments),this.cache=o(this),this.http=r(this),this.helper=p(this),this.eventer=c(this),this.scoper=d(this),this.binding=n(this),this.storing=l(this),this.componenter=a(this),this.compiler=h(this),this.ready=[]},add:function(t,e){if((e instanceof COM||e instanceof Scope||e instanceof Plugin)&&(e=e.element),t instanceof Array)for(var n=0;n<t.length;n++)ADD(t[n],e);else i(e||document.body).append('<div data-jc="{0}"></div>'.format(t)),setTimeout2("ADD",COMPILE,10)},compile:function(t,e){},refresh:function(){var e=this;setTimeout2("$refresh",function(){e.componenter.components.sort(function(e,i){if(e.$removed||!e.path)return 1;if(i.$removed||!i.path)return-1;var n=e.path.length,o=i.path.length;return n>o?-1:n===o?t.localCompare(e.path,i.path):1})},200)},start:function(){this.helper.startView()},end:function(){}})});
//# sourceMappingURL=../sourcemaps/views/View.js.map
