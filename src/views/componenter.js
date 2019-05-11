define([
	"../langx",
	"../utils/domx",
	"../utils/logs",
	"../components/extensions",
	"../components/registry"
],function(langx, domx, logs,extensions, registry){
	var warn = logs.warn;

	function componenter(view) {
		var helper = view.helper,
			eventer = view.eventer,
			storing = view.storing,
			compiler = view.compiler,
			components = [],
			lazycom = {},
			autofill = [],
			cache = {
				dirty : {},
				valid : {},
				find : {},
				clear : function(key1,key2,key3) {
					for (var i = 1; i<arguments.length;i++) {
						var key = arguments[i];
						this[key] = {};
					}
				},

				get : function(category,key) {
					this[category][key];
				},

				set : function(category,key,value) {
					this[category][key] = value;
				}

			},

			defaults = {};

		var knockknockcounter = 0;



		setInterval(function() {
			//W.DATETIME = W.NOW = new Date();
			langx.now(true);
			var c = components;
			for (var i = 0, length = c.length; i < length; i++)
				c[i].knockknock && c[i].knockknock(knockknockcounter);
			eventer.emit('knockknock', knockknockcounter++);  // EMIT
		}, 60000);

		function checkLazy(name) {
			var lo = lazycom[name];

			if (!lo) {
				var namea = name.substring(0, name.indexOf('@'));
				if (namea && name !== namea) {
					lo = lazycom[name] = lazycom[namea] = { state: 1 };
				} else {
					lo = lazycom[name] = { state: 1 };
				}
			}
			return lo;			
		}

		function each(fn, path) {   // M.each
			var wildcard = path ? path.lastIndexOf('*') !== -1 : false;
			if (wildcard) {
				path = path.replace('.*', '');
			}
			var all = components;//M.components;
			var index = 0;
			for (var i = 0, length = all.length; i < length; i++) {
				var com = all[i];
				if (!com || !com.$loaded || com.$removed || (path && (!com.path || !com.$compare(path)))) {
					continue;
				}
				var stop = fn(com, index++, wildcard);
				if (stop === true) {
					return this;
				}
			}
			return this;
		}

		function com_validate2(com) {

			var valid = true;

			if (com.disabled) {
				return valid;
			}

			if (com.$valid_disabled) {
				return valid;
			}

			var arr = [];
			com.state && arr.push(com);
			com.$validate = true;

			if (com.validate) {
				com.$valid = com.validate(get(com.path));
				com.$interaction(102);
				if (!com.$valid)
					valid = false;
			}

			cache.clear('valid');
			langx.state(arr, 1, 1);
			return valid;
		}

		function com_dirty(path, value, onlyComponent, skipEmitState) {
			var isExcept = value instanceof Array;
			var key = path + (isExcept ? '>' + value.join('|') : '');  // 'dirty' + 
			var except = null;

			if (isExcept) {
				except = value;
				value = undefined;
			}

			var dirty = cache.get("dirty",key);
			if (typeof(value) !== 'boolean' && dirty !== undefined) {
				return dirty;
			}

			dirty = true;
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
			if (index !== -1) {
				path = path.substring(0, index);
			}

			path = view.binding.pathmaker(path);

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

			cache.clear('dirty');
			cache.set('dirty',key,dirty);

			// For double hitting component.state() --> look into COM.invalid()
			!skipEmitState && state(arr, 1, 2);
			return dirty;
		}

		function com_valid(path, value, onlyComponent) {

			var isExcept = value instanceof Array;
			var key =  path + (isExcept ? '>' + value.join('|') : ''); // 'valid' +
			var except = null;

			if (isExcept) {
				except = value;
				value = undefined;
			}

			var valid = cache.get("valid",key);

			if (typeof(value) !== 'boolean' && valid !== undefined) {
				return valid; //cache[key];
			}

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

			valid = true;
			var arr = value !== undefined ? [] : null;

			var index = path.lastIndexOf('.*');
			var wildcard = index !== -1;
			if (index !== -1) {
				path = path.substring(0, index);
			}

			path = view.binding.pathmaker(path);

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
				if (com.$valid === false) {
					valid = false;
				}
			}

			cache.clear('valid');
			cache.set('valid',key, valid) ;
			langx.state(arr, 1, 1);
			return valid;
		}

	  /**
	   * Notifies a setter in all components on the path.
	   * @param  {String} path 
	   */
		function notify() { // W.NOTIFY

			var arg = arguments;
			var all = components;//M.components;

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
				eventer.emitwatch(arg[j], getx(arg[j]), 1);  // GET
			}

			return this;  // W
		}

		// what:
		// 1. valid
		// 2. dirty
		// 3. reset
		// 4. update
		// 5. set
		function state(arr, type, what) {
			if (arr && arr.length) {
				setTimeout(function() {
					for (var i = 0, length = arr.length; i < length; i++) {
						arr[i].stateX(type, what);
					}
				}, 2, arr);
			}
		}

		function validate(path, except) { //W.VALIDATE =

			var arr = [];
			var valid = true;

			path = view.binding.pathmaker(path.replaceWildcard()); //pathmaker(path.replace(REGWILDCARD, ''));

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

			var all = components;//M.components;
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

			cache.clear('valid');
			state(arr, 1, 1);
			return valid;
		}

		function prepare(obj) {

			if (!obj) {
				return;
			}

			var el = obj.element;

			if(extensions[obj.name]) {
				extensions[obj.name].forEach(function(item) {
					if (item.config) {
						obj.reconfigure(item.config, langx.empties.fn);
					}
					item.fn.call(obj, obj, obj.config);
				});
			}

			var value = obj.get();
			var tmp;

			if (obj.configure) {
				obj.reconfigure(obj.config, undefined, true);
			}

			obj.$loaded = true;

			if (obj.setter) {
				if (!obj.$prepared) {

					obj.$prepared = true;
					obj.$ready = true;

					tmp = helper.attrcom(obj, 'value');

					if (tmp) {
						if (!defaults[tmp]) {
							defaults[tmp] = new Function('return ' + tmp);
						}

						obj.$default = defaults[tmp];
						if (value === undefined) {
							value = obj.$default();
							view.storing.set(obj.path, value);
							eventer.emitwatch(obj.path, value, 0);
						}
					}

					if (obj.$binded)
						obj.$interaction(0);
					else {
						obj.$binded = true;
						obj.setterX(value, obj.path, 0);
						obj.$interaction(0);
					}
				}
			} else {
				obj.$binded = true;
			}

			if (obj.validate && !obj.$valid_disabled) {
				obj.$valid = obj.validate(obj.get(), true);
			}

			if (obj.done) {
				setTimeout(obj.done, 20);
			}
			
			if (obj.state) {
				obj.stateX(0, 3);
			}

			if (obj.$init) {
				setTimeout(function() {
					var fn = get(obj.$init);
					if (langx.isFunction(fn)) {
						fn.call(obj, obj);	
					} 
					obj.$init = undefined;
				}, 5);
			}

			var n = 'component';
			el.trigger(n);
			el.off(n);

			var cls = helper.attrcom(el, 'class');
			cls && (function(cls) {
				setTimeout(function() {
					cls = cls.split(' ');
					var tmp = el[0].$jclass || {};
					for (var i = 0, length = cls.length; i < length; i++) {
						if (!tmp[cls[i]]) {
							el.tclass(cls[i]);
							tmp[cls[i]] = true;
						}
					}
					el[0].$jclass = tmp;
				}, 5);
			})(cls);

			if (obj.id) {
				eventer.emit('#' + obj.id, obj);  // EMIT
			}
			eventer.emit('@' + obj.name, obj); // EMIT
			eventer.emit(n, obj);  // EMIT
			cache.clear('find');
			if (obj.$lazy) {
				obj.$lazy.state = 3;
				delete obj.$lazy;
				eventer.emit('lazy', obj.$name, false); // EMIT
			}
		}


		/*
		 * Finds all component according to the selector.
		 *   find(selector,callback) -> wait
		 *   find(selector,many,callback,timeout) -> wait
		 *   find(selector,manay,nocache,callback) -> no wait
		 *   find(selector,manay,timeout) --> no wait
		 * @value {String} selector
         * @many {Boolean} Optional, output will be Array
         * @nocache {Boolean} Optional
         * @callback {Function(response)} Optional and the method will be wait for non-exist components
         * @timeout {Number} Optional, in milliseconds (default: 0)
         * returns {Component} or {Array Component}
		 */
		function find(value, many, noCache, callback) { //W.FIND

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
				langx.wait(function() {  // WAIT
					var val = find(value, many, noCache);
					if (lazycom[value] && lazycom[value].state === 1) {
						lazycom[value].state = 2;
						eventer.emit('lazy', value, true); // EMIT
						warn('Lazy load: ' + value);
						compiler.compile();
					}
					return val instanceof Array ? val.length > 0 : !!val;
				}, function(err) {
					// timeout
					if (!err) {
						var val = find(value, many);
						callback.call(val ? val : window, val);
					}
				}, 500, noCache);
				return;
			}

			// Element
			if (typeof(value) === 'object') {
				if (!(value instanceof jQuery)) {
					value = $(value);
				}
				var output = helper.findComponent(value, '');
				return many ? output : output[0];
			}

			var key, output;

			if (!noCache) {
				key = value + '.' + (many ? 0 : 1);  // 'find.' + 
				output = cache.get("find",key);//output = cache[key];
				if (output) {
					return output;
				}
			}

			var r = helper.findComponent(null, value);
			if (!many) {
				r = r[0];
			}
			output = r;
			if (!noCache) {
				cache.set("find",key,output);//cache[key] = output;
			}
			return output;
		}

	   /**
	   * Reconfigures all components according to the selector.
	   * @param  {String} selector 
	   * @param  {String/Object} config A default configuration
	   */
		function reconfigure(selector, value) { // W.RECONFIGURE = 
			setter(true, selector, 'reconfigure', value);
			return this; // RECONFIGURE
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
						eventer.emit('lazy', selector, true); // EMIT
						warn('Lazy load: ' + selector);
						compiler.compile();
					}

					setTimeout(function(arg) {
						arg[0] = true;
						setter.apply(window, arg);
					}, 555, arguments);

					return SETTER;
				}

				name = arguments[2];

				find(selector, true, function(arr) {
					for (var i = 0, length = arr.length; i < length; i++) {
						var o = arr[i];
						if (langx.isFunction(o[name]))
							o[name].apply(o, arg);
						else
							o[name] = arg[0];
					}
				});
			} else {

				if (lazycom[selector] && lazycom[selector].state !== 3) {

					if (lazycom[selector].state === 1) {
						lazycom[selector].state = 2;
						eventer.emit('lazy', selector, true);  // EMIT
						warn('Lazy load: ' + selector);
						compiler.compile();
					}

					setTimeout(function(arg) {
						setter.apply(window, arg);
					}, 555, arguments);

					return SETTER;
				}

				var arr = find(selector, true);
				for (var i = 0, length = arr.length; i < length; i++) {
					var o = arr[i];
					if (langx.isFunction(o[name]) )
						o[name].apply(o, arg);
					else
						o[name] = arg[0];
				}
			}

			return this; // SETTER
		};


		// @type {String} Can be "init", "manually", "input" or "custom"
		// @expire {String/Number}, for example "5 minutes"
		// @path {String} Optional, for example "users.form.name"
		// returns {Array Component} or {jComponent}
		function usage(name, expire, path, callback) { //W.LASTMODIFICATION = W.USAGE = M.usage = 

			var type = typeof(expire);
			if (langx.isString(expire)) {
				//var dt = W.NOW = W.DATETIME = new Date();
				var dt = langx.now(true);
				expire = dt.add('-' + expire.env()).getTime();
			} else if (langx.isNumber(expire))
				expire = Date.now() - expire;

			if (langx.isFunction(path)) {
				callback = path;
				path = undefined;
			}

			var arr = [];
			var a = null;

			if (path) {
				a = find('.' + path, true);
			} else {
				a = components;//M.components;
			}

			for (var i = 0; i < a.length; i++) {
				var c = a[i];
				if (c.usage[name] >= expire) {
					if (callback) {
						callback(c);
					} else {
						arr.push(c);
					}
				}
			}

			return callback ? M : arr;
		}


		function clean() {
			var all =  components,
	 			index = 0;
				length = all.length;

			while (index < length) {

				var component = all[index++];

				if (!component) {
					index--;
					all.splice(index, 1);
					length = all.length;
					continue;
				}

				var c = component.element;
				if (!component.$removed && c && domx.inDOM(c[0])) {
					//if (!component.attr(ATTRDEL)) {  // TODO
						if (component.$parser && !component.$parser.length)
							component.$parser = undefined;
						if (component.$formatter && !component.$formatter.length)
							component.$formatter = undefined;
						continue;
					//}
				}

				eventer.emit('destroy', component.name, component);
				eventer.emit('component.destroy', component.name, component);

				delete statics['$ST_' + component.name];
				component.destroy && component.destroy();
				$('#css' + component.ID).remove();

				if (c[0].nodeName !== 'BODY') {
					c.off();
					c.find('*').off();
					c.remove();
				}

				component.$main = undefined;
				component.$data = null;
				component.dom = null;
				component.$removed = 2;
				component.path = null;
				component.setter = null;
				component.setter2 = null;
				component.getter = null;
				component.getter2 = null;
				component.make = null;

				index--;
				all.splice(index, 1);
				length = all.length; // M.components.length
				is = true;
			}

			cache.clear("dirty","valid","find");
		}


		return {
			"autofill"  : autofill,
			"cache" : cache,
			"checkLazy" : checkLazy,
			"clean" : clean,
			"components" : components,
			"com_valid" : com_valid,
			"com_validate2" : com_validate2,
			"com_dirty" : com_dirty,
			"each" : each,
			"find"  : find,
			"notify" : notify,
			"prepare" : prepare,
			"reconfigure" : reconfigure,
			"setter" : setter,
			"state" : state,
			"usage" : usage,
			"validate" : validate
		}
	}
	

	return componenter;
});