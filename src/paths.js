define([
	"skylark-langx/langx",
	"./jc",
	"./caches",
	"./Component"
],function(langx, jc, caches, Component){

	//get... 

	function get(path, scope) {

		if (path == null) {
			return;
		}

		var code = path.charCodeAt(0);
		if (code === 37)　// % 
			path = 'jctmp.' + path.substring(1);

		var key = '=' + path;
		if (paths[key]) {
			return paths[key](scope || MD.scope);
		}

		if (path.indexOf('?') !== -1) {
			return;
		}

		var arr = parsepath(path);
		var builder = [];

		for (var i = 0, length = arr.length - 1; i < length; i++) {
			var item = arr[i];
			if (item.substring(0, 1) !== '[')
				item = '.' + item;
			builder.push('if(!w' + item + ')return');
		}

		var v = arr[arr.length - 1];
		if (v.substring(0, 1) !== '['){
			v = '.' + v;
		}

		var fn = (new Function('w', builder.join(';') + ';return w' + v));
		paths[key] = fn;
		return fn(scope || MD.scope);
	}

   /**
   * Evaluate String expression as JavaScript code.
   * @param  {String/Object} path Can be object if "path_is_real_value" is "true"
   * @param  {String} expression A condition.
   * @param  {Boolean} path_is_real_value Optional, default: false
   * @returns {Boolean}   
   */
	function evaluate(path, expression, nopath) { //W.EVALUATE = 

		var key = 'eval' + expression;
		var exp = caches.temp[key];
		var val = null;

		if (nopath) {
			val = path;
		} else {
			val = get(path);
		}

		if (exp) {
			return exp.call(val, val, path);
		}

		if (expression.indexOf('return') === -1) {
			expression = 'return ' + expression;
		}

		exp = new Function('value', 'path', expression);
		caches.temp[key] = exp;
		return exp.call(val, val, path);
	}


	var REGWILDCARD = /\.\*/;

	function pathmaker(path, clean) {

		if (!path) {
			return path;
		}

		var tmp = '';

		if (clean) {
			var index = path.indexOf(' ');
			if (index !== -1) {
				tmp = path.substring(index);
				path = path.substring(0, index);
			}
		}

		// temporary
		if (path.charCodeAt(0) === 37)  { // % 
			return 'jctmp.' + path.substring(1) + tmp;
		}
		
		if (path.charCodeAt(0) === 64) { // @
			// parent component.data()
			return path;
		}

		var index = path.indexOf('/');

		if (index === -1) {
			return path + tmp;
		}

		var p = path.substring(0, index);
		var rem = plugins.find(p); //W.PLUGINS[p];
		return ((rem ? ('PLUGINS.' + p) : (p + '_plugin_not_found')) + '.' + path.substring(index + 1)) + tmp;
	}

	function pathmakerw(path) {
		return pathmaker(path.replace(REGWILDCARD, ''));
	}
 
	function bind(path) { // W.BIND = 
		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++) {
				bind(path[i]);
			}
			return this; // 
		}
		path = pathmaker(path);
		if (!path) {
			return this;
		}
		var is = path.charCodeAt(0) === 33; // !
		if (is) {
			path = path.substring(1);
		}
		path = path.replace(REGWILDCARD, '');
		path && set(path, get(path), true);
	}

	
	// paths -> view model

	var REGPARAMS = /\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi;

	var skipproxy = ''
	var proxy = {};

	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================

	var MULTIPLE = ' + ';
	var REGISARR = /\[\d+\]$/;

	var paths = {}; // saved paths from get() and set()

	var binders = {};
	var bindersnew = [];

	function binderbind(path, absolutePath, ticks) {
		var arr = binders[path];
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if (item.ticks !== ticks) {
				item.ticks = ticks;
				item.exec(getx(item.path), absolutePath);  //GET
			}
		}
	}

	var $rebinder;

	function rebindbinder() {
		$rebinder && clearTimeout($rebinder);
		$rebinder = setTimeout(function() {
			var arr = bindersnew.splice(0);
			for (var i = 0; i < arr.length; i++) {
				var item = arr[i];
				if (!item.init) {
					if (item.com) {
						item.exec(item.com.data(item.path), item.path);
					} else {
						item.exec(getx(item.path), item.path);  // GET
					}
				}
			}
		}, 50);
	}

	var watches = [];

	function unwatch(path, fn) { //W.UNWATCH 

		if (path.indexOf(MULTIPLE) !== -1) {
			var arr = path.split(MULTIPLE).trim();
			for (var i = 0; i < arr.length; i++)
				unwatch(arr[i], fn);
			return this; //W;
		}

		return topic.off('watch', path, fn); //OFF
	};

	function watch(path, fn, init) { // W.WATCH

		if (path.indexOf(MULTIPLE) !== -1) {
			var arr = path.split(MULTIPLE).trim();
			for (var i = 0; i < arr.length; i++)
				watch(arr[i], fn, init);
			return this; //W;
		}

		if (langx.isFunction(path)) { //if (typeof(path) === TYPE_FN) {
			init = fn;
			fn = path;
			path = '*';
		}

		var push = '';

		if (path.substring(0, 1) === '^') {
			path = path.substring(1);
			push = '^';
		}

		path = pathmaker(path, true);
		topic.on(push + 'watch', path, fn, init);  // ON
		return this; //W;
	}

	function remap(path, value) {

		var index = path.replace('-->', '->').indexOf('->');

		if (index !== -1) {
			value = value[path.substring(0, index).trim()];
			path = path.substring(index + 3).trim();
		}

		immSetx(path, value);
	}

	function emitwatch(path, value, type) {
		for (var i = 0, length = watches.length; i < length; i++) {
			var self = watches[i];
			if (self.path === '*') {
				self.fn.call(self.context, path, self.format ? self.format(value, path, type) : value, type);
			} else if (path.length > self.path.length) {
				var index = path.lastIndexOf('.', self.path.length);
				if (index === -1 ? false : self.path === path.substring(0, index)) {
					var val = getx(self.path); // GET
					self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
				}
			} else {
				for (var j = 0, jl = self.$path.length; j < jl; j++) {
					if (self.$path[j] === path) {
						var val = get2(self.path);
						self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
						break;
					}
				}
			}
		}
	}



	Array.prototype.findValue = function(cb, value, path, def, cache) {

		if (langx.isFunction(cb)) {
			def = path;
			path = value;
			value = undefined;
			cache = false;
		}

		var key, val = def;

		if (cache) {
			key = 'fv_' + cb + '=' + value;
			if (caches.temp[key]) {
				return caches.temp[key];
			}
		}

		var index = this.findIndex(cb, value);
		if (index !== -1) {
			var item = this[index];
			if (path.indexOf('.') === -1) {
				item = item[path];
			} else {
				item = get(path, item);
			}
			cache && (caches.temp[key] = val);
			val = item == null ? def : item;
		}

		return val;
	};

	String.prototype.params = String.prototype.arg = function(obj) {
		return this.replace(REGPARAMS, function(text) {
			// Is double?
			var l = text.charCodeAt(1) === 123 ? 2 : 1;
			var val = get(text.substring(l, text.length - l).trim(), obj);
			return val == null ? text : val;
		});
	};

  /**
   * Reads a value according to the path.
   * @param  {String} path 
   */
	function getx(path, scope) { // W.GET = M.get
		path = pathmaker(path);
		if (scope === true) {
			scope = null;
			reset(path, true); // RESET
		}
		return get(path, scope); 
	}

  /**
   * Reads value and resets all components according to the path.
   * @param  {String} path 
   */
	function getr(path) {  //W.GETR =
		return getx(path, true); //GET
	}


	// set...
	function set(path, value, is) {

		if (path == null) {
			return;
		}

		var key = '+' + path;

		if (paths[key]) {
			return paths[key](MD.scope, value, path, binders, binderbind, is);
		}

		if (path.indexOf('?') !== -1) {
			path = '';
			return;
		}

		var arr = parsepath(path);
		var builder = [];
		var binder = [];

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			var type = arr[i + 1] ? (REGISARR.test(arr[i + 1]) ? '[]' : '{}') : '{}';
			var p = 'w' + (item.substring(0, 1) === '[' ? '' : '.') + item;
			builder.push('if(typeof(' + p + ')!==\'object\'||' + p + '==null)' + p + '=' + type);
		}

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			binder.push('binders[\'' + item + '\']&&binderbind(\'' + item + '\',\'' + path + '\',$ticks)');
		}

		var v = arr[arr.length - 1];
		binder.push('binders[\'' + v + '\']&&binderbind(\'' + v + '\',\'' + path + '\',$ticks)');
		binder.push('binders[\'!' + v + '\']&&binderbind(\'!' + v + '\',\'' + path + '\',$ticks)');

		if (v.substring(0, 1) !== '['){
			v = '.' + v;
		}

		var fn = (new Function('w', 'a', 'b', 'binders', 'binderbind', 'nobind', 'var $ticks=Math.random().toString().substring(2,8);if(!nobind){' + builder.join(';') + ';var v=typeof(a)==\'function\'?a(MAIN.compiler.get(b)):a;w' + v + '=v}' + binder.join(';') + ';return a'));
		paths[key] = fn;
		fn(MD.scope, value, path, binders, binderbind, is);
		return C;
	}

	function set2(scope, path, value) {

		if (path == null) {
			return;
		}

		var key = '++' + path;

		if (paths[key]) {
			return paths[key](scope, value, path);
		}

		var arr = parsepath(path);
		var builder = [];

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			var type = arr[i + 1] ? (REGISARR.test(arr[i + 1]) ? '[]' : '{}') : '{}';
			var p = 'w' + (item.substring(0, 1) === '[' ? '' : '.') + item;
			builder.push('if(typeof(' + p + ')!==\'object\'||' + p + '==null)' + p + '=' + type);
		}

		var v = arr[arr.length - 1];

		if (v.substring(0, 1) !== '[')
			v = '.' + v;

		var fn = (new Function('w', 'a', 'b', builder.join(';') + ';w' + v + '=a;return a'));
		paths[key] = fn;
		fn(scope, value, path);
		return scope;
	}

	// 1 === manually
	// 2 === by input
	// 3 === default
	function immSetx(path, value, type) {  // M.set

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++) 
				immSetx(path[i], value, type);
			return M;
		}

		path = pathmaker(path);

		if (!path) {
			return M;
		}

		var is = path.charCodeAt(0) === 33; // !
		if (is) {
			path = path.substring(1);
		}

		if (path.charCodeAt(0) === 43) { // +
			path = path.substring(1);
			return M.push(path, value, type);
		}

		if (!path) {
			return M;
		}

		var isUpdate = (typeof(value) === 'object' && !(value instanceof Array) && value != null);
		var reset = type === true;
		if (reset) {
			type = 1;
		}

		M.skipproxy = path;
		set(path, value);

		if (isUpdate) {
			return immUpdate(path, reset, type, true);
		}

		var result = get(path);
		var state = [];

		if (type === undefined) {
			type = 1;
		}

		var all = M.components.all;//M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.disabled || com.$removed || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (com.setter) {
				if (com.path === path) {
					if (com.setter) {
						com.setterX(result, path, type);
						com.$interaction(type);
					}
				} else {
					if (com.setter) {
						com.setterX(get(com.path), path, type);
						com.$interaction(type);
					}
				}
			}

			if (!com.$ready) {
				com.$ready = true;
			}

			type !== 3 && com.state && state.push(com);

			if (reset) {
				if (!com.$dirty_disabled)
					com.$dirty = true;
				if (!com.$valid_disabled) {
					com.$valid = true;
					com.$validate = false;
					if (com.validate) {
						com.$valid = com.validate(result);
						com.$interaction(102);
					}
				}

				findcontrol2(com);

			} else if (com.validate && !com.$valid_disabled) {
				com.valid(com.validate(result), true);
			}
		}

		if (reset) {
			caches.clear('dirty', 'valid');
		}

		for (var i = 0, length = state.length; i < length; i++) {
			state[i].stateX(type, 5);
		}

		emitwatch(path, result, type);
		return M;
	}

   /**
   * Sets a new value according to the path..
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} timeout  Optional, value > 10 will be used as delay
   * @param {Boolean} reset Optional  default: false
   */
	function setx(path, value, timeout, reset) {   // W.SET
		var t = typeof(timeout);
		if (t === 'boolean')
			return immSetx(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return immSetx(path, value, timeout);
		setTimeout(function() {
			immSetx(path, value, reset);
		}, timeout);
		return this; // W
	};

   /**
   * Sets a new value according to the path and performs CHANGE() for all components 
   * which are listening on the path.
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} type  Optional, value > 10 will be used as delay
   */
	function setx2(path, value, type) { //W.SET2 = 
		setx(path, value, type); // SET
		change(path);
		return this;
	};

   /**
   * Sets a new value according to the path and resets the state. 
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} type  Optional, value > 10 will be used as delay
   */
	function setr(path, value, type) { //  W.SETR
		immSetx(path, value, type);
		reset(path); // RESET
		return this;
	};

	//cache
	function cache(path, expire, rebind) { // W.CACHEPATH = 
		var key = '$jcpath';
		WATCH(path, function(p, value) {
			var obj = storages.get(key); // cachestorage(key);
			if (obj) {
				obj[path] = value;
			}else {
				obj = {};
				obj[path] = value;
			}
			storages.put(key, obj, expire); // cachestorage(key, obj, expire);
		});

		if (rebind === undefined || rebind) {
			var cache = storages.get(key); // cachestorage(key);
			if (cache && cache[path] !== undefined && cache[path] !== get(path)){
				immSetx(path, cache[path], true);	
			} 
		}
		return this; //W 
	};


	function parsepath(path) {

		var arr = path.split('.');
		var builder = [];
		var all = [];

		for (var i = 0; i < arr.length; i++) {
			var p = arr[i];
			var index = p.indexOf('[');
			if (index === -1) {
				if (p.indexOf('-') === -1) {
					all.push(p);
					builder.push(all.join('.'));
				} else {
					var a = all.splice(all.length - 1);
					all.push(a + '[\'' + p + '\']');
					builder.push(all.join('.'));
				}
			} else {
				if (p.indexOf('-') === -1) {
					all.push(p.substring(0, index));
					builder.push(all.join('.'));
					all.splice(all.length - 1);
					all.push(p);
					builder.push(all.join('.'));
				} else {
					all.push('[\'' + p.substring(0, index) + '\']');
					builder.push(all.join(''));
					all.push(p.substring(index));
					builder.push(all.join(''));
				}
			}
		}

		return builder;
	}
	
   /**
   * Creates a watcher for all changes.
   * @param  {String} path 
   */
	function create(path) { //W.CREATE

		var is = false;
		var callback;

		if (typeof(path) === TYPE_S) {
			if (proxy[path])
				return proxy[path];
			is = true;
			callback = function(key) {

				var p = path + (key ? '.' + key : '');
				if (M.skipproxy === p) {
					M.skipproxy = '';
					return;
				}
				setTimeout(function() {
					if (M.skipproxy === p)
						M.skipproxy = '';
					else {
						notify(p);  // NOTIFY
						reset(p);   // REEST
					}
				}, MD.delaybinder);
			};

		} else
			callback = path;

		var blocked = false;
		var obj = path ? (get2(path) || {}) : {};
		var handler = {
			get: function(target, property, receiver) {
				try {
					return new Proxy(target[property], handler);
				} catch (err) {
					return Reflect.get(target, property, receiver);
				}
			},
			defineProperty: function(target, property, descriptor) {
				!blocked && callback(property, descriptor);
				return Reflect.defineProperty(target, property, descriptor);
			},
			deleteProperty: function(target, property) {
				!blocked && callback(property);
				return Reflect.deleteProperty(target, property);
			},
			apply: function(target, thisArg, argumentsList) {
				if (BLACKLIST[target.name]) {
					blocked = true;
					var result = Reflect.apply(target, thisArg, argumentsList);
					callback('', argumentsList[0]);
					blocked = false;
					return result;
				}
				return Reflect.apply(target, thisArg, argumentsList);
			}
		};

		var o = new Proxy(obj, handler);

		if (is) {
			M.skipproxy = path;
			getx(path) == null && setx(path, obj, true);  // GET SET
			return proxy[path] = o;
		} else
			return o;
	};

   /**
   * Creates an object on the path and notifies all components
   * @param  {String} path 
   * @param  {Function} fn 
   * @param  {Boolean} update Optional Optional, default "true"
   */
	function make(obj, fn, update) { // W.MAKE

		switch (typeof(obj)) {
			case 'function':
				fn = obj;
				obj = {};
				break;
			case 'string':
				var p = obj;
				var is = true;
				obj = get(p);
				if (obj == null) {
					is = false;
					obj = {};
				}
				fn.call(obj, obj, p, function(path, value) {
					setx(obj, path, value);
				});
				if (is && (update === undefined || update === true))
					immUpdate(p, true);
				else {
					if (C.ready)
						$set(p, obj);
					else
						immSetx(p, obj, true);
				}
				return obj;
		}

		fn.call(obj, obj, '');
		return obj;
	};

  /**
   * Notifies a setter in all components on the path.
   * @param  {String} path 
   */
	function notify() { // W.NOTIFY

		var arg = arguments;
		var all = M.components.all;//M.components;

		var $ticks = Math.random().toString().substring(2, 8);
		for (var j = 0; j < arg.length; j++) {
			var p = arg[j];
			binders[p] && binderbind(p, p, $ticks);
		}

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path)
				continue;

			var is = 0;
			for (var j = 0; j < arg.length; j++) {
				if (com.path === arg[j]) {
					is = 1;
					break;
				}
			}

			if (is) {
				var val = com.get();
				com.setter && com.setterX(val, com.path, 1);
				com.state && com.stateX(1, 6);
				com.$interaction(1);
			}
		}

		for (var j = 0; j < arg.length; j++) {
			emitwatch(arg[j], getx(arg[j]), 1);  // GET
		}

		return this;  // W
	};

	function validate(path, except) { //W.VALIDATE =

		var arr = [];
		var valid = true;

		path = pathmakerw(path); //pathmaker(path.replace(REGWILDCARD, ''));

		var flags = null;
		if (except) {
			var is = false;
			flags = {};
			except = except.remove(function(item) {
				if (item.substring(0, 1) === '@') {
					flags[item.substring(1)] = true;
					is = true;
					return true;
				}
				return false;
			});
			!is && (flags = null);
			!except.length && (except = null);
		}

		var all = M.components.all;//M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			com.state && arr.push(com);

			if (com.$valid_disabled)
				continue;

			com.$validate = true;
			if (com.validate) {
				com.$valid = com.validate(get(com.path));
				com.$interaction(102);
				if (!com.$valid)
					valid = false;
			}
		}

		clear('valid');
		state(arr, 1, 1);
		return valid;
	}

   /**
   * Sets default values for all declared components listen on the path.
   * All components need to have declared data-jc-value="VALUE" attribute. 
   * @param  {String} path 
   * @param  {Number} delay Optional, default: 0 
   * @param  {Boolean} reset Optional, default: true
   */
	function defaultValue(path, timeout, reset) { //W.DEFAULT = 
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
		return M.default(arr[0], timeout, null, reset);
	}


	var nmCache = {};  // notmodified cache 

   /**
   * Checks whether the value has not been modified on the path.
   * @param  {String} path 
   * @param {Object} value  Optional
   * @param {Array<String>} fields  Optional, field names
   * @returns {Booean}   
   */
	function notmodified(path, value, fields) { // W.NOTMODIFIED = 

		if (value === undefined) {
			value = get(path);
		}

		if (value === undefined) {
			value = null;
		}

		if (fields) {
			path = path.concat('#', fields);
		}

		var s = langx.stringify(value, false, fields); // STRINGIFY
		var hash = langx.hashCode(s); // HASH
		var key =  path; // 'notmodified.' + path

		if (nmCache[key] === hash) { // cache
			return true;
		}

		nmCache[key] = hash; //cache 
		return false;
	};



	function rewrite(path, value, type) { // W.REWRITE = 
		path = pathmaker(path);
		if (path) {
			M.skipproxy = path;
			set(path, value);
			emitwatch(path, value, type);
		}
		return this; // W
	}


   /**
   * Performs SET() and CHANGE() together.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	function modify(path, value, timeout) { // W.MODIFY =
		if (path && typeof(path) === TYPE_O) {
			Object.keys(path).forEach(function(k) {
				modify(k, path[k], value);
			});
		} else {
			if (langx.isFunction(value)) {
				value = value(get2(path));
			}
			setx(path, value, timeout); // SET
			if (timeout) {
				langx.setTimeout(change, timeout + 5, path);
			} else {
				change(path);
			}
		}
		return this;
	};


   /**
   * Performs toggle for the path. A value must be Boolean.
   * @param  {String} path 
   * @param  {String/Number} timeout  Optional, value > 10 will be used as delay
   * @param {Boolean} reset Optional  default: false
   */
	function toggle(path, timeout, reset) { // W.TOGGLE = 
		var v = getx(path);  // GET
		setx(path, !v, timeout, reset); // SET
		return this;
	};

   /**
   * Performs toggle for the path and performs CHANGE() for all components which are listening on the path.
   * A value must be Boolean.
   * @param  {String} path 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	function toogle2(path, type) { //W.TOGGLE2 = 
		toogle(path, type);
		change(path);
		return this;
	};

	// inc.. 
	function immInc(path, value, type) {  // M.inc

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++)
				immInc(path[i], value, type);
			return this; // M
		}

		path = pathmaker(path);

		if (!path)
			return this; // M

		var current = get(path);
		if (!current) {
			current = 0;
		} else if (typeof(current) !== TYPE_N) {
			current = parseFloat(current);
			if (isNaN(current))
				current = 0;
		}

		current += value;
		immSetx(path, current, type);
		return this; // M
	}

   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	function inc(path, value, timeout, reset) { // W.INC = 

		if (value == null)
			value = 1;

		var t = typeof(timeout);
		if (t === 'boolean')
			return immInc(path, value, timeout);
		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return immInc(path, value, timeout);
		setTimeout(function() {
			immInc(path, value, reset);
		}, timeout);
		return W;
	};

  /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	 function inc2(path, value, type) {  // W.INC2 = 
		inc(path, value, type);
		change(path);
		return this;
	};

	// extend...
	function immExtend(path, value, type) { // M.extend
		path = pathmaker(path);
		if (path) {
			var val = get(path);
			if (val == null)
				val = {};
			immSetx(path, $.extend(val, value), type);
		}
		return this; // M
	}

   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	function extend(path, value, timeout, reset) { // W.EXTEND = 
		var t = typeof(timeout);
		if (t === 'boolean')
			return immExtend(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return immExtend(path, value, timeout);
		setTimeout(function() {
			immExtend(path, value, reset);
		}, timeout);
		return this; // W
	};

   /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	function extend2(path, value, type) { // W.EXTEND2 = 
		extend(path, value, type); // W.EXTEND
		change(path);
		return this;
	};

	function immPush(path, value, type) { // M.push

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++) {
				immPush(path[i], value, type);
			}
			return this; // M
		}

		var arr = get(path);
		var n = false;

		if (!(arr instanceof Array)) {
			arr = [];
			n = true;
		}

		var is = true;
		M.skipproxy = path;

		if (value instanceof Array) {
			if (value.length)
				arr.push.apply(arr, value);
			else {
				is = false;
			}
		} else {
			arr.push(value);
		}

		if (n) {
			immSetx(path, arr, type);
		} else if (is) {
			immUpdate(path, undefined, type);
		}

		return this; // M
	}

   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	function push(path, value, timeout, reset) {  // W.PUSH = 
		var t = typeof(timeout);
		if (t === 'boolean')
			return M.push(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return M.push(path, value, timeout);
		setTimeout(function() {
			M.push(path, value, reset);
		}, timeout);
		return this; // W
	};

   /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	function push2(path, value, type) { // W.PUSH2 = 
		push(path, value, type);
		change(path);
		return this; // W
	};

	// 1 === manually
	// 2 === by input
	function immUpdate(path, reset, type, wasset) { // M.update = 

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++)
				immUpdate(path[i], reset, type);
			return M;
		}

		path = pathmaker(path);
		if (!path)
			return M;

		var is = path.charCodeAt(0) === 33;
		if (is)
			path = path.substring(1);

		path = path.replace(REGWILDCARD, '');
		if (!path)
			return M;

		!wasset && $set(path, $get(path), true);

		var state = [];

		if (type === undefined) {
			type = 1; // manually
		}

		M.skipproxy = path;

		var all = M.components.all;//M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.disabled || com.$removed || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			var result = com.get();
			if (com.setter) {
				com.$skip = false;
				com.setterX(result, path, type);
				com.$interaction(type);
			}

			if (!com.$ready)
				com.$ready = true;

			if (reset === true) {

				if (!com.$dirty_disabled) {
					com.$dirty = true;
					com.$interaction(101);
				}

				if (!com.$valid_disabled) {
					com.$valid = true;
					com.$validate = false;
					if (com.validate) {
						com.$valid = com.validate(result);
						com.$interaction(102);
					}
				}

				findcontrol2(com);

			} else if (com.validate && !com.$valid_disabled)
				com.valid(com.validate(result), true);

			com.state && state.push(com);
		}

		reset && clear('dirty', 'valid');

		for (var i = 0, length = state.length; i < length; i++)
			state[i].stateX(1, 4);

		emitwatch(path, get(path), type);
		return M;
	}


	function update(path, timeout, reset) { // W.UPDATE
		var t = typeof(timeout); 
		if (t === 'boolean')
			return immUpdate(path, timeout);
		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return immUpdate(path, reset, timeout);
		setTimeout(function() {
			immUpdate(path, reset);
		}, timeout);
	};

	function update2(path, type) { //W.UPDATE2 = 
		update(path, type); // W.UPDATE
		W.CHANGE(path); 
		return this; // W
	};	

	// ===============================================================
	// MAIN FUNCTIONS
	// ===============================================================

   /**
   * Evaluates a global parser.
   * @param  {String} path 
   * @param  {Object} value
   * @param  {String} type 
   * @returns {Boolean}   
   * OR
   * Registers a global parser.
   * @param  {Function} value 
   */
	function parser(value, path, type) { //W.PARSER = M.parser =  

		if (langx.isFunction(value)) {
			!jc.$parser && (jc.$parser = []);

			// Prepend
			if (path === true) {
				jc.$parser.unshift(value);
			} else {
				jc.$parser.push(value);
			}

			return this;
		}

		var a = jc.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(M, path, value, type);
			}
		}

		return value;
	};


	jc.$parser.push(function(path, value, type) {

		switch (type) {
			case 'number':
			case 'currency':
			case 'float':
				var v = +(langx.isString(value) ? value.replace(REGEMPTY, '').replace(REGCOMMA, '.') : value);
				return isNaN(v) ? null : v;

			case 'date':
			case 'datetime':

				if (!value) {
					return null;
				}

				if (value instanceof Date) {
					return value;
				}

				value = value.parseDate();
				return value && value.getTime() ? value : null;
		}

		return value;
	});


	setInterval(function() {
//		temp = {};
		paths = {};
//		cleaner();
	}, (1000 * 60) * 5);	

	return jc.paths = {
		Scope,
		unwatch : unwatch,
		watch : watch,

		get,
		getx,
		getr,

		set,
		set2,
		immSetx,
		setx,
		setx2,
		setr,

		toggle,
		toogle2,

		cache,

		immInc,
		inc,
		inc2,

		immExtend,
		extend,
		extend2,

		immPush,
		push,
		push2,

		immUpdate,
		update,
		update2,

		bind,
		create,
		defaultValue,
		errors,
		make,
		evaluate,
		make,
		modified,
//		notmodified,
		pathmaker,
		rewrite,
		validate
	};
});