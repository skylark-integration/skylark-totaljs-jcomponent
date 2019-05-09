define([
	"./jc",
	"./langx",
	"./utils",
	"./plugins",
	"./components",
	"./binding",
	"./stores",
	"./views",
	"./others/schedulers",
	"./others/transforms"
],function(jc, langx,utils,plugins,components,binding,stores,views, schedulers, transforms){
	var $ = utils.query,
	    blocks = utils.blocks,
		cache = utils.cache,
		cookies = utils.cookies,
		domx = utils.domx;
		envs = utils.envs,
		http = utils.http,
		localStorage = utils.localStorage,
		logs = utils.logs;
		W = window,
		inited = false; 

	function init() {
		if (inited) {
			return W;
		}

		$.fn.scope = function() {

			if (!this.length) {
				return null; 
			}

			var data = this[0].$scopedata;
			if (data) {
				return data;
			}
			var el = this.closest('[' + ATTRSCOPE + ']');
			if (el.length) {
				data = el[0].$scopedata;
				if (data) {
					return data;
				}
			}
			return null;
		};	

		$.fn.vbindarray = function() {
			return domx.findinstance(this, '$vbindarray');
		};

		$.fn.vbind = function() {
			return domx.findinstance(this, '$vbind');
		};
		

		var gv = new views.View(document.body,{
				store : new stores.Store({
								data : W
							})
			}),
			gs = gv.storing,
			gh = gv.helper,
			gm = gv.componenter,
			gl = gv.compiler,
			ge = gv.eventer;

		gv.start();
		$.components = gv.components;

		langx.mixin(W, {
			isPRIVATEMODE : false,
			isMOBILE : /Mobi/.test(navigator.userAgent),
			isROBOT : navigator.userAgent ? (/search|agent|bot|crawler|spider/i).test(navigator.userAgent) : true,
			isSTANDALONE : navigator.standalone || window.matchMedia('(display-mode: standalone)').matches,
			isTOUCH : !!('ontouchstart' in window || navigator.maxTouchPoints)
		}); // W.MAIN = W.M = W.jC = W.COM = M = {};

		//jc
		/*
		langx.each({
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
		*/

		// langx
		langx.mixin(W,{
			AJAXCONFIG: http.configure,
			AJAX: http.ajax,
			AJAXCACHE: http.ajaxCache,
			AJAXCACHEREVIEW: http.ajaxCacheReview,

			clearTimeout2: langx.clearTimeout2,
			CACHE : cache,
			CLEARCACHE : cache.clear,
			CLEARSCHEDULE : schedulers.clear,
			CLONE: langx.clone,
			ENV: envs.variant,
			COOKIES : cookies,
			COPY : langx.copy,
			CSS : domx.style,

			DEF : {},

			EMPTYARRAY : langx.empties.array,
			EMPTYOBJECT : langx.empties.object,

			GUID: langx.guid,
			HASH: langx.hashCode,

			LCOMPARER : langx.localCompare,
			IMPORTCACHE: http.importCache,
			IMPORT: http.import,

			MAKEPARAMS: http.makeParams,
			MEDIAQUERY : domx.watchMedia,

			NOOP : langx.empties.fn,

			PING: http.ping,

			READPARAMS: http.parseQuery,
			REMOVECACHE : cache.remove,

			PARSE: langx.parse,

			setTimeout2 : langx.setTimeout2,
			SCHEDULE : schedulers.schedule,	
			SCROLLBARWIDTH : domx.scrollbarWidth,
			SINGLETON: langx.singleton,
			STRINGIFY: langx.stringify,
			STYLE: domx.style,

			UPLOAD: http.upload,
			UPTODATE: http.uptodate,

			WAIT : langx.wait,

			WARN : logs.warn,

			WIDTH : domx.mediaWidth,
			

			FN : langx.arrowFn
		});



		//W.SCHEMA = function(name, declaration) {
		//	return M.schema(name, declaration);
		//};

		// plugins
		langx.mixin(W,{
			PLUGIN : plugins.register,
			PLUGINS : plugins.registry
		});

		W.ADD = gv.add;

		W.BIND = function(path) {
			return gs.bind(path);
		};

		W.BLOCKED  = blocks.blocked;
		
		W.CACHEPATH = function (path, expire, rebind) { 
			return gs.cache(path, expire, rebind) ;
		};

		W.CHANGE = function (path, value) {
			return gs.change(path.value);
		};

		W.CHANGED = function(path) {
			return gs.change(path);
		};

		W.COMPILE = function(container) {
			clearTimeout($recompile);
			return gl.compile(container);
		};

		W.COMPONENT = components.register;

		W.COMPONENT_CONFIG = components.configer;

		W.COMPONENT_EXTEND = components.extend;

		W.CREATE = function(path) {
			return gs.create(path);
		}


	   /**
	   * Sets default values for all declared components listen on the path.
	   * All components need to have declared data-jc-value="VALUE" attribute. 
	   * @param  {String} path 
	   * @param  {Number} delay Optional, default: 0 
	   * @param  {Boolean} reset Optional, default: true
	   */
		W.DEFAULT = function (path, timeout, reset) { //
			var arr = path.split(/_{2,}/);
			if (arr.length > 1) {
				var def = arr[1];
				path = arr[0];
				var index = path.indexOf('.*');
				if (index !== -1)　{
					path = path.substring(0, index);
				}
				SET(path, new Function('return ' + def)(), timeout > 10 ? timeout : 3, timeout > 10 ? 3 : null);
			}
			return gs.default(arr[0], timeout, null, reset);
		}

		W.EMIT = function(name) {
			return ge.emit.apply(gs,arguments);
		};

		W.ERRORS =	function errors(path, except, highlight) { // 
			return gs.errors(path,except,highlight);
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
				return gs.extend(path, value, timeout);
			}
			if (!timeout || timeout < 10 || t !== 'number') {
				return gs.extend(path, value, timeout);
			}
			setTimeout(function() {
				gs.extend(path, value, reset);
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

		W.EVALUATE = function (path, expression, nopath) { 
			return gs.evaluate(path, expression, nopath);
		};


		W.FIND = function (value, many, noCache, callback) {  
			return gm.find(value, many, noCache, callback);
		};

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
			return gs.get(path, scope); 
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
				return gs.inc(path, value, timeout);
			}
			if (!timeout || timeout < 10 || t !== 'number') {
				return gs.inc(path, value, timeout);
			}
			setTimeout(function() {
				gs.inc(path, value, reset);
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
		};	

		W.LASTMODIFICATION = W.USAGE = function (name, expire, path, callback) {
			return gm.usage(name,expire,path,callback);
		};

		W.MAKE = function (obj, fn, update) {
			return gs.make(obj,fn,update);
		};

		W.MODIFIED = function(path) {
			return gs.modified(path);
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
			gs.modify(path,value,timeout);
			return W;
		};

		W.NOTIFY = function() {
			gm.notify.apply(gm,arguments);
			return W;
		};

		W.OFF = function(name, path, fn) {
			return ge.off(name,path,fn);
		};	

		W.ON = function(name, path, fn, init, context) {
			return ge.on(name,path,fn,init,context);
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
				return gs.set2(obj, path, value);
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
				return gs.push(path, value, timeout);
			}
			if (!timeout || timeout < 10 || t !== 'number') {
				return gs.push(path, value, timeout);
			}
			setTimeout(function() {
				gs.push(path, value, reset);
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

		W.RESET = function(path, timeout, onlyComponent) {
			return gs.reset(path,timeout,onlyComponent);
		};

		W.REWRITE =	function (path, value, type) {
			return gs.rewrite(path,value,type);
		};

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
				return gs.setx(path, value, timeout);
			}
			if (!timeout || timeout < 10 || t !== 'number') {
				return gs.setx(path, value, timeout);
			}
			setTimeout(function() {
				gs.setx(path, value, reset);
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
			gs.setx(path, value, type);
			RESET(path); 
			return W;
		};


		W.SETTER = function () {  
			return gm.setter.apply(gm,arguments);
		};

		W.SKIP = function () { 
			return gs.skipInc.apply(gs,arguments);
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

		W.UNWATCH  = function (path, fn) { 
			return gs.unwatch(path, fn) ;
		};

		W.UPDATE = function (path, timeout, reset) {
			var t = typeof(timeout); 
			if (t === 'boolean') {
				return gs.update(path, timeout);
			}
			if (!timeout || timeout < 10 || t !== 'number') {
				return gs.update(path, reset, timeout);
			}
			setTimeout(function() {
				gs.update(path, reset);
			}, timeout);
		};

		W.UPDATE2 = function (path, type) {
			UPDATE(path, type);
			CHANGE(path); 
			return W; 
		};	

		W.UPTODATE =function uptodate(period, url, callback, condition) {   

			if (langx.isFunction(url)) {
				condition = callback;
				callback = url;
				url = '';
			}

			var dt = new Date().add(period);
			topic.on('knockknock', function() {
				if (dt > langx.now()) //W.NOW)
					return;
				if (!condition || !condition())
					return;
				var id = setTimeout(function() {
					var l = window.location;
					if (url)
						l.href = url.$env();
					else
						l.reload(true);
				}, 5000);
				callback && callback(id);
			});
		}


		W.VBIND = binding.vbind;

		W.VBINDARRAY = binding.vbindArray;

		W.VALIDATE = function(path, except) {
			return gm.validate(path,except);
		};

		W.VERSION = components.versions.set;

		W.WATCH	= function (path, fn, init) { // 
			return ge.watch(path, fn, init);
		};

		inited = true;
		return W;
	}

	return jc.globals = init;
})