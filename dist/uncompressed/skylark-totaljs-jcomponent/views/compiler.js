define([
	"../langx",
	"../utils/query",
	"../utils/domx",
	"../utils/http",
	"../components/registry",
	"../plugins"
],function(langx, $, domx, http, registry,plugins){
	var statics = langx.statics;

	var MD = {
		fallback : 'https://cdn.componentator.com/j-{0}.html',
		fallbackcache : '',
		version : 'v16'
	};

	var fallback = { $: 0 }; // $ === count of new items in fallback

	setInterval(function() {
		temp = {};
		paths = {};
//		cleaner();
	}, (1000 * 60) * 5);	

	function clean2() {
		clear();
		clean();
	}

	function clean() {
		var is = false;
		var index;



		clear('find');


		//W.DATETIME = W.NOW = new Date();
		//var now = W.NOW.getTime();
		var is2 = false;
		var is3 = false;




		if (is) {
			refresh();
			setTimeout(compile, 2000);
		}
	}


	setInterval(function() {
//		temp = {};
//		paths = {};
		clean();
	}, (1000 * 60) * 5);


    /*
    for (var i = 0, length = all.length; i < length; i++) { // M.components.length
        var m = all[i]; // M.components[i];
        if (!m.$removed || name === m.name){
            config && m.reconfigure(config, undefined, true);
            declaration.call(m, m, m.config);
        }
    }

    RECOMPILE();
    */



	function compiler(view) {
		var helper = view.helper,
			eventer = view.eventer,
			storing = view.storing,
			scoper = view.scoper,
			componentater = view.componentater;
    
		var is = false;
			recompile = false,
			importing = 0,
			pending = [],
			initing = [],
			imports = {},
			toggles = [],
			ready = [],
			lazycom = {},
			caches = {
				current : {}
			};

		//C.get = get; // paths

		// ===============================================================
		// PRIVATE FUNCTIONS
		// ===============================================================
		//var $ready = setTimeout(load, 2);
		var $loaded = false;

		var fallbackPending = [];

		function download(view) {

			var arr = [];
			var count = 0;

			helper.findUrl(view._elm).each(function() {

				var t = this;
				var el = $(t);

				if (t.$downloaded) {
					return;
				}

				t.$downloaded = 1;
				var url = helper.attrcom(el, 'url');

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
				item.callback = helper.attrcom(el, 'init');
				item.path = helper.attrcom(el, 'path');
				item.toggle = (helper.attrcom(el, 'class') || '').split(' ');
				item.expire = helper.attrcom(el, 'cache') || MD.importcache;
				arr.push(item);
			});

			if (!arr.length) {
				return;
			}

			var canCompile = false;
			importing++;

			langx.async(arr, function(item, next) {

				var key = helper.makeurl(item.url);
				var can = false;

				http.ajaxCache('GET ' + item.url, null, function(response) {

					key = '$import' + key;

					caches.current.element = item.element[0];

					if (statics[key]) {
						response = domx.removescripts(response);
					} else {
						response = domx.importscripts(importstyles(response));
					}

					can = response && helper.canCompile(response);

					if (can) {
						canCompile = true;
					}

					item.element.html(response);
					statics[key] = true;
					item.toggle.length && item.toggle[0] && toggles.push(item);

					if (item.callback && ! helper.attrcom(item.element)) {
						var callback = storing.get(item.callback);
						if (langx.isFunction(callback)) {
							callback(item.element);
						}
					}

					caches.current.element = null;
					count++;
					next();

				}, item.expire);

			}, function() {
				importing--;
				componenter.clean(); // clear('valid', 'dirty', 'find');
				if (count && canCompile){
					view.compile();
				}
			});
		}

		function downloadFallback() {
			if (importing) {
				setTimeout(downloadFallback, 1000);
			} else {
				langx.setTimeout2('$fallback', function() {
					fallbackPending.splice(0).wait(function(item, next) {
						if (registry[item]){ // M.$components
							next();
						}else {
							warn('Downloading: ' + item);
							http.importCache(MD.fallback.format(item), MD.fallbackcache, next);
						}
					}, 3);
				}, 100);
			}
		}

		function nextPending() {

			var next = pending.shift();
			if (next) {
				next();
			} else if ($domready) {
				if (ready) {
					is = false;
				}

				if (MD.fallback && fallback.$ && !importing) {
					var arr = Object.keys(fallback);
					for (var i = 0; i < arr.length; i++) {
						if (arr[i] !== '$') {
							var num = fallback[arr[i]];
							if (num === 1) {
								fallbackPending.push(arr[i].toLowerCase());
								fallback[arr[i]] = 2;
							}
						}
					}
					fallback.$ = 0;
					if (fallbackPending.length) {
						downloadFallback();
					}
				}
			}
		}


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
					http.import2((item.indexOf('<') === -1 ? 'once ' : '') + item, next);  // IMPORT
				}
			}, function() {
				declaration.importing = false;
				callback(obj, el);
			}, 3);
		}

		function init(el, obj) {

			var dom = el[0];
			var type = dom.tagName;
			var collection;

			// autobind
			if (domx.inputable(type)) {
				obj.$input = true;
				collection = obj.element;
			} else {
				collection = el;
			}

			helper.findControl2(obj, collection);

			obj.released && obj.released(obj.$released);
			componenter.components.push(obj); // M.components.push(obj)
			initing.push(obj);
			if (type !== 'BODY' && helper.canCompile(el[0])) {//REGCOM.test(el[0].innerHTML)) {
				compile(el);
			}
			request(); // ready
		}		


		// parse dom element and create a component instance
		function onComponent(name, dom, level, scope) {

			var el = $(dom);
			var meta = name.split(/_{2,}/);
			if (meta.length) {
				meta = meta.trim(true);
				name = meta[0];
			} else
				meta = null;

			has = true;

			// Check singleton instance
			if (statics['$ST_' + name]) {
				domx.remove(el);
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
						if (key &&  registry[key]) { // M.$components
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

				var com = registry[name]; // M.$components[name];
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

					var x = helper.attrcom(el, 'import');
					if (!x) {
						!statics['$NE_' + name] && (statics['$NE_' + name] = true);
						continue;
					}

					if (imports[x] === 1) {
						continue;
					}

					if (imports[x] === 2) {
						!statics['$NE_' + name] && (statics['$NE_' + name] = true);
						continue;
					}

					imports[x] = 1;
					importing++;

					http.import2(x, function() {
						importing--;
						imports[x] = 2;
					});

					continue;
				}

				if (fallback[name] === 1) {
					fallback.$--;
					delete fallback[name];
				}

				var obj = new helper.Component(com.name,view);
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

				var p = helper.attrcom(el, 'path') || (meta ? meta[1] === 'null' ? '' : meta[1] : '') || obj._id;

				if (p.substring(0, 1) === '%') {
					obj.$noscope = true;
				}

				obj.setPath(pathmaker(p, true), 1);
				obj.config = {};

				// Default config
				if (com.config) {
					obj.reconfigure(com.config, NOOP);
				}

				var tmp = helper.attrcom(el, 'config') || (meta ? meta[2] === 'null' ? '' : meta[2] : ''); // // data-jc-config
				if (tmp) {
					obj.reconfigure(tmp, NOOP);
				}

				if (!obj.$init) {
					obj.$init = helper.attrcom(el, 'init') || null; // data-jc-init
				}

				if (!obj.type) {
					obj.type = helper.attrcom(el, 'type') || '';   // data-jc-type
				}

				if (!obj.id) {
					obj.id = helper.attrcom(el, 'id') || obj._id;  // data-jc-id
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
					obj.$noscope = helper.attrcom(el, 'noscope') === 'true';   // data-jc-noscope
				}

				var code = obj.path ? obj.path.charCodeAt(0) : 0;
				if (!obj.$noscope && scope.length && !obj.$pp) {

					var output = scoper.initscopes(scope);

					if (obj.path && code !== 33 && code !== 35) {
						obj.setPath(obj.path === '?' ? output.path : (obj.path.indexOf('?') === -1 ? output.path + '.' + obj.path : obj.path.replace(/\?/g, output.path)), 2);
					} else {
						obj.$$path = [];//EMPTYARRAY;
						obj.path = '';
					}

					obj.scope = output;
					obj.pathscope = output.path;
				}

				instances.push(obj);

				var template = helper.attrcom(el, 'template') || obj.template;  // data-jc-template
				if (template) {
					obj.template = template;
				}

				if (helper.attrcom(el, 'released') === 'true') { // data-jc-released
					obj.$released = true;
				}

				if (helper.attrcom(el, 'url')) {
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

					$.get(helper.makeurl(template), function(response) {
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
		function crawler(container, onComponent, level, paths) {
			var helper = view.helper,
				binding = view.binding;

			if (container) {
				container = $(container)[0];
			} else {
				container = document.body;
			}

			if (!container) {
				return;
			}

			/*
			var comp = view.attrcom(container, 'compile') ;
			if (comp === '0' || comp === 'false') {
				// no compile
				return;
			}
			*/
			if (helper.nocompile(container)) {
				return;
			}

			if (level == null || level === 0) {
				paths = [];
				if (container !== document.body) {
					/*
					var scope = $(container).closest('[' + ATTRSCOPE + ']'); //ATTRCOPE
					if (scope && scope.length) {
						paths.push(scope[0]);
					}
					*/
					var scope = helper.scope(container);
					if (scope) {
						scopes.push(scope);
					}
				}
			}

			var b = null;
			var released = container ? helper.released(container) : false; // sttrcom
			var tmp = helper.scope(container); //attrcom
			var binders = null;

			if (tmp) {
				paths.push(container);
			}

			if (!container.$jcbind) {
				b = helper.attrbind(container); //container.getAttribute('data-bind') || container.getAttribute('bind');
				if (b) {
					if (!binders) {
						binders = [];
					}
					binders.push({ 
						el: container, 
						b: b 
					});
				}
			}

			var name = helper.attrcom(container);
			if (!container.$com && name != null) {
				onComponent(name, container, 0, paths);
			}

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

					/*
					comp = el.getAttribute('data-jc-compile');
					if (comp === '0' || comp === 'false') {
						continue;
					}
					*/
					if (helper.nocompile(el)) {
						continue;
					}

					if (el.$com === undefined) {
						name = helper.attrcom(el);
						if (name != null) {
							if (released) {
								helper.released(el,"true"); //el.setAttribute(ATTRREL, 'true');
							}
							onComponent(name || '', el, level, paths);
						}
					}

					if (!el.$jcbind) {
						b = helper.attrbind(el); //el.getAttribute('data-bind') || el.getAttribute('bind');
						if (b) {
							el.$jcbind = 1;
							!binders && (binders = []);
							binders.push({ el: el, b: b });
						}
					}

					/*
					comp = el.getAttribute('data-jc-compile');
					if (comp !== '0' && comp !== 'false') {
						if (el.childNodes.length && el.tagName !== 'SCRIPT' && REGCOM.test(el.innerHTML) && sub.indexOf(el) === -1)  {
						  sub.push(el);
						}
					}
					*/
					if (!helper.nocompile(el)) {
						if (el.childNodes.length && el.tagName !== 'SCRIPT' && helper.canCompile(el) && sub.indexOf(el) === -1)  { // REGCOM.test(el.innerHTML)
						  sub.push(el);
						}
					}
				}
			}

			for (var i = 0, length = sub.length; i < length; i++) {
				el = sub[i];
				if (el) {
					crawler(el, onComponent, level, paths && paths.length ? paths : []);
				}
			}

			if (binders) {
				for (var i = 0; i < binders.length; i++) {
					var a = binders[i];
					a.el.$jcbind = parsebinder(a.el, a.b, paths);
				}
			}
		}

	
		function compile(container,immediate) {
			var self = this;

			if (is) {
				recompile = true;
				return;
			}

			var arr = [];

			//if (W.READY instanceof Array)  {
			//	arr.push.apply(arr, W.READY);
			//}
			//if (W.jComponent instanceof Array) {
			//	arr.push.apply(arr, W.jComponent);
			//}
			//if (W.components instanceof Array) {
			//	arr.push.apply(arr, W.components);
			//	}

			if (arr.length) {
				while (true) {
					var fn = arr.shift();
					if (!fn){
						break;
					}
					fn();
				}
			}

			is = true;
			download(self);

			if (pending.length) {
				(function(container) {
					pending.push(function() {
						compile(self,container);
					});
				})(container);
				return;
			}

			var has = false;

			crawler(container, onComponent);

			// perform binder
			rebindbinder();

			if (!has || !pending.length) {
				is = false;
			}

			if (container !== undefined || !toggles.length) {
				return nextpending();
			}

			langx.async(toggles, function(item, next) {
				for (var i = 0, length = item.toggle.length; i < length; i++)
					item.element.tclass(item.toggle[i]);
				next();
			}, nextpending);
		}		

	function request() {

		langx.setTimeout2('$ready', function() {

			mediaquery();
			view.refresh(); // TODO

			function initialize() {
				var item = initing.pop();
				if (item === undefined)
					!ready && compile();
				else {
					!item.$removed && prepare(item);
					initialize();
				}
			}

			initialize();

			var count = components.length; // M.components
			$(document).trigger('components', [count]);

			if (!$loaded) {
				$loaded = true;
				caches.clear('valid', 'dirty', 'find');
				topic.emit('init');
				topic.emit('ready');
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

			is = false;

			if (recompile) {
				recompile = false;
				compile();
			}

			if (ready) {
				var arr = ready;
				for (var i = 0, length = arr.length; i < length; i++)
					arr[i](count);
				ready = undefined;
				compile();
				setTimeout(compile, 3000);
				setTimeout(compile, 6000);
				setTimeout(compile, 9000);
			}
		}, 100);
	}

		return {

			"compile" : compile,
			"request" : request

		}
	}

	return compiler;

});