define([
	"../langx"
],function(langx){
	var	fallback = 'https://cdn.componentator.com/j-{0}.html';
	var	fallbackcache = '';

	var lazycom = {};

	var fallback = { $: 0 }; // $ === count of new items in fallback
	
	function dependencies(declaration, callback, obj, el) {

		if (declaration.importing) {
			langx.wait(function() {
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
	

	function onComponent(view, name, dom, level, scope) {

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

				if (!is) {
					name = keys[0].trim();
				}
			}

			var lazy = false;

			if (name.substring(0, 5).toLowerCase() === 'lazy ') {
				name = name.substring(5);
				lazy = true;
			}

			if (!is && name.lastIndexOf('@') === -1) {
				if (versions[name]) {
					name += '@' + versions[name];
				} else if (MD.version) {
					name += '@' + MD.version;
				}
			}

			var com = M.$components[name];
			var lo = null;

			if (lazy && name) {
				var namea = name.substring(0, name.indexOf('@'));
				lo = lazycom[name];
				if (!lo) {
					if (namea && name !== namea) {
						lazycom[name] = lazycom[namea] = { state: 1 };
					} else {
						lazycom[name] = { state: 1 };
					}
					continue;
				}
				if (lo.state === 1) {
					continue;
				}
			}

			if (!com) {

				if (!fallback[name]) {
					fallback[name] = 1;
					fallback.$++;
				}

				var x = view.attrcom(el, 'import');
				if (!x) {
					!statics['$NE_' + name] && (statics['$NE_' + name] = true);
					continue;
				}

				if (view.imports[x] === 1) {
					continue;
				}

				if (view.imports[x] === 2) {
					!statics['$NE_' + name] && (statics['$NE_' + name] = true);
					continue;
				}

				view.imports[x] = 1;
				view.importing++;

				M.import(x, function() {
					view.importing--;
					view.imports[x] = 2;
				});

				continue;
			}

			if (fallback[name] === 1) {
				fallback.$--;
				delete fallback[name];
			}

			var obj = new Component(com.name);
			var parent = dom.parentNode;

			while (true) {
				if (parent.$com) {
					var pc = parent.$com;
					obj.owner = pc;
					if (pc.$children) {
						pc.$children++;
					} else {
						pc.$children = 1;
					}
					break;
				} else if (parent.nodeName === 'BODY') {
					break;
				}
				parent = parent.parentNode;
				if (parent == null) {
					break;
				}
			}

			obj.global = com.shared;
			obj.element = el;
			obj.dom = dom;

			var p = view.attrcom(el, 'path') || (meta ? meta[1] === 'null' ? '' : meta[1] : '') || obj._id;

			if (p.substring(0, 1) === '%') {
				obj.$noscope = true;
			}

			obj.setPath(pathmaker(p, true), 1);
			obj.config = {};

			// Default config
			if (com.config) {
				obj.reconfigure(com.config, NOOP);
			}

			var tmp = attrcom(el, 'config') || (meta ? meta[2] === 'null' ? '' : meta[2] : '');
			if (tmp) {
				obj.reconfigure(tmp, NOOP);
			}

			if (!obj.$init) {
				obj.$init = attrcom(el, 'init') || null;
			}

			if (!obj.type) {
				obj.type = attrcom(el, 'type') || '';
			}

			if (!obj.id) {
				obj.id = attrcom(el, 'id') || obj._id;
			}

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

			if (!obj.$noscope) {
				obj.$noscope = view.attrcom(el, 'noscope') === 'true';
			}

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

			var template = view.attrcom(el, 'template') || obj.template;
			if (template) {
				obj.template = template;
			}

			if (view.attrcom(el, 'released') === 'true') {
				obj.$released = true;
			}

			if (view.attrcom(el, 'url')) {
				warn('Components: You have to use "data-jc-template" attribute instead of "data-jc-url" for the component: {0}[{1}].'.format(obj.name, obj.path));
				continue;
			}

			if (langx.isString(template)) {
				var fn = function(data) {
					if (obj.prerender) {
						data = obj.prerender(data);
					}
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
						if (obj.prerender) {
							data = obj.prerender(data);
						}
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

	}
	
	return onComponent;
});