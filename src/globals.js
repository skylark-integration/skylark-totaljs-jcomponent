define([
	"./jc",
	"./defaults",
	"./utils/env",
	"./langx",
	"./utils/logs",
	"./utils/cookies",
	"./utils/cache",
	"./plugins",
	"./components",
	"./binding",
	"./stores",
	"./views"
],function(jc, defaults, env,langx,logs,cookies,caches,plugins,Components,binding,stores,views){

	var M = jc,
		W = Window;

	var gs = new stores.Store({
		data : W
	});

	var gv = new views.View(document.body,{
		store : gs
	});

	var M = totaljs.jc = {
		isPRIVATEMODE : false,
		isMOBILE : /Mobi/.test(navigator.userAgent),
		isROBOT : navigator.userAgent ? (/search|agent|bot|crawler|spider/i).test(navigator.userAgent) : true,
		isSTANDALONE : navigator.standalone || window.matchMedia('(display-mode: standalone)').matches,
		isTOUCH : !!('ontouchstart' in window || navigator.maxTouchPoints)
	}; // W.MAIN = W.M = W.jC = W.COM = M = {};

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
		Object.defineProperty(W, name1, {
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
		WIDTH : domx.mediaWidth,
		CSS : domx.style,
		STYLE: domx.style
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


		MODIFY: paths.modify,
		MODIFIED : paths.modified,

		CACHEPATH : paths.cache,
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


//-----------------
	//plugins

	langx.mixin(W,{
		PLUGINS : plugins.registry
	});

	W.VBIND = binders.vbind,

	W.BLOCKED  = blocking.blocked;
	
	W.CLEARCACHE = function clearCache() { // 
		if (!M.isPRIVATEMODE) { // !W.isPRIVATEMODE
			var rem = localStorage.removeItem;
			var k = $localstorage; //M.$localstorage;
			rem(k); 
			rem(k + '.cache');
			rem(k + '.blocked');
		}
		return this;
	};

	W.CHANGE = function (path, value) {
		return gv.change(path.value);
	};

	W.CHANGED = function(path) {
		return gv.change(path);
	};

	W.COMPILE = function(container) {
		clearTimeout($recompile);
		return compiler.compile(container);
	};

	W.COMPONENT = components.register;

	W.COMPONENT_CONFIG = components.configer;

	W.COMPONENT_EXTEND = components.extend;

	W.CREATE = function(path) {
		return gv.create(path);
	}


   /**
   * Sets default values for all declared components listen on the path.
   * All components need to have declared data-jc-value="VALUE" attribute. 
   * @param  {String} path 
   * @param  {Number} delay Optional, default: 0 
   * @param  {Boolean} reset Optional, default: true
   */
	W.DEFAULT = function (path, timeout, reset) { //
		var arr = path.split(REGMETA);
		if (arr.length > 1) {
			var def = arr[1];
			path = arr[0];
			var index = path.indexOf('.*');
			if (index !== -1)　{
				path = path.substring(0, index);
			}
			SET(path, new Function('return ' + def)(), timeout > 10 ? timeout : 3, timeout > 10 ? 3 : null);
		}
		return gv.default(arr[0], timeout, null, reset);
	}

	W.EMIT = function(name) {
		return gv.pathing.emit.apply(gv.pathing,arguments);
	};

   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	W.EXTEND = function extend(path, value, timeout, reset) {
		var t = typeof(timeout);
		if (t === 'boolean') {
			return gv.extend(path, value, timeout);
		}
		if (!timeout || timeout < 10 || t !== 'number') {
			return gv.extend(path, value, timeout);
		}
		setTimeout(function() {
			gv.extend(path, value, reset);
		}, timeout);
		return W; 
	}

   /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	W.EXTEND2 = function (path, value, type) {
		W.EXTEND(path, value, type);
		CHANGE(path);
		return W;
	}


	W.FREE = function(timeout) {
		langx.setTimeout2('$clean', cleaner, timeout || 10);
		return W;
	};

   /**
   * Reads a value according to the path.
   * @param  {String} path 
   */
	W.GET = function (path, scope) {
		path = pathmaker(path);
		if (scope === true) {
			scope = null;
			RESET(path, true);
		}
		return gv.get(path, scope); 
	}

   /**
   * Reads value and resets all components according to the path.
   * @param  {String} path 
   */
	W.GETR = function getr(path) { 
		return GET(path, true);
	}

   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	W.INC = function (path, value, timeout, reset) {

		if (value == null) {
			value = 1;
		}

		var t = typeof(timeout);
		if (t === 'boolean') {
			return gv.inc(path, value, timeout);
		}
		if (!timeout || timeout < 10 || t !== 'number') {
			return gv.inc(path, value, timeout);
		}
		setTimeout(function() {
			gv.inc(path, value, reset);
		}, timeout);
		return W;
	}

  /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	W.INC2 = function (path, value, type) {
		INC(path, value, type);
		CHANGE(path);
		return W;
	}	

	W.MODIFIED = function(path) {
		return gv.modified(path);
	};

	W.NOTMODIFIED = function(path, value, fields) {

	};	

   /**
   * Performs SET() and CHANGE() together.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	W.MODIFY =function (path, value, timeout) {
		gv.modify(path,value,timeout);
		return W;
	};

	W.OFF = function(name, path, fn) {
		return gv.pathing.off(name,path,fn);
	};	

	W.ON = function(name, path, fn, init, context) {
		return gv.pathing.on(name,path,fn,init,context);
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
			return gv.set2(obj, path, value);
		});
		return obj;
	};


   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	W.PUSH =  function (path, value, timeout, reset) {
		var t = typeof(timeout);
		if (t === 'boolean') {
			return gv.push(path, value, timeout);
		}
		if (!timeout || timeout < 10 || t !== 'number') {
			return gv.push(path, value, timeout);
		}
		setTimeout(function() {
			gv.push(path, value, reset);
		}, timeout);
		return W;
	};

   /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	W.PUSH2 = function (path, value, type) {
		PUSH(path, value, type);
		CHANGE(path);
		return W;
	};


	var $recompile;

	W.RECOMPILE = function () { 
		$recompile && clearTimeout($recompile);
		$recompile = setTimeout(function() {
			COMPILE();
			$recompile = null;
		}, 700);
	};

	W.REMOVECACHE = cache.remove;

   /**
   * Sets a new value according to the path..
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} timeout  Optional, value > 10 will be used as delay
   * @param {Boolean} reset Optional  default: false
   */
	W.SET = function (path, value, timeout, reset) { 
		var t = typeof(timeout);
		if (t === 'boolean') {
			return gv.setx(path, value, timeout);
		}
		if (!timeout || timeout < 10 || t !== 'number') {
			return gv.setx(path, value, timeout);
		}
		setTimeout(function() {
			gv.setx(path, value, reset);
		}, timeout);
		return W;
	};

   /**
   * Sets a new value according to the path and performs CHANGE() for all components 
   * which are listening on the path.
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} type  Optional, value > 10 will be used as delay
   */
	W.SET2 = function (path, value, type) { 
		SET(path, value, type); 
		CHANGE(path);
		return W;
	};

   /**
   * Sets a new value according to the path and resets the state. 
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} type  Optional, value > 10 will be used as delay
   */
	W.SETR = function (path, value, type) {
		gv.setx(path, value, type);
		RESET(path); 
		return W;
	};

   /**
   * Performs toggle for the path. A value must be Boolean.
   * @param  {String} path 
   * @param  {String/Number} timeout  Optional, value > 10 will be used as delay
   * @param {Boolean} reset Optional  default: false
   */
	W.TOGGLE = function toggle(path, timeout, reset) { 
		var v = GET(path); 
		SET(path, !v, timeout, reset); 
		return W;
	};

   /**
   * Performs toggle for the path and performs CHANGE() for all components which are listening on the path.
   * A value must be Boolean.
   * @param  {String} path 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	W.TOGGLE2 = function (path, type) {
		TOGGLE(path, type);
		CHANGE(path);
		return W;
	};

	W.UPDATE = function (path, timeout, reset) {
		var t = typeof(timeout); 
		if (t === 'boolean') {
			return gv.update(path, timeout);
		}
		if (!timeout || timeout < 10 || t !== 'number') {
			return gv.update(path, reset, timeout);
		}
		setTimeout(function() {
			gv.update(path, reset);
		}, timeout);
	};

	W.UPDATE2 = function (path, type) {
		UPDATE(path, type);
		CHANGE(path); 
		return W; 
	};	

	W.VBINDARRAY = binding.vbindArray;

	return W;
})