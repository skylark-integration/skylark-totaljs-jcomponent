define([
	"../langx",
	"../binding/findFormat",
	"../utils/domx",
	"./Usage"
],function(langx, findFormat, domx,Usage){
	var temp = {},
		statics = {},
		$ =domx.$;

	var counter = 0;

	var MD = {
		delay : 555,
		delaywatcher : 555,
		delaybinder : 200		
	};

	// ===============================================================
	// COMPONENT DECLARATION
	// ===============================================================

	var Component = langx.klass({
		_construct(name,view) {
			var self = this;
			self._id = self.ID = 'jc' + (counter++);
			self.usage = new Usage();
			self.$dirty = true;
			self.$valid = true;
			self.$validate = false;
			self.$parser = [];
			self.$formatter = [];
			self.$skip = false;
			self.$ready = false;
			self.$path;
			self.trim = true;
			self.$released = false;
			self.$bindreleased = true;
			self.$data = {};

			var version = name.lastIndexOf('@');

			self.view = view;
			self.storing = view.storing;

			self.name = name;
			self.$name = version === -1 ? name : name.substring(0, version);
			self.version = version === -1 ? '' : name.substring(version + 1);
			self.path;
			self.type;
			self.id;
			self.disabled = false;
			self.removed = false;

			self.make;
			self.done;
			self.prerender;
			self.destroy;
			self.state;
			self.validate;
			self.released;

			self.getter = function(value, realtime, nobind) {

				var self = this;

				value = self.parser(value);
				self.getter2 && self.getter2(value, realtime);

				if (realtime) {
					self.$skip = true;
				}

				// Binds a value
				if (nobind) {
					self.view.componenter.com_validate2(self);
				} else if (value !== self.get()) {
					self.set(value, 2);
				} else if (realtime === 3) {
					// A validation for same values, "realtime=3" is in "blur" event
					// Because we need to validate the input if the user leaves from the control
					self.view.componenter.com_validate2(self);
				}
			};

			self.stateX = function(type, what) {
				var key = type + 'x' + what;
				if (!self.$bindchanges || self.$state !== key) {
					self.$state = key;
					self.config.$state && EXEC.call(self, self.config.$state, type, what);
					self.state(type, what);
				}
			};

			self.setterX = function(value, path, type) {

				if (!self.setter || (self.$bindexact && self.path !== path && self.path.indexOf(path + '.') === -1 && type))
					return;

				var cache = self.$bindcache;
				if (arguments.length) {

					/*
					if (skips[self.path]) {
						var s = --skips[self.path];
						if (s <= 0) {
							delete skips[self.path];
							return;
						}
					}
					*/
					if (self.view.storing.skipDec(self.path) == false) {
						return;
					}

					if (self.$format) {
						value = self.$format(value, path, type);
					}

					if (self.$bindreleased) {

						if (self.$bindchanges) {
							var hash = langx.hashCode(value); // HASH
							if (hash === self.$valuehash)
								return;
							self.$valuehash = hash;
						}

						// Binds value directly
						self.config.$setter && EXEC.call(self, self.config.$setter, value, path, type);
						self.data('', value);
						self.setter(value, path, type);
						self.setter2 && self.setter2(value, path, type);
					} else {
						if (self.$released) {
							cache.is = true;
							cache.value = value;
							cache.path = path;
							cache.type = type;
						} else {
							cache.value = value;
							cache.path = path;
							cache.type = type;
							if (!cache.bt) {
								cache.is = true;
								self.setterX();
							}
						}
					}

				} else if (!self.$released && cache && cache.is) {
					cache.is = false;
					cache.bt && clearTimeout(cache.bt);
					cache.bt = setTimeout(function(self) {
						var cache = self.$bindcache;
						cache.bt = 0; // reset timer id

						if (self.$bindchanges) {
							var hash = langx.hashCode(value); // HASH
							if (hash === self.$valuehash)
								return;
							self.$valuehash = hash;
						}

						self.config.$setter && EXEC.call(self, self.config.$setter, cache.value, cache.path, cache.type);
						self.data('', cache.value);
						self.setter(cache.value, cache.path, cache.type);
						self.setter2 && self.setter2(cache.value, cache.path, cache.type);
					}, self.$bindtimeout, self);
				}
			};

			self.setter = function(value, path, type) {

				var self = this;

				if (type === 2) {
					if (self.$skip) {
						self.$skip = false;
						return;
					}
				}

				var a = 'select-one';
				value = self.formatter(value);

				self.view.helper.findControl(self.element[0], function(t) {

					if (t.$com !== self)
						t.$com = self;

					var path = t.$com.path;
					if (path && path.length && path !== self.path)
						return;

					if (t.type === 'checkbox') {
						var tmp = value != null ? value.toString().toLowerCase() : '';
						tmp = tmp === 'true' || tmp === '1' || tmp === 'on';
						tmp !== t.checked && (t.checked = tmp);
						return;
					}

					if (value == null)
						value = '';

					if (!type && t.type !== a && t.type !== 'range' && !self.$default && !value) {
						self.view.componenter.autofill.push(t.$com);
					}

					if (t.type === a || t.type === 'select') {
						var el = $(t);
						el.val() !== value && el.val(value);
					} else if (t.value !== value)
						t.value = value;
				});
			};
		}

	});


	var PPC = Component.prototype;

	/*
	 * Set or get data from internal component repository. 
	 * Data can be used for data-bind="" attribute and nested j-Components. 
	 */
	PPC.data = function(key, value) {

		if (!key) {
			key = '@';
		}

		var self = this;
		var data = self.$data[key];

		if (arguments.length === 1) {
			return data ? data.value : null;
		}

		if (data) {
			data.value = value;
			for (var i = 0; i < data.items.length; i++) {
				var o = data.items[i];
				o.el[0].parentNode && o.exec(value, key);
			}
		} else {
			self.$data[key] = { 
				value: value, 
				items: [] 
			};
		}

		if (self.$ppc) {
			var c = self.view.components.all; //M.components;
			for (var i = 0; i < c.length; i++) {
				var com = c[i];
				if (com.owner === self && com.$pp && key === com.path)
					com.setterX(value, value, 2);
			}
		}

		return value;
	};

	/*
	 * 
	 */
	PPC.$except = function(except) {
		var p = self.$path;
		for (var a = 0; a < except.length; a++) {
			for (var b = 0; b < p.length; b++) {
				if (except[a] === p[b]) {
					return true;
				}
			}
		}
		return false;
	};

	/*
	 * 
	 */
	PPC.$compare = function(path, fix) {
		var self = this;

		if (fix)
			return self.path === path;

		if (path.length > self.path.length) {
			var index = path.lastIndexOf('.', self.path.length);
			return index === -1 ? false : self.path === path.substring(0, index);
		}

		for (var i = 0, length = self.$path.length; i < length; i++) {
			if (self.$path[i] === path) {
				return true;
			}
		}
	};

	/*
	 * Removes waiter.
	 */
	function removewaiter(obj) {
		if (obj.$W) {
			var keys = Object.keys(obj.$W);
			for (var i = 0, length = keys.length; i < length; i++) {
				var v = obj.$W[keys[i]];
				if (v.id) {
					clearInterval(v.id);
				}
			}
		}
	}

	/*
	 * 
	 */
	PPC.notmodified = function(fields) {
		var t = this;
		if (langx.isString(fields)) {
			fields = [fields];
		}
		return NOTMODIFIED(t._id, t.get(), fields);
	};

	/*
	 * 
	 */
	PPC.$waiter = function(prop, callback) {

		var t = this;

		if (prop === true) {
			if (t.$W) {
				var keys = Object.keys(t.$W);
				for (var i = 0; i < keys.length; i++) {
					var k = keys[i];
					var o = t.$W[k];
					o.id = setInterval(function(t, prop) {
						var o = t.$W[prop];
						var v = t[prop]();
						if (v) {
							clearInterval(o.id);
							for (var i = 0; i < o.callback.length; i++)
								o.callback[i].call(t, v);
							delete t.$W[prop];
						}
					}, MD.delaywatcher, t, k);
				}
			}
			return;
		} else if (prop === false) {
			if (t.$W) {
				var keys = Object.keys(t.$W);
				for (var i = 0; i < keys.length; i++) {
					var a = t.$W[keys[i]];
					a && clearInterval(a.id);
				}
			}
			return;
		}

		!t.$W && (t.$W = {});

		if (t.$W[prop]) {
			// Checks if same callback exists
			for (var i = 0; i < t.$W[prop].length; i++) {
				if (t.$W[prop][i] === callback)
					return t;
			}
			t.$W[prop].callback.push(callback);
			return t;
		} else
			t.$W[prop] = { callback: [callback] };

		if (!t.$released) {
			t.$W[prop].id = setInterval(function(t, prop) {
				var o = t.$W[prop];
				var v = t[prop]();
				if (v) {
					clearInterval(o.id);
					for (var i = 0; i < o.callback.length; i++) {
						o.callback[i].call(t, v);
					}
					delete t.$W[prop];
				}
			}, MD.delaywatcher, t, prop);
		}
		return t;
	};

	/*
	 * .
	 */
	PPC.hidden = function(callback) {
		var t = this;
		var v = t.element ? t.element[0].offsetParent : null;
		v = v === null;
		if (callback) {
			if (v) {
				callback.call(t);
			} else {
				t.$waiter('hidden', callback);
			}
		}
		return v;
	};

	/*
	 * 
	 */
	PPC.visible = function(callback) {
		var t = this;
		var v = t.element ? t.element[0].offsetParent : null;
		v = v !== null;
		if (callback) {
			if (v) {
				callback.call(t);
			} else {
				t.$waiter('visible', callback);
			}
		}
		return v;
	};

	/*
	 * 
	 */
	PPC.width = function(callback) {
		var t = this;
		var v = t.element ? t.element[0].offsetWidth : 0;
		if (callback) {
			if (v) {
				callback.call(t, v);
			} else {
				t.$waiter('width', callback);
			}
		}
		return v;
	};

	/*
	 * 
	 */
	PPC.height = function(callback) {
		var t = this;
		var v = t.element ? t.element[0].offsetHeight : 0;
		if (callback) {
			if (v) {
				callback.call(t, v);
			} else {
				t.$waiter('height', callback);
			}
		}
		return v;
	};

	/*
	 * Import some content from external source to this element.
	 */
	PPC.import = function(url, callback, insert, preparator) {
		var self = this;
		this.view.import(url, self.element, callback, insert, preparator);
		return self;
	};

	/*
	 * Performs release state for all nested components.
	 */
	PPC.release = function(value, container) {

		var self = this;
		if (value === undefined || self.$removed) {
			return self.$released;
		}

		self.attrd('jc-released', value);

		//(container || self.element).find(consts.ATTRCOM).each(function() {
		self.view.helper.nested(container || self.element).forEach(function(){ 
			var el = $(this);
			el.attrd('jc-released', value ? 'true' : 'false');
			var com = el[0].$com;
			if (com instanceof Object) {
				if (com instanceof Array) {
					for (var i = 0, length = com.length; i < length; i++) {
						var o = com[i];
						if (!o.$removed && o.$released !== value) {
							o.$released = value;
							o.released && o.released(value, self);
							o.$waiter(!value);
							!value && o.setterX();
						}
					}
				} else if (!com.$removed && com.$released !== value) {
					com.$released = value;
					com.released && com.released(value, self);
					com.$waiter(!value);
					!value && com.setterX();
				}
			}
		});

		if (!container && self.$released !== value) {
			self.$released = value;
			self.released && self.released(value, self);
			self.$waiter(!value);
			!value && self.setterX();
		}

		return value;
	};

	/*
	 * Performs validation with refreshing state of component
	 */
	PPC.validate2 = function() {
		return com_validate2(this);
	};

	/*
	 * Returns all nested components.
	 */
	PPC.exec = function(name, a, b, c, d, e) {
		var self = this;
		/*
		self.find(consts.ATTRCOM).each(function() {
			var t = this;
			if (t.$com) {
				t.$com.caller = self;
				t.$com[name] && this.$com[name](a, b, c, d, e);
			}
		});
		*/

		return self;
	};

	/*
	 * Returns all nested components.
	 */
	PPC.replace = function(el, remove) {
		var self = this;

		if (this.view.compiler.is) {
			this.view.compiler.recompile = true;
		}

		var n = 'jc-scope';
		var prev = self.element;
		var scope = prev.attrd(n);

		self.element.rattrd('jc');
		self.element[0].$com = null;
		scope && self.element.rattrd(n);

		if (remove) {
			prev.off().remove();
		} else {
			self.attrd('jc-replaced', 'true');
		}

		self.element = $(el);
		self.dom = self.element[0];
		self.dom.$com = self;
		self.attrd('jc', self.name);
		if (scope) {
			self.attrd(n, scope);
		}
		self.siblings = false;
		return self;
	};

	//PPC.compile 

	/*
	 * Returns all nested components.
	 */
	PPC.nested = function() {
		return self.view.helper.nested(this.element);

		/*
		var arr = [];
		this.find(ATTRCOM).each(function() {
			var el = $(this);
			var com = el[0].$com;
			if (com && !el.attr(ATTRDEL)) {
				if (com instanceof Array)
					arr.push.apply(arr, com);
				else
					arr.push(com);
			}
		});
		return arr;
		*/
	};

	/*
	 * Sets the last interaction time,time will be stored in self.usage.
	 */
	PPC.$interaction = function(type) {

		// type === 0 : init
		// type === 1 : manually
		// type === 2 : by input
		// type === 3 : by default
		// type === 100 : custom
		// type === 101 : dirty
		// type === 102 : valid

		var now = Date.now();
		var t = this;

		switch (type) {
			case 0:
				t.usage.init = now;
				t.$binded = true;
				break;
			case 1:
				t.usage.manually = now;
				t.$binded = true;
				break;
			case 2:
				t.usage.input = now;
				t.$binded = true;
				break;
			case 3:
				t.usage.default = now;
				t.$binded = true;
				break;
			case 100:
				t.usage.custom = now;
				break;
			case 101:
				t.usage.dirty = now;
				break;
			case 102:
				t.usage.valid = now;
				break;
		}

		return t;
	};

	/*
	 * Notifies a setter in all components according to the component.path.
	 */
	PPC.notify = function() {
		NOTIFY(this.path);
		return this;
	};

	/*
	 * Executes the component.setter with a refreshed value according to the component.path.
	 */
	PPC.update = PPC.refresh = function(notify, type) {
		var self = this;
		if (self.$binded) {

			if (langx.isString(notify)) {
				type = notify;
				notify = true;
			}

			if (notify) {
				self.set(self.get(), type);
			} else {
				if (self.setter) {
				 self.setterX(self.get(), self.path, 1);
				}
				self.$interaction(1);
			}
		}
		return self;
	};

	/*
	 * Toggles class, it's alias for self.element.toggleClass().
	 */
	PPC.tclass = function(cls, v) {
		var self = this;
		self.element.tclass(cls, v);
		return self;
	};

	/*
	 * Adds CSS class into the element classes., it's alias for self.element.addClass().
	 */
	PPC.aclass = function(cls, timeout) {
		var self = this;
		if (timeout) {
			setTimeout(function() { self.element.aclass(cls); }, timeout);
		} else {
			self.element.aclass(cls);
		}
		return self;
	};

	/*
	 * Determines class, it's alias for self.element.hasClass().
	 */
	PPC.hclass = function(cls) {
		return this.element.hclass(cls);
	};

	/*
	 * Removes class, it's alias for self.element.removeClass().
	 */
	PPC.rclass = function(cls, timeout) {
		var self = this;
		var e = self.element;
		if (timeout)
			setTimeout(function() { e.rclass(cls); }, timeout);
		else {
			if (cls) {
				e.rclass(cls);
			} else {
				e.rclass();
			}
		}
		return self;
	};

	/*
	 *  Removes classes according to the text to search.
	 */
	PPC.rclass2 = function(search) {
		this.element.rclass2(search);
		return this;
	};

	/*
	 * Add or remove CSS classes.
	 */
	PPC.classes = function(cls) {

		var key = 'cls.' + cls;
		var tmp = temp[key]; // caches.temp[key];
		var t = this;
		var e = t.element;

		if (tmp) {
			tmp.add && e.aclass(tmp.add);
			tmp.rem && e.rclass(tmp.rem);
			return t;
		}

		var arr = cls instanceof Array ? cls : cls.split(' ');
		var add = '';
		var rem = '';

		for (var i = 0, length = arr.length; i < length; i++) {
			var c = arr[i].substring(0, 1);
			if (c === '-')
				rem += (rem ? ' ' : '') + arr[i].substring(1);
			else
				add += (add ? ' ' : '') + (c === '+' ? arr[i].substring(1) : arr[i]);
		}

		if (add) {
			e.aclass(add);
		}
		if (rem) {
			e.rclass(rem);
		}

		if (cls instanceof Array) {
			return t;
		}

		temp[key] = { add: add, rem: rem };  // caches.temp[key] = { add: add, rem: rem }; 
		return t;
	};

	/*
	 * Returns a parent component instance if exists (otherwise: null).
	 */
	PPC.toggle = function(cls, visible, timeout) {

		var manual = false;
		var self = this;

		if (!langx.isString(cls)) {
			timeout = visible;
			visible = cls;
			cls = 'hidden';
			manual = true;
		}

		if (langx.isNumber(visible)) {
			timeout = visible;
			visible = undefined;
		} else if (manual && visible !== undefined) {
			visible = !visible;
		}

		var el = self.element;
		if (!timeout) {
			el.tclass(cls, visible);
			return self;
		}

		setTimeout(function() {
			el.tclass(cls, visible);
		}, timeout);
		return self;
	};

	/*
	 * Disables scopes according to the data-jc-scope attribute.
	 */
	PPC.noscope = PPC.noScope = function(value) {
		var self = this;
		self.$noscope = value === undefined ? true : value === true;
		return self;
	};

	/*
	 * Returns a parent component instance if exists (otherwise: null).
	 */
	PPC.nocompile = function() {
		var self = this;
		self.element.attrd('jc-compile', '0');
		return self;
	};

	/*
	 * Creates a single instance of the component. 
	 * So if the component will be declared multiple times then jComponent creates the only one instance and 
	 * another declarations will be skipped.
	 */
	PPC.singleton = function() {
		var self = this;
		statics['$ST_' + self.name] = true;
		return self;
	};

	/*
	 * Sets the component as blind.
	 * Component will be skipped when jComponent performs data-binding. 
	 * If your component won't work with data-binding then this option can increase a performance of your web app.
	 */
	PPC.blind = function() {
		var self = this;
		self.path = null;
		self.$path = null;
		self.$$path = null;
		return self;
	};

	/*
	 * Binds changes only. 
	 * If setter will get the same value as a previous value then skips binding.
	 */
	PPC.bindchanges = PPC.bindChanges = function(enable) {
		this.$bindchanges = enable == null || enable === true;
		return this;
	};

	/*
	 * Sets binding of values when the the modification path is same as the component path or the path is part of parent path.
	 */
	PPC.bindexact = PPC.bindExact = function(enable) {
		this.$bindexact = enable == null || enable === true;
		return this;
	};

	/*
	 * Sets binding of values only when the component is not released.
	 * it depends on releasing of the parent component.
	 */
	PPC.bindvisible = PPC.bindVisible = function(timeout) {
		var self = this;
		self.$bindreleased = false;
		self.$bindtimeout = timeout || MD.delaybinder;
		self.$bindcache = {};
		return self;
	};

	/*
	 * Enables readonly mode for the component.
	 * It disables dirty and valid states, getter, setter, parsers and formatters. 
	 * This option can improve performance.
	 */
	PPC.readonly = function() {
		var self = this;
		self.noDirty();
		self.noValid();
		self.getter = null;
		self.setter = null;
		self.$parser = null;
		self.$formatter = null;
		return self;
	};

	/*
	 * Returns a parent component instance if exists (otherwise: null).
	 */
	PPC.novalidate = PPC.noValid = PPC.noValidate = function(val) {
		if (val === undefined) {
			val = true;
		}
		var self = this;
		self.$valid_disabled = val;
		self.$valid = val;
		return self;
	};

	/*
	 * Returns a parent component instance if exists (otherwise: null).
	 */
	PPC.nodirty = PPC.noDirty = function(val) {
		if (val === undefined) {
			val = true;
		}
		var self = this;
		self.$dirty_disabled = val;
		self.$dirty = !val;
		return self;
	};

	/*
	 * Watch some additional data-source.
	 * Each next declaration of self.datasource() cancels previous declaration.
	 */
	PPC.datasource = function(path, callback, init) {
		var self = this;
		var ds = self.$datasource;

		ds && self.unwatch(ds.path, ds.fn);

		if (path) {
			self.$datasource = { path: path, fn: callback };
			self.watch(path, callback, init !== false);
		} else
			self.$datasource = null;

		return self;
	};

	/*
	 * Rewrites component.path.
	 */
	PPC.setPath = function(path, type) {

		// type 1: init
		// type 2: scope

		var self = this;
		var tmp = findFormat(path);

		if (tmp) {
			path = tmp.path;
			self.$format = tmp.fn;
		} else if (!type) {
			self.$format = null;
		}

		var arr = [];

		if (path.substring(0, 1) === '@') {
			path = path.substring(1);
			self.$pp = true;
			self.owner.$ppc = true;
		} else {
			self.$pp = false;
		}

		// Temporary
		if (path.charCodeAt(0) === 37) { // %
			path = 'jctmp.' + path.substring(1);
		}

		path = path.env();

		// !path = fixed path
		if (path.charCodeAt(0) === 33) { // !
			path = path.substring(1);
			arr.push(path);
		} else {
			var p = path.split('.');
			var s = [];
			for (var j = 0; j < p.length; j++) {
				var b = p[j].lastIndexOf('[');
				if (b !== -1) {
					var c = s.join('.');
					arr.push(c + (c ? '.' : '') + p[j].substring(0, b));
				}
				s.push(p[j]);
				arr.push(s.join('.'));
			}
		}

		self.path = path;
		self.$path = arr;
		
		if (type !== 1 && C.ready) {
			refresh(); // TODO
		}
		return self;
	};

	/*
	 * Get/set a value into the element attribute, it's alias for self.element.attr(name, [value]).
	 */
//	PPC.attr = SCP.attr = function(name, value) {
	PPC.attr = function(name, value) {
		var el = this.element;
		if (value === undefined) {
			return el.attr(name);
		}
		el.attr(name, value);
		return this;
	};

	/*
	 * Get/set a value into the element attribute with data- prefix for name of attribute.
	 * it's alias for self.element.attr(name, [value]).
	 */
//	PPC.attrd = SCP.attrd = function(name, value) {
	PPC.attrd = function(name, value) {
		name = 'data-' + name;
		var el = this.element;
		if (value === undefined) {
			return el.attr(name);
		}
		el.attr(name, value);
		return this;
	};

	/*
	 * Sets css or get, it's alias for self.element.css(name, [value]).
	 */
//	PPC.css = SCP.css = function(name, value) {
	PPC.css = function(name, value) {
		var el = this.element;
		if (value === undefined) {
			return el.css(name);
		}
		el.css(name, value);
		return this;
	};

	/*
	 * Returns a parent component instance if exists (otherwise: null).
	 */
//	PPC.main = SCP.main = function() {
	PPC.main = function() {
		var self = this;
		if (self.$main === undefined) {
			var tmp = self.parent().closest('[data-jc]')[0];
			self.$main = tmp ? tmp.$com : null;
		}
		return self.$main;
	};

	PPC.rcwatch = function(path, value) {
		return value ? this.reconfigure(value) : this;
	};

	PPC.reconfigure = function(value, callback, init) {
		var self = this;
		if (langx.isPlainObject(value)) {
			Object.keys(value).forEach(function(k) {
				var prev = self.config[k];
				if (!init && self.config[k] !== value[k])
					self.config[k] = value[k];
				if (callback) {
					callback(k, value[k], init, init ? undefined : prev);
				} else if (self.configure) {
					self.configure(k, value[k], init, init ? undefined : prev);
				}
				self.data('config.' + k, value[k]);
			});
		} else if (value.substring(0, 1) === '=') {
			value = value.substring(1);
			if (self.watch) {
				self.$rcwatch && self.unwatch(self.$rcwatch, self.rcwatch);
				self.watch(value, self.rcwatch);
				self.$rcwatch = value;
			}
			self.reconfigure(get(value), callback, init);
		} else {
			value.$config(function(k, v) {
				var prev = self.config[k];
				if (!init && self.config[k] !== v)
					self.config[k] = v;
				self.data('config.' + k, v);
				if (callback) {
					callback(k, v, init, init ? undefined : prev);
				} else if (self.configure) {
					self.configure(k, v, init, init ? undefined : prev);
				}
			});
		}

		var cfg = self.config;

		self.data('config', cfg);

		if (cfg.$type) {
			self.type = cfg.$type;
		}

		if (cfg.$id) {
			self.id = cfg.$id;
		}

		if (cfg.$compile == false) {
			self.nocompile();
		}

		if (cfg.$init) {
			self.$init = cfg.$init;
		}

		if (cfg.$class) {
			self.tclass(cfg.$class);
		}
		
		if (cfg.$released) {
			self.release(cfg.$released == true);
		}
		
		if (cfg.$reconfigure) {
			EXEC.call(cfg.$reconfigure, cfg); // TODO
		}
		return self;
	};

//	PPC.closest = SCP.closest = function(sel) {
	PPC.closest = function(sel) {
		return this.element.closest(sel);
	};

//	PPC.parent = SCP.parent = function(sel) {
	PPC.parent = function(sel) {
		return this.element.parent(sel);
	};

	var TNB = { number: 1, boolean: 1 };

	PPC.html = function(value) {
		var el = this.element;
		if (value === undefined) {
			return el.html();
		}
		if (value instanceof Array) {
			value = value.join('');
		}
		var type = typeof(value);
		//caches.current.element = el[0];
		var v = (value || TNB[type]) ? el.empty().append(value) : el.empty();
		//caches.current.element = null;
		return v;
	};

	/*
	 * This method is alias for self.element.text(), it can set/get a content of the element.
	 */
	PPC.text = function(value) {
		var el = this.element;
		if (value === undefined) {
			return el.text();
		}
		if (value instanceof Array) {
			value = value.join('');
		}
		var type = typeof(value);
		return (value || TNB[type]) ? el.empty().text(value) : el.empty();
	};


	/*
	 * Removes the whole content of element and important removes all components which the parent component is this component.
	 * It is alias for self.element.empty()
	 */
	PPC.empty = function() {

		var self = this;

		if (self.$children) {
			for (var i = 0, length = all.length; i < length; i++) { // M.components.length
				var m = all[i]; //M.components[i];
				!m.$removed && m.owner === self && m.remove();
			}
			self.$children = 0;
		}

		var el = self.element;
		el.empty();
		return el;
	};

//	PPC.append = SCP.append = function(value) {
	PPC.append = function(value) {
		var el = this.element;
		if (value instanceof Array) {
			value = value.join('');
		}
		//caches.current.element = el[0];
		var v = value ? el.append(value) : el;
		//caches.current.element = null;
		return v;
	};

	/*
	 * Registers a new event for the element. Is alias for self.element.on() method.
	 */
//	PPC.event = SCP.event = function() {
	PPC.event = function() {
		var self = this;
		if (self.element) {
			self.element.on.apply(self.element, arguments);
		} else {
			setTimeout(function(arg) {
				self.event(self, arg);
			}, 500, arguments);
		}
		return self;
	};

	/*
	 * Finds elements according to the selector. Is alias for self.element.find() method.
	 */
//	PPC.find = SCP.find = function(selector) {
	PPC.find =  function(selector) {
		return this.element.find(selector);
	};


	/*
	 * Checks a state whether the component is invalid or valid.
	 */
	PPC.isInvalid = function() {
		var self = this;
		var is = !self.$valid;
		if (is && !self.$validate) {
			is = !self.$dirty;
		}
		return is;
	};

	/*
	 * Unregisters a monitoring of value according to the path argument.
	 */
	PPC.unwatch = function(path, fn) {
		var self = this;
		self.view.eventer.off('com' + self._id + '#watch', path, fn);  // OFF
		return self;
	};

	/*
	 * Registers a monitoring of value according to the path argument.
	 */
	PPC.watch = function(path, fn, init) {

		var self = this;

		if (langx.isFunction(path)) {
			init = fn;
			fn = path;
			path = self.path;
		} else {
			path = pathmaker(path);
		}

		self.on('watch', path, fn, init);
		return self;
	};

	/*
	 * Sets the state of this component to invalid and it contacts all components listen on the path.
	 */
	PPC.invalid = function() {
		return this.storing.invalid(this.path, this);
	};

	PPC.valid = function(value, noEmit) {

		var self = this;

		if (value === undefined) {
			return self.$valid;
		}

		if (self.$valid_disabled) {
			return self;
		}

		self.$valid = value;
		self.$validate = false;
		self.$interaction(102);
		
		self.view.componenter.cache.clear('valid');
		
		if (!noEmit && self.state) {
			self.stateX(1, 1);
		}
		return self;
	};

	PPC.style = function(value) {
		domx.style(value, this._id);
		return this;
	};


	/*
	 * Perform a change state. It changes dirty state and contacts all components which listen on path.
	 */
	PPC.change = function(value) {
		var self = this;
		self.$dirty_disabled = false;
		self.$dirty = true;
		self.storing.change(self.path, value === undefined ? true : value, self);
		return self;
	};

	/*
	 * Sets the last used time, time will be stored in self.usage.custom.
	 */
	PPC.used = function() {
		return this.$interaction(100);
	};

	/*
	 * Sets the last used time, time will be stored in self.usage.custom.
	 */
	PPC.dirty = function(value, noEmit) {

		var self = this;

		if (value === undefined) {
			return self.$dirty;
		}

		if (self.$dirty_disabled) {　
			return self;
		}

		self.$dirty = value;
		self.$interaction(101);
		self.view.componenter.cache.clear('dirty');
		if (!noEmit && self.state) {
			self.stateX(2, 2);
		}
		return self;
	};


	/*
	 * Resets dirty and valid state.
	 */
	PPC.reset = function() {
		var self = this;
		self.storing.reset(self.path, 0, self);
		return self;
	};

	PPC.setDefault = function(value) {
		this.$default = function() {
			return value;
		};
		return this;
	};

	/*
	 * Set a default value for the current component path.
	 */
	PPC.default = function(reset) {
		var self = this;
		self.storing.default(self.path, 0, self, reset);
		return self;
	};


	/*
	 * Removes this component from the DOM and executes destroy delegate.
	 */
	PPC.remove = PPC.kill = function(noClear) {
		var self = this;
		var el = self.element;
		removewaiter(self);
		
		//el.removeData(ATTRDATA);
		//el.attr(ATTRDEL, 'true').find(ATTRCOM).attr(ATTRDEL, 'true');
		self.view.helper.kill(el);

		self.$removed = 1;
		self.removed = true;
		self.view.eventer.off('com' + self._id + '#'); // OFF
		
		if(!noClear) {
			langx.setTimeout2('$cleaner', cleaner2, 100);
		}
		return true;
	};

	PPC.isRemoved = function() {

	};

	PPC.on = function(name, path, fn, init) {
		if (langx.isFunction(path)) {
			init = fn;
			fn = path;
			path = '';
		} else
			path = path.replace('.*', '');

		var self = this;
		var push = '';

		if (name.substring(0, 1) === '^') {
			push = '^';
			name = name.substring(1);
		}

		self.view.eventer.on(push + 'com' + self._id + '#' + name, path, fn, init, self); // ON
		return self;
	};

	/*
	 * Register a new formatter for this component or can format a value.
	 */
	PPC.formatter = function(value, prepend) {
		var self = this;

		if (langx.isFunction(value)) {
			!self.$formatter && (self.$formatter = []);
			if (prepend === true) {
				self.$formatter.unshift(value);
			} else {
				self.$formatter.push(value);
			}
			return self;
		}

		var a = self.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(self, self.path, value, self.type);
			}
		}

		/*
		a = M.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(self, self.path, value, self.type);
			}
		}*/

		value = self.storing.format(value,self.path,self.type); // TODO

		return value;
	};

	PPC.parser = function(value, prepend) {

		var self = this;
		var type = typeof(value);

		if (type === 'function') {
			!self.$parser && (self.$parser = []);

			if (prepend === true) {
				self.$parser.unshift(value);
			} else {
				self.$parser.push(value);
			}

			return self;
		}

		if (self.trim && type === 'string') {
			value = value.trim();
		}

		var a = self.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(self, self.path, value, self.type);
			}
		}


		//a = jc.$parser;
		//if (a && a.length) {
		//	for (var i = 0, length = a.length; i < length; i++) {
		//		value = a[i].call(self, self.path, value, self.type);
		//	}
		//}
		value = self.storing.parser(value,self.path,self.type);

		return value;
	};

	/*
	 * Emits an event within jComponent. Is alias for EMIT() method.
	 */
	PPC.emit = function() {
		self.view.eventer.emit.apply(self.view.eventer, arguments); // W>EMIT
		return this;
	};

	PPC.evaluate = function(path, expression, nopath) {
		if (!expression) {
			expression = path;
			path = this.path;
		}
		return self.storing.evaluate(path, expression, nopath);
	};

	/*
	 * Get a value according to the data-jc-path or path.
	 */
	PPC.get = function(path) {
		var self = this;
		if (!path) {
			path = self.path;
		}

		if (self.$pp) {
			return self.owner.data(self.path);
		}

		if (path) {
			return self.storing.get(path);
		}
	};

	PPC.skip = function(path) {
		var self = this;
		self.storing.skip(path || self.path); // SKIP
		return self;
	};

	/*
	 * Sets a value according to the component.path.
	 */
	PPC.set = function(value, type) {

		var self = this;
		var arg = arguments;

		if (self.$pp) {
			self.owner.set(self.path, value);
			return self;
		}

		// Backwards compatibility
		if (arg.length === 3) {
			self.storing.setx(arg[0], arg[1], arg[2]);
		} else {
			self.storing.setx(self.path, value, type);
		}

		return self;
	};

	/*
	 * Increments a Number according to the component.path.
	 */
	PPC.inc = function(value, type) {
		var self = this;
		self.storing.inc(self.path, value, type);
		return self;
	};

	/* 
	 * Extends a current value by adding/rewrite new fields with new values.
	 */
	PPC.extend = function(value, type) {
		var self = this;
		self.storing.extend(self.path, value, type); // M.extend
		return self;
	};

	/*
	 * Rewrites a value according to the component.path and it won't notify all listeners.
	 */
	PPC.rewrite = function(value) {
		var self = this;
		self.storing.rewrite(self.path, value);
		return self;
	};

	/*
	 * Pushs a new item into the Array according to the component.path.
	 */
	PPC.push = function(value, type) {
		var self = this;
		self.storing.push(self.path, value, type);
		return self;
	};

	// Component
	PPC.compile = function(container) {
		var self = this;
		!container && self.attrd('jc-compile') && self.attrd('jc-compile', '1');
		this.view.compile(container || self.element);
		return self;
	};

	return Component;
});