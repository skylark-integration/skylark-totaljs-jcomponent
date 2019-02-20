define([
	"./jc",
	"./defaults",
	"./langx",
	"./caches",
	"./http",
	"./plugins",
	"./Component",
	"./paths",
	"./views"
],function(jc, defaults, langx, caches, http,plugins,Component,paths,views){
	var M = jc,
		MD = defaults;
		extensions = Component.extensions,
		components = views.components,

		C = jc.compiler = {}; // var C = {}; // COMPILER

	var toggles = [];
    
	C.is = false;
	C.recompile = false;
	C.importing = 0;
	C.pending = [];
	C.init = [];
	C.imports = {};
	C.ready = [];

	C.get = get; // paths

	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================
	var blocked = {};
	var fallback = { $: 0 }; // $ === count of new items in fallback
	var fallbackpending = [];
	var $ready = setTimeout(load, 2);
	var $loaded = false;


   /**
   * Lock some code for a specific time. 
   * This method will paths info about blocking in localStorage if the expiration is longer than 10 seconds.
   * @param  {String} name   
   * @param  {Number} timeout 
   * @param  {Function} callback  
   */
	function block(name, timeout, callback) { //W.BLOCKED = 
		var key = name;
		var item = blocked[key];
		var now = Date.now();

		if (item > now) {
			return true;
		}

		if (langx.isString(timeout)) {
			timeout = timeout.env().parseExpire();
		}

		var local = MD.localstorage && timeout > 10000;
		blocked[key] = now + timeout;
		if (!M.isPRIVATEMODE && local) { // W.isPRIVATEMODE
		  localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));
		}
		callback && callback();
		return false;
	};

	function downloadfallback() {
		if (C.importing) {
			setTimeout(downloadfallback, 1000);
		} else {
			langx.setTimeout2('$fallback', function() {
				fallbackpending.splice(0).wait(function(item, next) {
					if (Component.registry[item]) // M.$components
						next();
					else {
						warn('Downloading: ' + item);
						http.importCache(MD.fallback.format(item), MD.fallbackcache, next);
					}
				}, 3);
			}, 100);
		}
	}

	function initialize() {
		var item = C.init.pop();
		if (item === undefined)
			!C.ready && compile();
		else {
			!item.$removed && prepare(item);
			initialize();
		}
	}

	function nextpending() {

		var next = C.pending.shift();
		if (next)
			next();
		else if ($domready) {

			if (C.ready)
				C.is = false;

			if (MD.fallback && fallback.$ && !C.importing) {
				var arr = Object.keys(fallback);
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] !== '$') {
						var num = fallback[arr[i]];
						if (num === 1) {
							fallbackpending.push(arr[i].toLowerCase());
							fallback[arr[i]] = 2;
						}
					}
				}
				fallback.$ = 0;
				fallbackpending.length && downloadfallback();
			}
		}
	}

	function prepare(obj) {

		if (!obj)
			return;

		var el = obj.element;

		extensions[obj.name] && extensions[obj.name].forEach(function(item) {
			item.config && obj.reconfigure(item.config, NOOP);
			item.fn.call(obj, obj, obj.config);
		});

		var value = obj.get();
		var tmp;

		obj.configure && obj.reconfigure(obj.config, undefined, true);
		obj.$loaded = true;

		if (obj.setter) {
			if (!obj.$prepared) {

				obj.$prepared = true;
				obj.$ready = true;

				tmp = attrcom(obj, 'value');

				if (tmp) {
					if (!defaults[tmp])
						defaults[tmp] = new Function('return ' + tmp);
					obj.$default = defaults[tmp];
					if (value === undefined) {
						value = obj.$default();
						set(obj.path, value);
						emitwatch(obj.path, value, 0);
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
		} else
			obj.$binded = true;

		if (obj.validate && !obj.$valid_disabled)
			obj.$valid = obj.validate(obj.get(), true);

		obj.done && setTimeout(obj.done, 20);
		obj.state && obj.stateX(0, 3);

		obj.$init && setTimeout(function() {
			var fn = get(obj.$init);
			if (langx.isFunction(fn)) {
				fn.call(obj, obj);	
			} 
			obj.$init = undefined;
		}, 5);

		var n = 'component';
		el.trigger(n);
		el.off(n);

		var cls = attrcom(el, 'class');
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

		obj.id && EMIT('#' + obj.id, obj);
		EMIT('@' + obj.name, obj);
		EMIT(n, obj);
		clear('find.');
		if (obj.$lazy) {
			obj.$lazy.state = 3;
			delete obj.$lazy;
			EMIT('lazy', obj.$name, false);
		}
	}


	function ready() {

		langx.setTimeout2('$ready', function() {

			mediaquery();
			components.refresh();
			initialize();

			var count = components.length; // M.components
			$(document).trigger('components', [count]);

			if (!$loaded) {
				$loaded = true;
				caches.clear('valid', 'dirty', 'find');
				topic.emit('init');
				topic('ready');
			}

			langx.setTimeout2('$initcleaner', function() {
				components.cleaner();
				var arr = autofill.splice(0);
				for (var i = 0; i < arr.length; i++) {
					var com = arr[i];
					!com.$default && findcontrol(com.element[0], function(el) {
						var val = $(el).val();
						if (val) {
							var tmp = com.parser(val);
							if (tmp && com.get() !== tmp) {
								com.dirty(false, true);
								com.set(tmp, 0);
							}
						}
						return true;
					});
				}
			}, 1000);

			C.is = false;

			if (C.recompile) {
				C.recompile = false;
				compile();
			}

			if (C.ready) {
				var arr = C.ready;
				for (var i = 0, length = arr.length; i < length; i++)
					arr[i](count);
				C.ready = undefined;
				compile();
				setTimeout(compile, 3000);
				setTimeout(compile, 6000);
				setTimeout(compile, 9000);
			}
		}, 100);
	}


	var lazycom = {};


	function dependencies(declaration, callback, obj, el) {

		if (declaration.importing) {
			WAIT(function() {
				return declaration.importing !== true;
			}, function() {
				callback(obj, el);
			});
			return;
		}

		if (!declaration.dependencies || !declaration.dependencies.length) {
			setTimeout(function(callback, obj, el) {
				callback(obj, el);
			}, 5, callback, obj, el);
			return;
		}

		declaration.importing = true;
		declaration.dependencies.wait(function(item, next) {
			if (langx.isFunction(item)) {
				item(next);
			} else {
				IMPORT((item.indexOf('<') === -1 ? 'once ' : '') + item, next);
			}
		}, function() {
			declaration.importing = false;
			callback(obj, el);
		}, 3);
	}
	

	function download() {

		var arr = [];
		var count = 0;

		$(ATTRURL).each(function() {

			var t = this;
			var el = $(t);

			if (t.$downloaded)
				return;

			t.$downloaded = 1;
			var url = attrcom(el, 'url');

			// Unique
			var once = url.substring(0, 5).toLowerCase() === 'once ';
			if (url.substring(0, 1) === '!' || once) {
				if (once) {
					url = url.substring(5);
				} else {
					url = url.substring(1);
				}
				if (statics[url]) {
					return;
				}
				statics[url] = 2;
			}

			var item = {};
			item.url = url;
			item.element = el;
			item.callback = attrcom(el, 'init');
			item.path = attrcom(el, 'path');
			item.toggle = (attrcom(el, 'class') || '').split(' ');
			item.expire = attrcom(el, 'cache') || MD.importcache;
			arr.push(item);
		});

		if (!arr.length) {
			return;
		}

		var canCompile = false;
		C.importing++;

		async(arr, function(item, next) {

			var key = makeurl(item.url);
			var can = false;

			AJAXCACHE('GET ' + item.url, null, function(response) {

				key = '$import' + key;

				caches.current.element = item.element[0];

				if (statics[key]) {
					response = removescripts(response);
				} else {
					response = importscripts(importstyles(response));
				}

				can = response && REGCOM.test(response);

				if (can) {
					canCompile = true;
				}

				item.element.html(response);
				statics[key] = true;
				item.toggle.length && item.toggle[0] && toggles.push(item);

				if (item.callback && !attrcom(item.element)) {
					var callback = get(item.callback);
					typeof(callback) === TYPE_FN && callback(item.element);
				}

				caches.current.element = null;
				count++;
				next();

			}, item.expire);

		}, function() {
			C.importing--;
			clear('valid', 'dirty', 'find');
			count && canCompile && compile();
		});
	}


	function compile(container,immediate) {

		if (C.is) {
			C.recompile = true;
			return;
		}

		var arr = [];

		W.READY instanceof Array && arr.push.apply(arr, W.READY);
		W.jComponent instanceof Array && arr.push.apply(arr, W.jComponent);
		W.components instanceof Array && arr.push.apply(arr, W.components);

		if (arr.length) {
			while (true) {
				var fn = arr.shift();
				if (!fn){
					break;
				}
				fn();
			}
		}

		C.is = true;
		download();

		if (C.pending.length) {
			(function(container) {
				C.pending.push(function() {
					compile(container);
				});
			})(container);
			return;
		}

		var has = false;

		crawler(container, function(name, dom, level, scope) {

			var el = $(dom);
			var meta = name.split(REGMETA);
			if (meta.length) {
				meta = meta.trim(true);
				name = meta[0];
			} else
				meta = null;

			has = true;

			// Check singleton instance
			if (statics['$ST_' + name]) {
				remove(el);
				return;
			}

			var instances = [];
			var all = name.split(',');

			for (var y = 0; y < all.length; y++) {

				var name = all[y].trim();
				var is = false;

				if (name.indexOf('|') !== -1) {

					// Multiple versions
					var keys = name.split('|');
					for (var i = 0; i < keys.length; i++) {
						var key = keys[i].trim();
						if (key && M.$components[key]) {
							name = key;
							is = true;
							break;
						}
					}

					if (!is)
						name = keys[0].trim();
				}

				var lazy = false;

				if (name.substring(0, 5).toLowerCase() === 'lazy ') {
					name = name.substring(5);
					lazy = true;
				}

				if (!is && name.lastIndexOf('@') === -1) {
					if (versions[name])
						name += '@' + versions[name];
					else if (MD.version)
						name += '@' + MD.version;
				}

				var com = M.$components[name];
				var lo = null;

				if (lazy && name) {
					var namea = name.substring(0, name.indexOf('@'));
					lo = lazycom[name];
					if (!lo) {
						if (namea && name !== namea)
							lazycom[name] = lazycom[namea] = { state: 1 };
						else
							lazycom[name] = { state: 1 };
						continue;
					}
					if (lo.state === 1)
						continue;
				}

				if (!com) {

					if (!fallback[name]) {
						fallback[name] = 1;
						fallback.$++;
					}

					var x = attrcom(el, 'import');
					if (!x) {
						!statics['$NE_' + name] && (statics['$NE_' + name] = true);
						continue;
					}

					if (C.imports[x] === 1)
						continue;

					if (C.imports[x] === 2) {
						!statics['$NE_' + name] && (statics['$NE_' + name] = true);
						continue;
					}

					C.imports[x] = 1;
					C.importing++;

					M.import(x, function() {
						C.importing--;
						C.imports[x] = 2;
					});

					continue;
				}

				if (fallback[name] === 1) {
					fallback.$--;
					delete fallback[name];
				}

				var obj = new COM(com.name);
				var parent = dom.parentNode;

				while (true) {
					if (parent.$com) {
						var pc = parent.$com;
						obj.owner = pc;
						if (pc.$children)
							pc.$children++;
						else
							pc.$children = 1;
						break;
					} else if (parent.nodeName === 'BODY')
						break;
					parent = parent.parentNode;
					if (parent == null)
						break;
				}

				obj.global = com.shared;
				obj.element = el;
				obj.dom = dom;

				var p = attrcom(el, 'path') || (meta ? meta[1] === 'null' ? '' : meta[1] : '') || obj._id;

				if (p.substring(0, 1) === '%')
					obj.$noscope = true;

				obj.setPath(pathmaker(p, true), 1);
				obj.config = {};

				// Default config
				com.config && obj.reconfigure(com.config, NOOP);

				var tmp = attrcom(el, 'config') || (meta ? meta[2] === 'null' ? '' : meta[2] : '');
				tmp && obj.reconfigure(tmp, NOOP);

				if (!obj.$init)
					obj.$init = attrcom(el, 'init') || null;

				if (!obj.type)
					obj.type = attrcom(el, 'type') || '';

				if (!obj.id)
					obj.id = attrcom(el, 'id') || obj._id;

				obj.siblings = all.length > 1;
				obj.$lazy = lo;

				for (var i = 0; i < configs.length; i++) {
					var con = configs[i];
					con.fn(obj) && obj.reconfigure(con.config, NOOP);
				}

				caches.current.com = obj;
				com.declaration.call(obj, obj, obj.config);
				caches.current.com = null;

				meta[3] && el.attrd('jc-value', meta[3]);

				if (obj.init && !statics[name]) {
					statics[name] = true;
					obj.init();
				}

				dom.$com = obj;

				if (!obj.$noscope)
					obj.$noscope = attrcom(el, 'noscope') === 'true';

				var code = obj.path ? obj.path.charCodeAt(0) : 0;
				if (!obj.$noscope && scope.length && !obj.$pp) {

					var output = initscopes(scope);

					if (obj.path && code !== 33 && code !== 35) {
						obj.setPath(obj.path === '?' ? output.path : (obj.path.indexOf('?') === -1 ? output.path + '.' + obj.path : obj.path.replace(/\?/g, output.path)), 2);
					} else {
						obj.$$path = EMPTYARRAY;
						obj.path = '';
					}

					obj.scope = output;
					obj.pathscope = output.path;
				}

				instances.push(obj);

				var template = attrcom(el, 'template') || obj.template;
				if (template)
					obj.template = template;

				if (attrcom(el, 'released') === 'true')
					obj.$released = true;

				if (attrcom(el, 'url')) {
					warn('Components: You have to use "data-jc-template" attribute instead of "data-jc-url" for the component: {0}[{1}].'.format(obj.name, obj.path));
					continue;
				}

				if (langx.isString(template)) {
					var fn = function(data) {
						if (obj.prerender)
							data = obj.prerender(data);
						dependencies(com, function(obj, el) {
							if (langx.isFunction(obj.make)) {
								var parent = caches.current.com;
								caches.current.com = obj;
								obj.make(data);
								caches.current.com = parent;
							}
							init(el, obj);
						}, obj, el);
					};

					var c = template.substring(0, 1);
					if (c === '.' || c === '#' || c === '[') {
						fn($(template).html());
						continue;
					}

					var k = 'TE' + HASH(template);
					var a = statics[k];
					if (a) {
						fn(a);
						continue;
					}

					$.get(makeurl(template), function(response) {
						statics[k] = response;
						fn(response);
					});

					continue;
				}

				if (langx.isString(obj.make)) {

					if (obj.make.indexOf('<') !== -1) {
						dependencies(com, function(obj, el) {
							if (obj.prerender)
								obj.make = obj.prerender(obj.make);
							el.html(obj.make);
							init(el, obj);
						}, obj, el);
						continue;
					}

					$.get(makeurl(obj.make), function(data) {
						dependencies(com, function(obj, el) {
							if (obj.prerender)
								data = obj.prerender(data);
							el.html(data);
							init(el, obj);
						}, obj, el);
					});

					continue;
				}

				if (com.dependencies) {
					dependencies(com, function(obj, el) {

						if (obj.make) {
							var parent = caches.current.com;
							caches.current.com = obj;
							obj.make();
							caches.current.com = parent;
						}

						init(el, obj);
					}, obj, el);
				} else {

					// Because sometimes make doesn't contain the content of the element
					setTimeout(function(init, el, obj) {

						if (obj.make) {
							var parent = caches.current.com;
							caches.current.com = obj;
							obj.make();
							caches.current.com = parent;
						}

						init(el, obj);
					}, 5, init, el, obj);
				}
			}

			// A reference to instances
			if (instances.length > 0) {
				el.$com = instances.length > 1 ? instances : instances[0];
			}

		}, undefined);

		// perform binder
		rebindbinder();

		if (!has || !C.pending.length) {
			C.is = false;
		}

		if (container !== undefined || !toggles.length) {
			return nextpending();
		}

		async(toggles, function(item, next) {
			for (var i = 0, length = item.toggle.length; i < length; i++)
				item.element.tclass(item.toggle[i]);
			next();
		}, nextpending);
	}

	function crawler(container, onComponent, level, paths) {

		if (container) {
			container = $(container)[0];
		} else {
			container = document.body;
		}

		if (!container) {
			return;
		}

		var comp = container ? attrcom(container, 'compile') : '1';
		if (comp === '0' || comp === 'false') {
			return;
		}

		if (level == null || level === 0) {
			paths = [];
			if (container !== document.body) {
				var scope = $(container).closest('[' + ATTRSCOPE + ']');
				scope && scope.length && paths.push(scope[0]);
			}
		}

		var b = null;
		var released = container ? attrcom(container, 'released') === 'true' : false;
		var tmp = attrcom(container, 'scope');
		var binders = null;

		tmp && paths.push(container);

		if (!container.$jcbind) {
			b = container.getAttribute('data-bind') || container.getAttribute('bind');
			if (b) {
				!binders && (binders = []);
				binders.push({ el: container, b: b });
			}
		}

		var name = attrcom(container);
		!container.$com && name != null && onComponent(name, container, 0, paths);

		var arr = container.childNodes;
		var sub = [];

		if (level === undefined) {
			level = 0;
		} else {
			level++;
		}

		for (var i = 0, length = arr.length; i < length; i++) {
			var el = arr[i];
			if (el) {

				if (!el.tagName) {
					continue;
				}

				comp = el.getAttribute('data-jc-compile');
				if (comp === '0' || comp === 'false') {
					continue;
				}

				if (el.$com === undefined) {
					name = attrcom(el);
					if (name != null) {
						released && el.setAttribute(ATTRREL, 'true');
						onComponent(name || '', el, level, paths);
					}
				}

				if (!el.$jcbind) {
					b = el.getAttribute('data-bind') || el.getAttribute('bind');
					if (b) {
						el.$jcbind = 1;
						!binders && (binders = []);
						binders.push({ el: el, b: b });
					}
				}

				comp = el.getAttribute('data-jc-compile');
				if (comp !== '0' && comp !== 'false')
					el.childNodes.length && el.tagName !== 'SCRIPT' && REGCOM.test(el.innerHTML) && sub.indexOf(el) === -1 && sub.push(el);
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			el && crawler(el, onComponent, level, paths && paths.length ? paths : []);
		}

		if (binders) {
			for (var i = 0; i < binders.length; i++) {
				var a = binders[i];
				a.el.$jcbind = parsebinder(a.el, a.b, paths);
			}
		}
	}

	function init(el, obj) {

		var dom = el[0];
		var type = dom.tagName;
		var collection;

		// autobind
		if (ACTRLS[type]) {
			obj.$input = true;
			collection = obj.element;
		} else {
			collection = el;
		}

		findcontrol2(obj, collection);

		obj.released && obj.released(obj.$released);
		components.push(obj); // M.components.push(obj)
		C.init.push(obj);
		type !== 'BODY' && REGCOM.test(el[0].innerHTML) && compile(el);
		ready();
	}


	$(document).ready(function() {

		if ($ready) {
			clearTimeout($ready);
			load();
		}

		$(Window).on('orientationchange', mediaquery);

		$(document).on('input', 'input[data-jc-bind],textarea[data-jc-bind]', function() {

			// realtime binding
			var self = this;
			var com = self.$com;

			if (!com || com.$removed || !com.getter || self.$jckeypress === false) {
				return;
			}

			self.$jcevent = 2;

			if (self.$jckeypress === undefined) {
				var tmp = attrcom(self, 'keypress');
				if (tmp)
					self.$jckeypress = tmp === 'true';
				else if (com.config.$realtime != null)
					self.$jckeypress = com.config.$realtime === true;
				else if (com.config.$binding)
					self.$jckeypress = com.config.$binding === 1;
				else
					self.$jckeypress = MD.keypress;
				if (self.$jckeypress === false)
					return;
			}

			if (self.$jcdelay === undefined) {
				self.$jcdelay = +(attrcom(self, 'keypress-delay') || com.config.$delay || MD.delay);
			}

			if (self.$jconly === undefined) {
				self.$jconly = attrcom(self, 'keypress-only') === 'true' || com.config.$keypress === true || com.config.$binding === 2;
			}

			if (self.$jctimeout) {
				clearTimeout(self.$jctimeout);	
			} 
			self.$jctimeout = setTimeout(keypressdelay, self.$jcdelay, self);
		});

		$(document).on('focus blur', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function(e) {

			var self = this;
			var com = self.$com;

			if (!com || com.$removed || !com.getter)
				return;

			if (e.type === 'focusin')
				self.$jcevent = 1;
			else if (self.$jcevent === 1) {
				com.dirty(false, true);
				com.getter(self.value, 3);
			} else if (self.$jcskip) {
				self.$jcskip = false;
			} else {
				// formatter
				var tmp = com.$skip;
				if (tmp)
					com.$skip = false;
				com.setter(com.get(), com.path, 2);
				if (tmp) {
					com.$skip = tmp;
				}
			}
		});

		$(document).on('change', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function() {

			var self = this;
			var com = self.$com;

			if (self.$jconly || !com || com.$removed || !com.getter)
				return;

			if (self.$jckeypress === false) {
				// bind + validate
				self.$jcskip = true;
				com.getter(self.value, false);
				return;
			}

			switch (self.tagName) {
				case 'SELECT':
					var sel = self[self.selectedIndex];
					self.$jcevent = 2;
					com.dirty(false, true);
					com.getter(sel.value, false);
					return;
				case 'INPUT':
					if (self.type === 'checkbox' || self.type === 'radio') {
						self.$jcevent = 2;
						com.dirty(false, true);
						com.getter(self.checked, false);
						return;
					}
					break;
			}

			if (self.$jctimeout) {
				com.dirty(false, true);
				com.getter(self.value, true);
				clearTimeout(self.$jctimeout);
				self.$jctimeout = 0;
			} else {
				self.$jcskip = true;
				com.setter && com.setterX(com.get(), self.path, 2);
			}
		});

		setTimeout(compile, 2);
		$domready = true;
	});


	// Component
	Component.prototype.compile = function(container) {
		var self = this;
		!container && self.attrd('jc-compile') && self.attrd('jc-compile', '1');
		compile(container || self.element);
		return self;
	};


	function cleaner2() {
		clear();
		cleaner();
	}


	function cleaner() {

		var keys = Object.keys(events);
		var is = false;
		var length = keys.length;
		var index;
		var arr;

		for (var i = 0; i < length; i++) {
			var key = keys[i];
			index = 0;
			arr = events[key];
			while (true) {

				var item = arr[index++];
				if (item === undefined)
					break;

				if (item.context == null || (item.context.element && inDOM(item.context.element[0])))
					continue;

				item.context && item.context.element && item.context.element.remove();
				item.context.$removed = true;
				item.context = null;
				arr.splice(index - 1, 1);

				if (!arr.length)
					delete events[key];

				index -= 2;
				is = true;
			}
		}

		index = 0;
		while (true) {
			var item = watches[index++];
			if (item === undefined)
				break;
			if (item.context == null || (item.context.element && inDOM(item.context.element[0])))
				continue;
			item.context && item.context.element && item.context.element.remove();
			item.context.$removed = true;
			item.context = null;
			watches.splice(index - 1, 1);
			index -= 2;
			is = true;
		}

		//var all =  M.components;
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
			if (!component.$removed && c && inDOM(c[0])) {
				if (!component.attr(ATTRDEL)) {
					if (component.$parser && !component.$parser.length)
						component.$parser = undefined;
					if (component.$formatter && !component.$formatter.length)
						component.$formatter = undefined;
					continue;
				}
			}

			topic.emit('destroy', component.name, component);
			topic.emit('component.destroy', component.name, component);

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

		keys = Object.keys(binders);
		for (var i = 0; i < keys.length; i++) {
			arr = binders[keys[i]];
			var j = 0;
			while (true) {
				var o = arr[j++];
				if (!o)
					break;
				if (inDOM(o.el[0]))
					continue;
				var e = o.el;
				if (!e[0].$br) {
					e.off();
					e.find('*').off();
					e[0].$br = 1;
				}
				j--;
				arr.splice(j, 1);
			}
			if (!arr.length)
				delete binders[keys[i]];
		}

		clear('find');

		// Checks PLUGINS
		var R = plugins.registry; //W.PLUGINS;
		Object.keys(R).forEach(function(key) {
			var a = R[key];
			if (!inDOM(a.element[0]) || !a.element[0].innerHTML) {
				a.$remove();
				delete R[key];
			}
		});

		W.DATETIME = W.NOW = new Date();
		var now = W.NOW.getTime();
		var is2 = false;
		var is3 = false;

		for (var key in blocked) {
			if (blocked[key] <= now) {
				delete blocked[key];
				is2 = true;
			}
		}

		if (MD.localstorage && is2 && !M.isPRIVATEMODE)  // W.isPRIVATEMODE
			localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));

		for (var key in storage) {
			var item = storage[key];
			if (!item.expire || item.expire <= now) {
				delete storage[key];
				is3 = true;
			}
		}

		is3 && save();

		if (is) {
			refresh();
			setTimeout(compile, 2000);
		}
	}


	function refresh() {
		setTimeout2('$refresh', function() {
			all.sort(function(a, b) {  // M.components.sort
				if (a.$removed || !a.path)
					return 1;
				if (b.$removed || !b.path)
					return -1;
				var al = a.path.length;
				var bl = b.path.length;
				return al > bl ? - 1 : al === bl ? LCOMPARER(a.path, b.path) : 1;
			});
		}, 200);
	}

	setInterval(function() {
//		temp = {};
//		paths = {};
		cleaner();
	}, (1000 * 60) * 5);

	return jc.compiler = {
		block,
		compile,
	};

});