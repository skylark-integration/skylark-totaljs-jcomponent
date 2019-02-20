/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
define(["./jc","./defaults","./env","./langx","./logs","./topic","./cookies","./caches","./storages","./transforms","./plugins","./Component","./binders","./views","./compiler","./schedulers","./paths"],function(e,t,i,E,n,s,r,a,A,o,T,O,c,C,u,I,m){var N,d=Window;return E.each({isPRIVATEMODE:"isPRIVATEMODE",isMOBILE:"isMOBILE",isROBOT:"isROBOT",isSTANDALONE:"isSTANDALONE",isTOUCH:"isTOUCH",MONTHS:"months",DAYS:"days"},function(t,i){Object.defineProperty(this,t,{get:()=>e[i],set(t){e[i]=t}})}),d.DEF=t,d.ENV=i,E.mixin(d,{clearTimeout2:E.clearTimeout2,setTimeout2:E.setTimeout2,WAIT:E.wait,COPY:E.copy,CLONE:E.clone,EMPTYARRAY:E.empties.array,EMPTYOBJECT:E.empties.object,NOOP:E.empties.fn,STRINGIFY:E.stringify,PARSE:E.parse,HASH:E.hashCode,GUID:E.guid,SINGLETON:E.singleton,WARN:longs.warn,ADD:components.add,FN:E.arrowFn}),E.mixin(d,{MEDIAQUERY:domx.watchMedia,SCROLLBARWIDTH:domx.scrollbarWidth,WIDTH:domx.width,CSS:domx.style,STYLE:domx.style}),E.mixin(d,{EMIT:s.emit,OFF:s.off,ON:s.on}),E.mixin(d,{MAKEPARAMS:http.makeParams,UPLOAD:http.upload,IMPORTCACHE:http.importCache,IMPORT:http.import,UPTODATE:http.uptodate,PING:http.ping,READPARAMS:http.parseQuery,AJAXCONFIG:http.configure,AJAX:http.ajax,AJAXCACHE:http.ajaxCache,AJAXCACHEREVIEW:http.ajaxCacheReview}),E.mixin(d,{CLEARSCHEDULE:I.clear,SCHEDULE:I.schedule}),d.COOKIES=r,E.mixin(d,{CACHE:A.put,CLEARCACHE:A.clearCache,REMOVECACHE:A.remove}),E.mixin(d,{PLUGIN:T.register,PLUGINS:T.registry}),E.mixin(d,{COMPONENT:O.register,COMPONENT_EXTEND:O.extend,COMPONENT_CONFIG:O.configure,SKIP:O.skip}),E.mixin(d,{FIND:C.find,RESET:C.reset,LASTMODIFICATION:C.usage,USAGE:C.usage,VERSION:O.version}),E.mixin(d,{UNWATCH:m.unwatch,WATCH:m.watch,GET:m.getx,GETR:m.getr,SET:m.setx,SET2:m.setx2,SETR:m.setr,TOGGLE:m.toggle,TOGGLE2:m.toggle2,INC:m.inc,INC2:m.inc2,EXTEND:m.extend,EXTEND2:m.extend2,MODIFY:m.modify,MODIFIED:m.modified,PUSH:m.push,PUSH2:m.push2,UPDATE:m.update,UPDATE2:m.update2,BIND:m.bind,CACHEPATH:m.cache,CREATE:m.create,DEFAULT:m.defaultValue,ERRORS:m.errors,EVALUATE:parsers.evaluate,MAKE:m.make,REWRITE:m.rewrite,VALIDATE:m.validate}),E.mixin(d,{FIND:C.find,RESET:C.reset,LASTMODIFICATION:C.usage,USAGE:C.usage}),E.mixin(d,{BLOCKED:u.block}),d.COMPILE=function(e){return clearTimeout(N),u.compile(e)},d.RECOMPILE=function(){N&&clearTimeout(N),N=setTimeout(function(){COMPILE(),N=null},700)},d.FREE=function(e){return E.setTimeout2("$clean",cleaner,e||10),this},d.OPT=function(e,t){return E.isFunction(e)&&(t=e,e={}),t.call(e,function(t,i){return $set2(e,t,i)}),e},E.mixin(d,{VBIND:c.vbind,VBINDARRAY:c.vbindArray}),E.mixin(d,{PLUGINS:T.registry}),d});
//# sourceMappingURL=sourcemaps/globals.js.map