define([
	"./jc",
	"./defaults",
	"./utils/env",
	"./langx",
	"./utils/logs",
	"./topic",
	"./utils/cookies",
	"./utils/cache",
	"./plugins",
	"./components",
	"./binding",
	"./views"
],function(jc, defaults, env,langx,logs,topic,cookies,caches,storages,transforms,plugins,Component,binders,views,compiler,schedulers,paths){

	var M = jc,
		W = Window;


	//jc
	langx.each({
		"isPRIVATEMODE" : "isPRIVATEMODE",
		"isMOBILE" : "isMOBILE",
		"isROBOT" : "isROBOT",
		"isSTANDALONE" : "isSTANDALONE",
		"isTOUCH" : "isTOUCH",
		"MONTHS" : "months",
		"DAYS" : "days"
	},function(name1,name2){
		Object.defineProperty(this, name1, {
		    get() {
		      return jc[name2];
		    },
		    set(value) {
		    	jc[name2] = value;
		    }
		});	
	});


    // defaults
	W.DEF = defaults;

	// env 
	W.ENV = env;

	// langx
	langx.mixin(W,{
		clearTimeout2: langx.clearTimeout2,
		setTimeout2 : langx.setTimeout2,
		WAIT : langx.wait,

		COPY : langx.copy,
		CLONE: langx.clone,
		EMPTYARRAY : langx.empties.array,
		EMPTYOBJECT : langx.empties.object,
		NOOP : langx.empties.fn,

		STRINGIFY: langx.stringify,
		PARSE: langx.parse,
		HASH: langx.hashCode,
		GUID: langx.guid,
		SINGLETON: langx.singleton,

		WARN : longs.warn,

		ADD : components.add,
		

		FN : langx.arrowFn
	});

	//domx
	langx.mixin(W,{
		MEDIAQUERY : domx.watchMedia,
		SCROLLBARWIDTH : domx.scrollbarWidth,
		WIDTH : domx.width,
		CSS : domx.style,
		STYLE: domx.style
	});

	// topic
	langx.mixin(W,{
		EMIT: topic.emit,
		OFF: topic.off,
		ON: topic.on
	});


	// http
	langx.mixin(W,{
		MAKEPARAMS: http.makeParams,
		UPLOAD: http.upload,
		IMPORTCACHE: http.importCache,
		IMPORT: http.import,
		UPTODATE: http.uptodate,
		PING: http.ping,
		READPARAMS: http.parseQuery,
		AJAXCONFIG: http.configure,
		AJAX: http.ajax,
		AJAXCACHE: http.ajaxCache,
		AJAXCACHEREVIEW: http.ajaxCacheReview
	});

	// schedulers
	langx.mixin(W,{
		CLEARSCHEDULE : schedulers.clear,
		SCHEDULE : schedulers.schedule		

	});

	// cookies
	W.COOKIES = cookies;

	// storages
	langx.mixin(W,{
		CACHE : storages.put,
		CLEARCACHE : storages.clearCache,
		REMOVECACHE : storages.remove
	});


	//W.SCHEMA = function(name, declaration) {
	//	return M.schema(name, declaration);
	//};

	// plugins
	langx.mixin(W,{
		PLUGIN : plugins.register,
		PLUGINS : plugins.registry
	});

	// Component
	langx.mixin(W,{
		COMPONENT: Component.register,
		COMPONENT_EXTEND : Component.extend,
		COMPONENT_CONFIG : Component.configure,
		SKIP : Component.skip
	});

	// views
	langx.mixin(W,{
		FIND: views.find,
		RESET: views.reset,
		LASTMODIFICATION: views.usage,
		USAGE : views.usage,
		VERSION: Component.version,
	});

	//paths
	langx.mixin(W,{
		UNWATCH : paths.unwatch,
		WATCH : paths.watch,

		GET: paths.getx,
		GETR: paths.getr,

		SET: paths.setx,
		SET2: paths.setx2,
		SETR: paths.setr,

		TOGGLE: paths.toggle,
		TOGGLE2: paths.toggle2,

		INC: paths.inc,
		INC2: paths.inc2,

		EXTEND: paths.extend,
		EXTEND2: paths.extend2,

		MODIFY: paths.modify,
		MODIFIED : paths.modified,

		PUSH : paths.push,
		PUSH2 : paths.push2,

		UPDATE : paths.update,
		UPDATE2 : paths.update2,

		BIND: paths.bind,
		CACHEPATH : paths.cache,
		CREATE: paths.create,
		DEFAULT : paths.defaultValue,
		ERRORS : paths.errors,
		EVALUATE : parsers.evaluate,
		MAKE: paths.make,
		REWRITE : paths.rewrite,
		VALIDATE : paths.validate
	});



	// views
	langx.mixin(W,{
		FIND: views.find,
		RESET: views.reset,
		LASTMODIFICATION: views.usage,
		USAGE : views.usage,
	});

	// compiler
	langx.mixin(W,{
		BLOCKED : compiler.block
	});

	W.COMPILE = function(container) {
		clearTimeout($recompile);
		return compiler.compile(container);
	};

	var $recompile;

	W.RECOMPILE = function () { 
		$recompile && clearTimeout($recompile);
		$recompile = setTimeout(function() {
			COMPILE();
			$recompile = null;
		}, 700);
	};

	W.FREE = function(timeout) {
		langx.setTimeout2('$clean', cleaner, timeout || 10);
		return this;
	};


   /**
    * creates an object with more readable properties.
    * @param  {String} obj  
    * @param  {Function} fn A maker
    */
	W.OPT = function(obj, fn) {
		if (langx.isFunction(obj)) {
			fn = obj;
			obj = {};
		}
		fn.call(obj, function(path, value) {
			return $set2(obj, path, value);
		});
		return obj;
	};

	//- binders

	langx.mixin(W,{
		VBIND : binders.vbind,
		VBINDARRAY: binders.vbindArray
	});

//-----------------
	//plugins

	langx.mixin(W,{
		PLUGINS : plugins.registry
	});




	return W;
})