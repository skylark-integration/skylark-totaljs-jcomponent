define([
	"./jc",
	"./langx",
	"./Usage",
	"./caches",
	"./Component"
],function(jc,langx,Usage, caches,Component){
	var M = jc;

	var components = Component.components = [];
	var versions = {};

	var clear = caches.clear;

   /**
   * sets a version for specific components.
   */
	function version() { //W.VERSION = 
		for (var j = 0; j < arguments.length; j++) {
			var keys = arguments[j].split(',');
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i].trim();
				var tmp = key.indexOf('@');
				if (tmp === -1) {
					continue;
				}
				var version = key.substring(tmp + 1);
				key = key.substring(0, tmp);
				version && key && (versions[key] = version);
			}
		}
	};


	$.fn.FIND = function(selector, many, callback, timeout) {

		if (typeof(many) === TYPE_FN) {
			timeout = callback;
			callback = many;
			many = undefined;
		}

		var self = this;
		var output = findcomponent(self, selector);
		if (typeof(callback) === TYPE_FN) {

			if (output.length) {
				callback.call(output, output);
				return self;
			}

			WAIT(function() {
				var val = self.FIND(selector, many);
				return val instanceof Array ? val.length > 0 : !!val;
			}, function(err) {
				// timeout
				if (!err) {
					var val = self.FIND(selector, many);
					callback.call(val ? val : W, val);
				}
			}, 500, timeout);

			return self;
		}

		return many ? output : output[0];
	};

	$.fn.SETTER = function(selector, name) {

		var self = this;
		var arg = [];
		var beg = selector === true ? 3 : 2;

		for (var i = beg; i < arguments.length; i++)
			arg.push(arguments[i]);

		if (beg === 3) {
			selector = name;
			name = arguments[2];

			if (lazycom[selector] && lazycom[selector].state !== 3) {

				if (lazycom[selector].state === 1) {
					lazycom[selector].state = 2;
					EMIT('lazy', selector, true);
					warn('Lazy load: ' + selector);
					compile();
				}

				setTimeout(function(arg) {
					$.fn.SETTER.apply(self, arg);
				}, 555, arguments);

				return self;
			}

			self.FIND(selector, true, function(arr) {
				for (var i = 0, length = arr.length; i < length; i++) {
					var o = arr[i];
					if (typeof(o[name]) === TYPE_FN)
						o[name].apply(o, arg);
					else
						o[name] = arg[0];
				}
			});

		} else {

			if (lazycom[selector] && lazycom[selector].state !== 3) {

				if (lazycom[selector].state === 1) {
					lazycom[selector].state = 2;
					EMIT('lazy', selector, true);
					warn('Lazy load: ' + selector);
					compile();
				}

				setTimeout(function(arg) {
					$.fn.SETTER.apply(self, arg);
				}, 555, arguments);

				return self;
			}

			var arr = self.FIND(selector, true);
			for (var i = 0, length = arr.length; i < length; i++) {
				var o = arr[i];
				if (typeof(o[name]) === TYPE_FN)
					o[name].apply(o, arg);
				else
					o[name] = arg[0];
			}
		}

		return self;
	};

	$.fn.RECONFIGURE = function(selector, value) {
		return this.SETTER(selector, 'reconfigure', value);
	};


	M.$formatter = [];


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
	W.FORMATTER = M.formatter = function(value, path, type) {

		if (langx.isFunction(value)) {
			!M.$formatter && (M.$formatter = []);

			// Prepend
			if (path === true) {
				M.$formatter.unshift(value);
			} else {
				M.$formatter.push(value);
			}

			return M;
		}

		var a = M.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				var val = a[i].call(M, path, value, type);
				if (val !== undefined)
					value = val;
			}
		}

		return value;
	};


   /**
   * Reconfigures all components according to the selector.
   * @param  {String} selector 
   * @param  {String/Object} config A default configuration
   */
	W.RECONFIGURE = function(selector, value) {
		SETTER(true, selector, 'reconfigure', value);
		return RECONFIGURE;
	};

   /**
   * Set a new value to the specific method in components.
   * @param  {Boolean} wait Optional, can it wait for non-exist components? 
   * @param  {String} selector  
   * @param  {String} name Property or Method name (can't be nested) 
   * @param  {Object} argA Optional, additional argument
   * @param  {Object} argB Optional, additional argument
   * @param  {Object} argN Optional, additional argument
   */
	function setter(selector, name) { // W.SETTER

		var arg = [];
		var beg = selector === true ? 3 : 2;

		for (var i = beg; i < arguments.length; i++) {
			arg.push(arguments[i]);
		}

		if (beg === 3) {

			selector = name;

			if (lazycom[selector] && lazycom[selector].state !== 3) {

				if (lazycom[selector].state === 1) {
					lazycom[selector].state = 2;
					EMIT('lazy', selector, true);
					warn('Lazy load: ' + selector);
					compile();
				}

				setTimeout(function(arg) {
					arg[0] = true;
					W.SETTER.apply(W, arg);
				}, 555, arguments);

				return SETTER;
			}

			name = arguments[2];

			FIND(selector, true, function(arr) {
				for (var i = 0, length = arr.length; i < length; i++) {
					var o = arr[i];
					if (typeof(o[name]) === TYPE_FN)
						o[name].apply(o, arg);
					else
						o[name] = arg[0];
				}
			});
		} else {

			if (lazycom[selector] && lazycom[selector].state !== 3) {

				if (lazycom[selector].state === 1) {
					lazycom[selector].state = 2;
					EMIT('lazy', selector, true);
					warn('Lazy load: ' + selector);
					compile();
				}

				setTimeout(function(arg) {
					W.SETTER.apply(W, arg);
				}, 555, arguments);

				return SETTER;
			}

			var arr = FIND(selector, true);
			for (var i = 0, length = arr.length; i < length; i++) {
				var o = arr[i];
				if (typeof(o[name]) === TYPE_FN)
					o[name].apply(o, arg);
				else
					o[name] = arg[0];
			}
		}

		return SETTER;
	};




