/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./langx","./utils","./plugins","./components","./binding","./stores","./views","./others/schedulers","./others/transforms"],function(n,t,e,r,i,o,u,a,c,E){var s=e.query,f=e.blocks,T=e.storage,l=e.cookies,A=e.domx;return envs=e.envs,http=e.http,localStorage=e.localStorage,logs=e.logs,W=window,inited=!1,function(){if(inited)return W;W.W=window,W.FUNC={},Object.defineProperty(W,"WH",{get:function(){return s(W).height()}}),Object.defineProperty(W,"WW",{get:function(){return s(W).width()}}),Object.defineProperty(W,"NOW",{get:function(){return t.now()}}),s.fn.scope=function(){if(!this.length)return null;var n=this[0].$scopedata;if(n)return n;var t=this.closest("["+ATTRSCOPE+"]");return t.length&&(n=t[0].$scopedata)?n:null},s.fn.vbindarray=function(){return A.findinstance(this,"$vbindarray")},s.fn.vbind=function(){return A.findinstance(this,"$vbind")};var n,e=new a.View(document.body,{store:new u.Store({data:W})}),E=e.storing,d=(e.helper,e.componenter),p=e.compiler,C=e.eventer,O=e.binding;return e.start(),s.components=e.components,t.mixin(W,{isPRIVATEMODE:!1,isMOBILE:/Mobi/.test(navigator.userAgent),isROBOT:!navigator.userAgent||/search|agent|bot|crawler|spider/i.test(navigator.userAgent),isSTANDALONE:navigator.standalone||window.matchMedia("(display-mode: standalone)").matches,isTOUCH:!!("ontouchstart"in window||navigator.maxTouchPoints)}),t.each({MONTHS:"months",DAYS:"days"},function(n,t){Object.defineProperty(W,n,{get:()=>Date[t],set(n){Date[t]=n}})}),t.mixin(W,{AJAXCONFIG:http.configure,AJAXCACHE:http.ajaxCache,AJAXCACHEREVIEW:http.ajaxCacheReview,clearTimeout2:t.clearTimeout2,CACHE:T,CLEARCACHE:T.clear,CLEARSCHEDULE:c.clear,CLONE:t.clone,ENV:envs.variant,COOKIES:l,COPY:t.copy,CSS:A.style,DEF:{},EMPTYARRAY:t.empties.array,EMPTYOBJECT:t.empties.object,GUID:t.guid,HASH:t.hashCode,LCOMPARER:t.localCompare,IMPORTCACHE:http.importCache,IMPORT:http.import,MAKEPARAMS:http.makeParams,MEDIAQUERY:A.watchMedia,NOOP:t.empties.fn,PING:http.ping,READPARAMS:http.parseQuery,REMOVECACHE:T.remove,PARSE:t.parse,setTimeout2:t.setTimeout2,SCHEDULE:c.schedule,SCROLLBARWIDTH:A.scrollbarWidth,SINGLETON:t.singleton,STRINGIFY:t.stringify,STYLE:A.style,UPLOAD:http.upload,UPTODATE:http.uptodate,WAIT:t.wait,WARN:logs.warn,WIDTH:A.mediaWidth,FN:t.arrowFn}),t.mixin(W,{PLUGIN:r.register,PLUGINS:r.registry}),W.ADD=e.add,W.AJAX=function(n,e,r,i){if(t.isFunction(n)&&(i=r,r=e,e=n,n=location.pathname),t.isString(r)){var o=r;r=function(n){return E.remap(o,n)}}return http.ajax(n,e,r,i)},W.BIND=function(n){return E.bind(n)},W.BLOCKED=f.blocked,W.CACHEPATH=function(n,t,e){return E.cache(n,t,e)},W.CHANGE=function(n,t){return E.change(n.value)},W.CHANGED=function(n){return E.change(n)},W.COMPILE=function(t){return clearTimeout(n),p.compile(t)},W.COMPONENT=i.register,W.COMPONENT_CONFIG=i.configer,W.COMPONENT_EXTEND=i.extend,W.CREATE=function(n){return E.create(n)},W.DEFAULT=function(n,t,e){var r=n.split(/_{2,}/);if(r.length>1){var i=r[1],o=(n=r[0]).indexOf(".*");-1!==o&&(n=n.substring(0,o)),SET(n,new Function("return "+i)(),t>10?t:3,t>10?3:null)}return E.default(r[0],t,null,e)},W.EMIT=function(n){return C.emit.apply(E,arguments)},W.ERRORS=function(n,t,e){return E.errors(n,t,e)},W.EXEC=function(n){return E.exec.apply(E,arguments)},W.EXTEND=function(n,t,e,r){var i=typeof e;return"boolean"===i?E.extend(n,t,e):!e||e<10||"number"!==i?E.extend(n,t,e):(setTimeout(function(){E.extend(n,t,r)},e),W)},W.EXTEND2=function(n,t,e){return W.EXTEND(n,t,e),CHANGE(n),W},W.EVALUATE=function(n,t,e){return E.evaluate(n,t,e)},W.FIND=function(n,t,e,r){return d.find(n,t,e,r)},W.FREE=function(n){return t.setTimeout2("$clean",cleaner,n||10),W},W.GET=function(n,t){return n=O.pathmaker(n),!0===t&&(t=null,RESET(n,!0)),E.get(n,t)},W.GETR=function(n){return GET(n,!0)},W.INC=function(n,t,e,r){null==t&&(t=1);var i=typeof e;return"boolean"===i?E.inc(n,t,e):!e||e<10||"number"!==i?E.inc(n,t,e):(setTimeout(function(){E.inc(n,t,r)},e),W)},W.INC2=function(n,t,e){return INC(n,t,e),CHANGE(n),W},W.LASTMODIFICATION=W.USAGE=function(n,t,e,r){return d.usage(n,t,e,r)},W.MAKE=function(n,t,e){return E.make(n,t,e)},W.MODIFIED=function(n){return E.modified(n)},W.NOTMODIFIED=function(n,t,e){},W.MODIFY=function(n,t,e){return E.modify(n,t,e),W},W.NOTIFY=function(){return d.notify.apply(d,arguments),W},W.OFF=function(n,t,e){return C.off(n,t,e)},W.ON=function(n,t,e,r,i){return C.on(n,t,e,r,i)},W.OPT=function(n,e){return t.isFunction(n)&&(e=n,n={}),e.call(n,function(t,e){return E.set2(n,t,e)}),n},W.PUSH=function(n,t,e,r){var i=typeof e;return"boolean"===i?E.push(n,t,e):!e||e<10||"number"!==i?E.push(n,t,e):(setTimeout(function(){E.push(n,t,r)},e),W)},W.PUSH2=function(n,t,e){return PUSH(n,t,e),CHANGE(n),W},W.RECOMPILE=function(){n&&clearTimeout(n),n=setTimeout(function(){COMPILE(),n=null},700)},W.REMOVECACHE=T.remove,W.RESET=function(n,t,e){return E.reset(n,t,e)},W.REWRITE=function(n,t,e){return E.rewrite(n,t,e)},W.SET=function(n,t,e,r){var i=typeof e;return"boolean"===i?E.setx(n,t,e):!e||e<10||"number"!==i?E.setx(n,t,e):(setTimeout(function(){E.setx(n,t,r)},e),W)},W.SEEX=function(n,t,e,r,i){-1===n.indexOf(".")?EXEC(n,t,e,r,i):SET(n,t)},W.SET2=function(n,t,e){return SET(n,t,e),CHANGE(n),W},W.SETR=function(n,t,e){return E.setx(n,t,e),RESET(n),W},W.SETTER=function(){return d.setter.apply(d,arguments)},W.SKIP=function(){return E.skipInc.apply(E,arguments)},W.TOGGLE=function(n,t,e){var r=GET(n);return SET(n,!r,t,e),W},W.TOGGLE2=function(n,t){return TOGGLE(n,t),CHANGE(n),W},W.UNWATCH=function(n,t){return E.unwatch(n,t)},W.UPDATE=function(n,t,e){var r=typeof t;return"boolean"===r?E.update(n,t):!t||t<10||"number"!==r?E.update(n,e,t):void setTimeout(function(){E.update(n,e)},t)},W.UPDATE2=function(n,t){return UPDATE(n,t),CHANGE(n),W},W.UPTODATE=function(n,e,r,i){t.isFunction(e)&&(i=r,r=e,e="");var o=(new Date).add(n);topic.on("knockknock",function(){if(!(o>t.now())&&i&&i()){var n=setTimeout(function(){var n=window.location;e?n.href=e.$env():n.reload(!0)},5e3);r&&r(n)}})},W.VBIND=o.vbind,W.VBINDARRAY=o.vbindArray,W.VALIDATE=function(n,t){return d.validate(n,t)},W.VERSION=i.versions.set,W.WATCH=function(n,t,e){return C.watch(n,t,e)},inited=!0,W}});
//# sourceMappingURL=sourcemaps/globals.js.map
