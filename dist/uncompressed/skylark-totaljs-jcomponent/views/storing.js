define([
	"../langx",
	"../utils/storage",
	"../binding/pathmaker"
],function(langx,storage,pathmaker){
	var	SELINPUT = 'input,textarea,select';
	var BLACKLIST = { sort: 1, reverse: 1, splice: 1, slice: 1, pop: 1, unshift: 1, shift: 1, push: 1 };
	
	var REGISARR = /\[\d+\]$/;
	
	function storing (view) {

		var skipproxy = '';

		var eventer = view.eventer,
			binding = view.binding,
			helper = view.helper,
			cache = view.cache;

		var store = view.option("store");

		function remap(path, value) {

			var index = path.replace('-->', '->').indexOf('->');

			if (index !== -1) {
				value = value[path.substring(0, index).trim()];
				path = path.substring(index + 3).trim();
			}

			setx(path, value);
		}


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

		var paths = {},
			defaults = {},
			$formatter = [],
			skips = {};
			$parser = [],
			nmCache = {},  // notmodified cache 
			temp = {};


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
			path = path.replaceWildcard();
			if(path){
				set(path, get(path), true);	
			} 
		}


	   /**
	   * Creates a watcher for all changes.
	   * @param  {String} path 
	   */
		function create(path) { //W.CREATE

			var is = false;
			var callback;

			if (langx.isString(path)) {
				if (proxy[path]) {
					return proxy[path];
				}
				is = true;
				callback = function(key) {

					var p = path + (key ? '.' + key : '');
					if (skipproxy === p) {
						skipproxy = '';
						return;
					}
					setTimeout(function() {
						if (skipproxy === p) {
							skipproxy = '';
						} else {
							notify(p);  // NOTIFY
							reset(p);   // REEST
						}
					}, MD.delaybinder);
				};

			} else {
				callback = path;
			}

			var blocked = false;
			var obj = path ? (get(path) || {}) : {}; // GET
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
				skipproxy = path;
				get(path) == null && setx(path, obj, true);  // GET SET
				return proxy[path] = o;
			} else
				return o;
		}


	 	//cache
		function cachePath(path, expire, rebind) { // W.CACHEPATH = 
			var key = '$jcpath';
			WATCH(path, function(p, value) {
				var obj = storage(key); // cachestorage(key);
				if (obj) {
					obj[path] = value;
				}else {
					obj = {};
					obj[path] = value;
				}
				storage(key, obj, expire); // cachestorage(key, obj, expire);
			});

			if (rebind === undefined || rebind) {
				var cache = storage(key); // cachestorage(key);
				if (cache && cache[path] !== undefined && cache[path] !== get(path)){
					setx(path, cache[path], true);	
				} 
			}
			return this; //W 
		};


	   /**
	   * Evaluates a global formatter.
	   * @param  {String} path 
	   * @param  {Object} value
	   * @param  {String} type 
	   * @returns {Boolean}   
	   * OR
	   * Registers a global formatter.
	   * @param  {Function} value 
	   * @param  {Boolean} path 
	   */
		function format(value, path, type) {  // W.FORMATTER = M.formatter =

			if (langx.isFunction(value)) {
				// Prepend
				if (path === true) {
					$formatter.unshift(value);
				} else {
					$formatter.push(value);
				}

				return this;  //M
			}

			var a = $formatter;
			if (a && a.length) {
				for (var i = 0, length = a.length; i < length; i++) {
					var val = a[i].call(M, path, value, type);
					if (val !== undefined)
						value = val;
				}
			}

			return value;
		};

		//get... 

		function get(path, scope) {

			if (path == null) {
				return;
			}

			var code = path.charCodeAt(0);
			if (code === 37)　{  // % 
				path = 'jctmp.' + path.substring(1);
			}

			var key = '=' + path;
			if (paths[key]) {
				return paths[key](scope || store.data);
			}

			if (path.indexOf('?') !== -1) {
				return;
			}

			var arr = parsepath(path);
			var builder = [];

			for (var i = 0, length = arr.length - 1; i < length; i++) {
				var item = arr[i];
				if (item.substring(0, 1) !== '[') {
					item = '.' + item;
				}
				builder.push('if(!w' + item + ')return');
			}

			var v = arr[arr.length - 1];
			if (v.substring(0, 1) !== '['){
				v = '.' + v;
			}

			var fn = (new Function('w', builder.join(';') + ';return w' + v));
			paths[key] = fn;
			return fn(scope || store.data);  // MD.scope
		}

		// set...
		function set(path, value, is) {

			if (path == null) {
				return;
			}

			var key = '+' + path;

			if (paths[key]) {
				return paths[key](store.data, value, path, binding.binders, binding.binderbind, is); // MD.scope
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
			fn(store.data, value, path, binding.binders, binding.binderbind, is); // MD.scope

			return this; //C
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

			if (v.substring(0, 1) !== '[') {
				v = '.' + v;
			}

			var fn = (new Function('w', 'a', 'b', builder.join(';') + ';w' + v + '=a;return a'));
			paths[key] = fn;
			fn(scope, value, path);
			return scope;
		}

		// 1 === manually
		// 2 === by input
		// 3 === default
		function setx(path, value, type) {  // M.set

			if (path instanceof Array) {
				for (var i = 0; i < path.length; i++) 
					setx(path[i], value, type);
				return this; // M
			}

			path = pathmaker(path);

			if (!path) {
				return this; // M
			}

			var is = path.charCodeAt(0) === 33; // !
			if (is) {
				path = path.substring(1);
			}

			if (path.charCodeAt(0) === 43) { // +
				path = path.substring(1);
				return push(path, value, type);
			}

			if (!path) {
				return this; // M
			}

			var isUpdate = (typeof(value) === 'object' && !(value instanceof Array) && value != null);
			var reset = type === true;
			if (reset) {
				type = 1;
			}

			skipproxy = path;
			set(path, value);

			if (isUpdate) {
				return update(path, reset, type, true);
			}

			var result = get(path);
			var state = [];

			if (type === undefined) {
				type = 1;
			}

			var all = view.componenter.components;//M.components;

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

					helper.findControl2(com);

				} else if (com.validate && !com.$valid_disabled) {
					com.valid(com.validate(result), true);
				}
			}

			if (reset) {
				cache.clear('dirty', 'valid');
			}

			for (var i = 0, length = state.length; i < length; i++) {
				state[i].stateX(type, 5);
			}

			eventer.emitwatch(path, result, type);
			return this; // M;
		}

		function defaultValue(path, timeout, onlyComponent, reset) { //M.default = 

			if (timeout > 0) {
				setTimeout(function() {
					defaultValue(path, 0, onlyComponent, reset);
				}, timeout);
				return this;
			}

			if (typeof(onlyComponent) === 'boolean') {
				reset = onlyComponent;
				onlyComponent = null;
			}

			if (reset === undefined) {
				reset = true;
			}

			path = pathmaker(path.replaceWildcard()); //pathmaker(path.replace(REGWILDCARD, ''));

			// Reset scope
			var key = path.replace(/\.\*$/, '');
			var fn = defaults['#' + langx.hashCode(key)]; // HASH
			var tmp;

			if (fn) {
				tmp = fn();
				set(key, tmp);
			}

			var arr = [];
			var all = view.componenter.components;//M.components;

			for (var i = 0, length = all.length; i < length; i++) {
				var com = all[i];

				if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path)) {
					continue;
				}

				if (com.state) {
					arr.push(com);
				}

				if (onlyComponent && onlyComponent._id !== com._id) {
					continue;
				}

				if (com.$default) {
				 com.set(com.$default(), 3);
				}

				if (!reset) {
					return;
				}

				helper.findControl2(com);

				if (!com.$dirty_disabled) {
					com.$dirty = true;
				}
				if (!com.$valid_disabled) {
					com.$valid = true;
					com.$validate = false;
					if (com.validate) {
						com.$valid = com.validate(com.get());
						com.$interaction(102);
					}
				}
			}

			if (reset) {
				cache.clearPageData('valid', 'dirty');
				view.componenter.state(arr, 3, 3);
			}

			return this;
		}


		// 1 === manually
		// 2 === by input
		function update(path, reset, type, wasset) { // M.update =  // immUpdate
			if (path instanceof Array) {
				for (var i = 0; i < path.length; i++) {
					update(store, path[i], reset, type);
				}
				return this;  // M
			}

			path = pathmaker(path);
			if (!path) {
				return this;  // M
			}

			var is = path.charCodeAt(0) === 33; // !
			if (is) {
				path = path.substring(1);
			}

			path = path.replaceWildcard();
			if (!path) {
				return this;  // M
			}

			if (!wasset) {
				get(path, get(path), true);
			}

			var state = [];

			if (type === undefined) {
				type = 1; // manually
			}

			skipproxy = path;

			var all = view.componenter.components;//M.components;
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

				if (!com.$ready) {
					com.$ready = true;
				}

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

					helper.findControl2(com);

				} else if (com.validate && !com.$valid_disabled) {
					com.valid(com.validate(result), true);
				}

				if (com.state) {
					state.push(com);
				}
			}

			if (reset) {
				cache.clear('dirty', 'valid');
			}

			for (var i = 0, length = state.length; i < length; i++) {
				state[i].stateX(1, 4);
			}

			eventer.emitwatch(path, get(path), type);

			return this; // M
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
			var exp = temp[key];
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
			temp[key] = exp;
			return exp.call(val, val, path);
		}

		// inc.. 
		function inc(path, value, type) {  // M.inc

			if (path instanceof Array) {
				for (var i = 0; i < path.length; i++)
					inc(path[i], value, type);
				return this; // M
			}

			//path = pathmaker(path); ---

			if (!path) {
				return this; // M
			}

			var current = get(path);
			if (!current) {
				current = 0;
			} else if (!langx.isNumber(current)) {
				current = parseFloat(current);
				if (isNaN(current))
					current = 0;
			}

			current += value;
			setx(path, current, type);
			return this; // M
		}


		// extend...
		function extend(path, value, type) { // M.extend
			path = pathmaker(path);
			if (path) {
				var val = get(path);
				if (val == null) {
					val = {};
				}
				setx(path, langx.extend(val, value), type);
			}
			return this; // M
		}


		function push(path, value, type) { // M.push

			if (path instanceof Array) {
				for (var i = 0; i < path.length; i++) {
					push(path[i], value, type);
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
			skipproxy = path;

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
				setx(path, arr, type);
			} else if (is) {
				update(path, undefined, type);
			}

			return this; // M
		}

	   /**
	   * Creates an object on the path and notifies all components
	   * @param  {String} path 
	   * @param  {Function} fn 
	   * @param  {Boolean} update Optional Optional, default "true"
	   */
		function make(obj, fn, needsUpdate) { // W.MAKE

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
					if (is && (needsUpdate === undefined || needsUpdate === true))
						update(p, true);
					else {
						if (view.ready) {
							set(p, obj);
						} else {
							setx(p, obj, true);
						}
					}
					return obj;
			}

			fn.call(obj, obj, '');
			return obj;
		}

	   /**
	   * Reads a state, it works with dirty state.
	   * @param  {String} path 
	   * @return {Boolean} 
	   */
		function changed(path) {
			return !view.componenter.com_dirty(path);
		};


	   /**
	   * Set a change for the path or can read the state, it works with dirty state.
	   * @param  {String} path 
	   * @param  {Boolean} value Optional
	   * @return {Boolean} 
	   */
		function change(path, value) {
			if (value == null) {
				value = true;
			}
			return !view.componenter.com_dirty(path, !value);
		};


		/*
		 * This method is same like EXEC() method but it returns a function.
		 * It must be used as a callback. All callback arguments will be used for the targeted method.
		 */
		function exec2(path, tmp) { //W.EXEC2 = 
			var is = path === true;
			return function(a, b, c, d) {
				if (is) {
					exec(tmp, path, a, b, c, d);
				} else {
					exec(path, a, b, c, d);
				}
			};
		};

	  /**
	   * Executes a method according to the path. It wont't throw any exception if the method not exist.
	   * @param  {Boolean} wait Optional enables a waiter for the method instance (if method doesn't exist) 
	   * @param  {String} path 
	   * @param  {Object} a - Optional, additional argument
	   * @param  {Object} b - Optional, additional argument
	   * @param  {Object} c - Optional, additional argument
	   */
		function exec(path) {   // W.EXEC = 

			var arg = [];
			var f = 1;
			var wait = false;
			var p;
			var ctx = this;

			if (path === true) {
				wait = true;
				path = arguments[1];
				f = 2;
			}

			path = path.env();

			for (var i = f; i < arguments.length; i++) {
				arg.push(arguments[i]);
			}

			var c = path.charCodeAt(0);

			// Event
			if (c === 35) { // # , ex: EXEC('#submit', true); --> EMIT('submit', true);
				p = path.substring(1);
				if (wait) {
					!events[p] && exechelper(ctx, path, arg);
				} else {
					EMIT.call(ctx, p, arg[0], arg[1], arg[2], arg[3], arg[4]);
				}
				return EXEC;
			}

			var ok = 0;

			// PLUGINS
			if (c === 64) { // @ , ex: EXEC('@PLUGIN.method_name');
				var index = path.indexOf('.');
				p = path.substring(1, index);
				var ctrl = view.plugins.find(p); //W.PLUGINS[p];
				if (ctrl) {
					var fn = ctrl[path.substring(index + 1)];
					if (langx.isFunction(fn) ) { // if (typeof(fn) === TYPE_FN) {
						fn.apply(ctx === Window ? ctrl : ctx, arg);
						ok = 1;
					}
				}

				if (wait && !ok) {
				 exechelper(ctx, path, arg);
				}
				return EXEC;
			}

			// PLUGINS
			var index = path.indexOf('/'); // ex : EXEC('PLUGIN/method_name');
			if (index !== -1) {
				p = path.substring(0, index);
				var ctrl = view.plugins.find(p); //W.PLUGINS[p];
				var fn = path.substring(index + 1);
				if (ctrl && langx.isFunction(ctrl[fn])) {
					ctrl[fn].apply(ctx === W ? ctrl : ctx, arg);
					ok = 1;
				}

				if (wait && !ok) {
				 exechelper(ctx, path, arg);
				}
				return EXEC;
			}

			var fn = get(path);

			if (langx.isFunction(fn)) {
				fn.apply(ctx, arg);
				ok = 1;
			}

			if (wait && !ok) {
				exechelper(ctx, path, arg);
			}
			return exec;
		};



	   /**
	   * Checks dirty and valid paths for all declared components on the path. 
	   * If the method return true then the components are validated and 
	   * some component has been changed by user (otherwise: false).
	   * @param  {String} path 
	   * @param  {String|Array} except  With absolute paths for skipping
	   * @returns {Boolean}   
	   */
		function can(path, except) { // W.CAN = 
			path = pathmaker(path);
			return !view.componenter.com_dirty(path, except) && view.componenter.com_valid(path, except);
		}

	   /**
	   * Checks dirty and valid paths for all declared components on the path. 
	   * If the method return false then the components are validated and 
	   * some component has been changed by user (otherwise: true).
	   * @param  {String} path 
	   * @param  {String|Array} except  With absolute paths for skipping
	   * @returns {Boolean}   
	   */
		function disabled(path, except) { // W.DISABLED = 
			path = pathmaker(path);
			return view.componenter.com_dirty(path, except) || !view.componenter.com_valid(path, except);
		}

	   /**
	   * Highlights all components on the path as invalid. 
	   * @param  {String} path 
	   * @param  {String|Array} except  With absolute paths for skipping
	   * @returns {Boolean}   
	   */
		function invalid(path, onlyComponent) {  // W.INVALID = 
			path = pathmaker(path);
			if (path) {
				view.componenter.com_dirty(path, false, onlyComponent, true);
				view.componenter.com_valid(path, false, onlyComponent);
			}
			return W;
		};

	   /**
	   * Resets dirty and valid state in all components on the path.
	   * @param  {String} path 
	   * @param  {Number} delay  Optional, in milliseconds (default: 0)
	   */
		function reset(path, timeout, onlyComponent) { //W.RESET = M.reset

			if (timeout > 0) {
				setTimeout(function() {
					reset(path);
				}, timeout);
				return this;
			}

			path = pathmaker(path).replaceWildcard();

			var arr = [];
			var all = view.componenter.components;//M.components;

			for (var i = 0, length = all.length; i < length; i++) {
				var com = all[i];
				if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path)) {
					continue;
				}

				com.state && arr.push(com);

				if (onlyComponent && onlyComponent._id !== com._id) {	
					continue;
				}

				helper.findControl2(com);

				if (!com.$dirty_disabled) {
					com.$dirty = true;
					com.$interaction(101);
				}

				if (!com.$valid_disabled) {
					com.$valid = true;
					com.$validate = false;
					if (com.validate) {
						com.$valid = com.validate(com.get());
						com.$interaction(102);
					}
				}
			}

			cache.clear('valid', 'dirty');
			view.componenter.state(arr, 1, 3);
			return this;
		}

		function used(path) {   //M.used
			each(function(obj) {
				!obj.disabled && obj.used();
			}, path);
			return this;
		};

	   /**
	   * Performs SET() and CHANGE() together.
	   * @param  {String} path 
	   * @param  {Object|Array} value.
	   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
	   * @param {Boolean} reset Optional
	   */
		function modify (path, value, timeout) { // W.MODIFY =
			if (path && typeof(path) === 'object') {
				Object.keys(path).forEach(function(k) {
					modify(k, path[k], value);
				});
			} else {
				if (langx.isFunction(value)) {
					value = value(get(path));
				}
				setx(path, value, timeout); 
				if (timeout) {
					langx.setTimeout(change, timeout + 5, path);
				} else {
					change(path);
				}
			}
			return this;
		};

	   /**
	   * Returns all modified components by user on the path.
	   * @param  {String} path 
	   * @returns {Array<String>}   
	   */
		function modified(path) { //W.MODIFIED = 
			var output = [];
			each(function(obj) {
				if (!(obj.disabled || obj.$dirty_disabled)) {
					obj.$dirty === false && output.push(obj.path);
				}
			}, pathmaker(path));
			return output;
		}


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
		}

		function errors(path, except, highlight) { //W.ERRORS = 

			if (path instanceof Array) {
				except = path;
				path = undefined;
			}

			if (except === true) {
				except = highlight instanceof Array ? highlight : null;
				highlight = true;
			}

			var arr = [];

			each(function(obj) { // M.each
				if (!obj.disabled && (!except || !obj.$except(except)) && obj.$valid === false && !obj.$valid_disabled)
					arr.push(obj);
			}, pathmaker(path));

			highlight && langx.state(arr, 1, 1);
			return arr;
		}


		function rewrite(path, value, type) { // W.REWRITE = 
			path = pathmaker(path);
			if (path) {
				skipproxy = path;
				set(path, value);
				eventer.emitwatch(path, value, type);
			}
			return this; // W
		}

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

				// Prepend
				if (path === true) {
					$parser.unshift(value);
				} else {
					$parser.push(value);
				}

				return this;
			}

			var a = $parser;
			if (a && a.length) {
				for (var i = 0, length = a.length; i < length; i++) {
					value = a[i].call(this, path, value, type);
				}
			}

			return value;
		}

		parser(function(path, value, type) {

			switch (type) {
				case 'number':
				case 'currency':
				case 'float':
					var v = +(langx.isString(value) ? value.trimAll().replace(REGCOMMA, '.') : value);
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

	   /**
	   * skips component.setter for future update. It's incremental.
	   * @param  {String} pathA Absolute path according to the component "data-jc-path"  
	   * @param  {String} pathB Absolute path according to the component "data-jc-path"  
	   * @param  {String} pathN Absolute path according to the component "data-jc-path"  
	   */
		function skipInc() { // W.SKIP = 
			for (var j = 0; j < arguments.length; j++) {
				var arr = arguments[j].split(',');
				for (var i = 0, length = arr.length; i < length; i++) {
					var p = arr[i].trim();
					if (skips[p]) {
						skips[p]++;
					} else {
						skips[p] = 1;
					}
				}
			}
		}

		function skipDec(p) { // 
			if (skips[p]) {
				var s = --skips[p];
				if (s <= 0) {
					delete skips[p];
					return false;
				}
			}
			return true
		}


		function clean() {
			temp = {};
			paths = {};
		}

		
		var waits = {};

	   /**
	   * Wait for a feature
	   * @param  {String|Function} path/fn  
	   * @param  {Function} callback  
	   * @param  {Number} interval  Optional, in milliseconds (default: 500)
	   * @param  {Number} timeout Optional, a timeout (default: 0 - disabled) 
	   * @return {Boolean}  
	   */ 
		function wait(fn, callback, interval, timeout) { // W.WAIT = 
			var key = ((Math.random() * 10000) >> 0).toString(16);
			var tkey = timeout > 0 ? key + '_timeout' : 0;

			if (typeof(callback) === 'number') {
				var tmp = interval;
				interval = callback;
				callback = tmp;
			}

			var is = typeof(fn) === 'string';
			var run = false;

			if (is) {
				var result = get(fn);
				if (result)
					run = true;
			} else if (fn())
				run = true;

			if (run) {
				callback(null, function(sleep) {
					setTimeout(function() {
						WAIT(fn, callback, interval, timeout);
					}, sleep || 1);
				});
				return;
			}

			if (tkey) {
				waits[tkey] = setTimeout(function() {
					clearInterval(waits[key]);
					delete waits[tkey];
					delete waits[key];
					callback(new Error('Timeout.'));
				}, timeout);
			}

			waits[key] = setInterval(function() {

				if (is) {
					var result = get(fn);
					if (result == null)
						return;
				} else if (!fn())
					return;

				clearInterval(waits[key]);
				delete waits[key];

				if (tkey) {
					clearTimeout(waits[tkey]);
					delete waits[tkey];
				}

				callback && callback(null, function(sleep) {
					setTimeout(function() {
						WAIT(fn, callback, interval);
					}, sleep || 1);
				});

			}, interval || 500);
		};

		return {
			"bind"  : bind,
			"cachePath" : cachePath,
			"can" : can,
			"change" : change,
			"changed" : changed,
			"create" : create,
			"default" : defaultValue,
			"disabled" : disabled,
			"errors" : errors,
			"evaluate" : evaluate,
			"exec" : exec,
			"exec2" : exec2,
			"extend" : extend,
			"format" : format,
			"get"  : get,
			"inc"  : inc,
			"invalid" : invalid,
			"make" : make,
			"modify" : modify,
			"modified" : modified,
			"parser" : parser,
			"paths" : paths,
			"push" : push,
			"reset" : reset,
			"remap" : remap,
			"rewrite" : rewrite,
			"set"  : set,
			"set2" : set2,
 			"setx" : setx,
 			"skipInc" : skipInc,
 			"skipDec" : skipDec,
 			"update" : update,
 			"used" : used,
 			"wait" : wait
		};
	}

	return storing;
});