//	var components = {};

//	M.$components = {};
//	M.components = [];


	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================

	var ATTRCOM = '[data-jc]';

	function exechelper(ctx, path, arg) {
		setTimeout(function() {
			EXEC.call(ctx, true, path, arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6]);
		}, 200);
	}

	function com_dirty(path, value, onlyComponent, skipEmitState) {

		var isExcept = value instanceof Array;
		var key = 'dirty' + path + (isExcept ? '>' + value.join('|') : '');
		var except = null;

		if (isExcept) {
			except = value;
			value = undefined;
		}

		if (typeof(value) !== 'boolean' && cache[key] !== undefined)
			return cache[key];

		var dirty = true;
		var arr = value !== undefined ? [] : null;
		var flags = null;

		if (isExcept) {
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
			isExcept = except.length > 0;
		}

		var index = path.lastIndexOf('.*');
		var wildcard = index !== -1;
		if (index !== -1)
			path = path.substring(0, index);

		path = pathmaker(path);

		var all = components;//M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.$removed || !com.$loaded || !com.path || !com.$compare(path) || (isExcept && com.$except(except)))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			if (com.disabled || com.$dirty_disabled) {
				arr && com.state && arr.push(com);
				continue;
			}

			if (value === undefined) {
				if (com.$dirty === false)
					dirty = false;
				continue;
			}

			com.state && arr.push(com);

			if (!onlyComponent) {
				if (wildcard || com.path === path) {
					com.$dirty = value;
					com.$interaction(101);
				}
			} else if (onlyComponent._id === com._id) {
				com.$dirty = value;
				com.$interaction(101);
			}
			if (com.$dirty === false)
				dirty = false;
		}

		clear('dirty');
		cache[key] = dirty;

		// For double hitting component.state() --> look into COM.invalid()
		!skipEmitState && state(arr, 1, 2);
		return dirty;
	}

   /**
   * Reads a state, it works with dirty state.
   * @param  {String} path 
   * @return {Boolean} 
   */
	function changed(path) {
		return !com_dirty(path);
	};


   /**
   * Set a change for the path or can read the state, it works with dirty state.
   * @param  {String} path 
   * @param  {Boolean} value Optional
   * @return {Boolean} 
   */
	function change(path, value) {
		if (value == null)
			value = true;
		return !com_dirty(path, !value);
	};


	/*
	 * This method is same like EXEC() method but it returns a function.
	 * It must be used as a callback. All callback arguments will be used for the targeted method.
	 */
	function exec2(path, tmp) { //W.EXEC2 = 
		var is = path === true;
		return function(a, b, c, d) {
			if (is)
				EXEC(tmp, path, a, b, c, d);
			else
				EXEC(path, a, b, c, d);
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
			var ctrl = plugins.find(p); //W.PLUGINS[p];
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
			var ctrl = plugins.find(p); //W.PLUGINS[p];
			var fn = path.substring(index + 1);
			if (ctrl && typeof(ctrl[fn]) === TYPE_FN) {
				ctrl[fn].apply(ctx === W ? ctrl : ctx, arg);
				ok = 1;
			}

			if (wait && !ok) {
			 exechelper(ctx, path, arg);
			}
			return EXEC;
		}

		var fn = paths.get(path);

		if (langx.isFunction(fn)) {
			fn.apply(ctx, arg);
			ok = 1;
		}

		wait && !ok && exechelper(ctx, path, arg);
		return EXEC;
	};


	function findinstance(t, type) {

		if (!t.length) {
			return null;
		}

		for (var i = 0; i < t.length; i++) {
			if (t[i][type]) {
				return t[i][type];
			}
		}

		var el = t[0].parentElement;
		while (el !== null) {
			if (el[type]) {
				return el[type];
			}
			el = el.parentElement;
		}

		return null;
	}

	function findcomponent(container, selector, callback) {

		var s = (selector ? selector.split(' ') : EMPTYARRAY);
		var path = '';
		var name = '';
		var id = '';
		var version = '';
		var index;

		for (var i = 0, length = s.length; i < length; i++) {
			switch (s[i].substring(0, 1)) {
				case '*':
					break;
				case '.':
					// path
					path = s[i].substring(1);
					break;
				case '#':
					// id;
					id = s[i].substring(1);
					index = id.indexOf('[');
					if (index !== -1) {
						path = id.substring(index + 1, id.length - 1).trim();
						id = id.substring(0, index);
					}
					break;
				default:
					// name
					name = s[i];
					index = name.indexOf('[');

					if (index !== -1) {
						path = name.substring(index + 1, name.length - 1).trim();
						name = name.substring(0, index);
					}

					index = name.lastIndexOf('@');

					if (index !== -1) {
						version = name.substring(index + 1);
						name = name.substring(0, index);
					}

					break;
			}
		}

		var arr = callback ? undefined : [];
		if (container) {
			var stop = false;
			container.find('[data-jc]').each(function() {
				var com = this.$com;

				if (stop || !com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.$version !== version) || (path && (com.$pp || (com.path !== path && (!com.pathscope || ((com.pathscope + '.' + path) !== com.path))))))
					return;

				if (callback) {
					if (callback(com) === false)
						stop = true;
				} else
					arr.push(com);
			});
		} else {
			for (var i = 0, length = components.length; i < length; i++) { // M.components.length
				var com = components[i]; // M.components[i]
				if (!com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.$version !== version) || ((path && (com.$pp || (com.path !== path && (!com.pathscope || ((com.pathscope + '.' + path) !== com.path)))))))
					continue;

				if (callback) {
					if (callback(com) === false) {
						break;
					}
				} else {
					arr.push(com);
				}
			}
		}

		return arr;
	}

	function findcontrol2(com, input) {

		if (com.$inputcontrol) {
			if (com.$inputcontrol % 2 !== 0) {
				com.$inputcontrol++;
				return;
			}
		}

		var target = input ? input : com.element;
		findcontrol(target[0], function(el) {
			if (!el.$com || el.$com !== com) {
				el.$com = com;
				com.$inputcontrol = 1;
			}
		});
	}

	function findcontrol(container, onElement, level) {

		var arr = container.childNodes;
		var sub = [];

		ACTRLS[container.tagName] && onElement(container);

		if (level == null) {
			level = 0;
		} else {
			level++;
		}

		for (var i = 0, length = arr.length; i < length; i++) {
			var el = arr[i];
			if (el && el.tagName) {
				el.childNodes.length && el.tagName !== 'SCRIPT' && el.getAttribute('data-jc') == null && sub.push(el);
				if (ACTRLS[el.tagName] && el.getAttribute('data-jc-bind') != null && onElement(el) === false)
					return;
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			if (el && findcontrol(el, onElement, level) === false)
				return;
		}
	}

	function com_valid(path, value, onlyComponent) {

		var isExcept = value instanceof Array;
		var key = 'valid' + path + (isExcept ? '>' + value.join('|') : '');
		var except = null;

		if (isExcept) {
			except = value;
			value = undefined;
		}

		if (typeof(value) !== 'boolean' && cache[key] !== undefined)
			return cache[key];

		var flags = null;

		if (isExcept) {
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
			isExcept = except.length > 0;
		}

		var valid = true;
		var arr = value !== undefined ? [] : null;

		var index = path.lastIndexOf('.*');
		var wildcard = index !== -1;
		if (index !== -1) {
			path = path.substring(0, index);
		}

		path = pathmaker(path);

		var all = components;//M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.$removed || !com.$loaded || !com.path || !com.$compare(path) || (isExcept && com.$except(except)))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			if (com.disabled || com.$valid_disabled) {
				arr && com.state && arr.push(com);
				continue;
			}

			if (value === undefined) {
				if (com.$valid === false)
					valid = false;
				continue;
			}

			com.state && arr.push(com);

			if (!onlyComponent) {
				if (wildcard || com.path === path) {
					com.$valid = value;
					com.$interaction(102);
				}
			} else if (onlyComponent._id === com._id) {
				com.$valid = value;
				com.$interaction(102);
			}
			if (com.$valid === false)
				valid = false;
		}

		caches.clear('valid');
		caches.put(key, valid);  // cache[key] = valid
		langx.state(arr, 1, 1);
		return valid;
	}


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
		return !com_dirty(path, except) && com_valid(path, except);
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
		return com_dirty(path, except) || !com_valid(path, except);
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
			com_dirty(path, false, onlyComponent, true);
			com_valid(path, false, onlyComponent);
		}
		return W;
	};


	// ===============================================================
	// Query Extendtion
	// ===============================================================

	$.fn.vbind = function() {
		return findinstance(this, '$vbind');
	};

	$.fn.vbindarray = function() {
		return findinstance(this, '$vbindarray');
	};

	$.fn.component = function() {
		return findinstance(this, '$com');
	};

	$.fn.components = function(fn) {
		var all = this.find(ATTRCOM);
		var output = null;
		all.each(function(index) {
			var com = this.$com;
			if (com) {
				var isarr = com instanceof Array;
				if (isarr) {
					com.forEach(function(o) {
						if (o && o.$ready && !o.$removed) {
							if (fn)
								return fn.call(o, index);
							if (!output)
								output = [];
							output.push(o);
						}
					});
				} else if (com && com.$ready && !com.$removed) {
					if (fn)
						return fn.call(com, index);
					if (!output)
						output = [];
					output.push(com);
				}
			}
		});
		return fn ? all : output;
	};


   /**
   * Create new components dynamically.
   * @param  {String|Array<String>} declaration 
   * @param  {jQuery Element/Component/Scope/Plugin} element optional,a parent element (default: "document.body")
   */
	function add(value, element) { // W.ADD =
		if (element instanceof COM || element instanceof Scope || element instanceof Plugin) {
			element = element.element;
		}
		if (value instanceof Array) {
			for (var i = 0; i < value.length; i++)
				ADD(value[i], element);
		} else {
			$(element || document.body).append('<div data-jc="{0}"></div>'.format(value));
			setTimeout2('ADD', COMPILE, 10);
		}
	};

	langx.mixin(components,{
		add,

		attrcom, // 
		exec,
		exec2,
	});

	var cache = {}; // lwf

	/*
	 * Finds all component according to the selector.
	 */
	function find(value, many, noCache, callback) { //W.FIND = 

		var isWaiting = false;

		if (langx.isFunction(many)) {
			isWaiting = true;
			callback = many;
			many = undefined;
			// noCache = undefined;
			// noCache can be timeout
		} else if (langx.isFunction(noCache)) {
			var tmp = callback;
			isWaiting = true;
			callback = noCache;
			noCache = tmp;
			// noCache can be timeout
		}

		if (isWaiting) {
			langx.isWaiting(function() {  // WAIT
				var val = FIND(value, many, noCache);
				if (lazycom[value] && lazycom[value].state === 1) {
					lazycom[value].state = 2;
					topic.emit('lazy', value, true); // EMIT
					warn('Lazy load: ' + value);
					compile();
				}
				return val instanceof Array ? val.length > 0 : !!val;
			}, function(err) {
				// timeout
				if (!err) {
					var val = FIND(value, many);
					callback.call(val ? val : W, val);
				}
			}, 500, noCache);
			return;
		}

		// Element
		if (typeof(value) === 'object') {
			if (!(value instanceof jQuery)) {
				value = $(value);
			}
			var output = findcomponent(value, '');
			return many ? output : output[0];
		}

		var key, output;

		if (!noCache) {
			key = 'find.' + value + '.' + (many ? 0 : 1);
			output = cache[key];
			if (output) {
				return output;
			}
		}

		var r = findcomponent(null, value);
		if (!many) {
			r = r[0];
		}
		output = r;
		if (!noCache) {
			cache[key] = output;
		}
		return output;
	};

	function usage(name, expire, path, callback) { //W.LASTMODIFICATION = W.USAGE = M.usage = 

		var type = typeof(expire);
		if (type === TYPE_S) {
			//var dt = W.NOW = W.DATETIME = new Date();
			var dt = langx.now(true);
			expire = dt.add('-' + expire.env()).getTime();
		} else if (type === TYPE_N)
			expire = Date.now() - expire;

		if (typeof(path) === TYPE_FN) {
			callback = path;
			path = undefined;
		}

		var arr = [];
		var a = null;

		if (path) {
			a = FIND('.' + path, true);
		} else {
			a = components;//M.components;
		}

		for (var i = 0; i < a.length; i++) {
			var c = a[i];
			if (c.usage[name] >= expire) {
				if (callback)
					callback(c);
				else
					arr.push(c);
			}
		}

		return callback ? M : arr;
	}

	function default2(path, timeout, onlyComponent, reset) { //M.default = 

		if (timeout > 0) {
			setTimeout(function() {
				default2(path, 0, onlyComponent, reset);
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

		path = pathmakerw(path); //pathmaker(path.replace(REGWILDCARD, ''));

		// Reset scope
		var key = path.replace(/\.\*$/, '');
		var fn = defaults['#' + HASH(key)];
		var tmp;

		if (fn) {
			tmp = fn();
			set(key, tmp);
		}

		var arr = [];
		var all = components;//M.components;

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

			findcontrol2(com);

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
			caches.clear('valid', 'dirty');
			langx.state(arr, 3, 3);
		}

		return this;
	}


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

		path = parsers.pathmaker(path).replace(REGWILDCARD, '');

		var arr = [];
		var all = components;//M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path)) {
				continue;
			}

			com.state && arr.push(com);

			if (onlyComponent && onlyComponent._id !== com._id) {
				continue;
			}

			findcontrol2(com);

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

		clear('valid', 'dirty');
		state(arr, 1, 3);
		return this;
	}

	function each(fn, path) {   // M.each
		var wildcard = path ? path.lastIndexOf('*') !== -1 : false;
		if (wildcard)
			path = path.replace('.*', '');
		var all = components;//M.components;
		var index = 0;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || !com.$loaded || com.$removed || (path && (!com.path || !com.$compare(path))))
				continue;
			var stop = fn(com, index++, wildcard);
			if (stop === true)
				return this;
		}
		return this;
	}

	function used(path) {   //M.used
		each(function(obj) {
			!obj.disabled && obj.used();
		}, path);
		return this;
	};

   /**
   * Returns all modified components by user on the path.
   * @param  {String} path 
   * @returns {Array<String>}   
   */
	function modified(path) { //W.MODIFIED = 
		var output = [];
		M.each(function(obj) {
			if (!(obj.disabled || obj.$dirty_disabled)) {
				obj.$dirty === false && output.push(obj.path);
			}
		}, pathmaker(path));
		return output;
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

	return jc.views = {
		components,
		changed : changed,
		change : change,
		cleaner,
		cleaner2,
		default2,
		each,
		find,
		refresh,
		reset,
		setter,
		usage,
		version
	};

});