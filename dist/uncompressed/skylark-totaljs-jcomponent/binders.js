define([
	"skylark-utils-dom/query",
	"./jc",
	"./langx",
	"./plugins"
],function($, jc,langx,plugins){
	var ATTRBIND = '[data-bind],[bind],[data-vbind]';

	var REGCOMMA = /,/g;
	var REGEMPTY = /\s/g;
	var REGMETA = /_{2,}/;


	//var W = jc.W = {};


	// temporary
	//W.jctmp = {}; // not used
	//W.W = window; 
	//W.FUNC = {};


	function attrcom(el, name) {
		name = name ? '-' + name : '';
		return el.getAttribute ? el.getAttribute('data-jc' + name) : el.attrd('jc' + name);
	}

	$.fn.scope = function() {

		if (!this.length)
			return null;

		var data = this[0].$scopedata;
		if (data)
			return data;
		var el = this.closest('[' + ATTRSCOPE + ']');
		if (el.length) {
			data = el[0].$scopedata;
			if (data)
				return data;
		}
		return null;
	};


	function initscopes(scopes) {

		var scope = scopes[scopes.length - 1];
		if (scope.$scopedata) {
			return scope.$scopedata;
		}

		var path = attrcom(scope, 'scope');
		var independent = path.substring(0, 1) === '!';

		if (independent) {
			path = path.substring(1);
		}

		var arr = [scope];
		if (!independent) {
			for (var i = scopes.length - 1; i > -1; i--) {
				arr.push(scopes[i]);
				if (scopes[i].getAttribute(ATTRSCOPE).substring(0, 1) === '!') {
					break;
				}
			}
		}

		var absolute = '';

		arr.length && arr.reverse();

		for (var i = 0, length = arr.length; i < length; i++) {

			var sc = arr[i];
			var p = sc.$scope || attrcom(sc, 'scope');

			sc.$initialized = true;

			if (sc.$processed) {
				absolute = p;
				continue;
			}

			sc.$processed = true;
			sc.$isolated = p.substring(0, 1) === '!';

			if (sc.$isolated) {
				p = p.substring(1);
			}

			if (!p || p === '?')
				p = GUID(25).replace(/\d/g, '');

			if (sc.$isolated) {
				absolute = p;
			} else {
				absolute += (absolute ? '.' : '') + p;
			}

			sc.$scope = absolute;
			var d = new Scope();
			d._id = d.ID = d.id = GUID(10);
			d.path = absolute;
			d.elements = arr.slice(0, i + 1);
			d.isolated = sc.$isolated;
			d.element = $(arr[0]);
			sc.$scopedata = d;

			var tmp = attrcom(sc, 'value');
			if (tmp) {
				var fn = new Function('return ' + tmp);
				defaults['#' + HASH(p)] = fn; // paths by path (DEFAULT() --> can reset scope object)
				tmp = fn();
				set(p, tmp);
				emitwatch(p, tmp, 1);
			}

			// Applies classes
			var cls = attrcom(sc, 'class');
			if (cls) {
				(function(cls) {
					cls = cls.split(' ');
					setTimeout(function() {
						var el = $(sc);
						for (var i = 0, length = cls.length; i < length; i++) {
							el.tclass(cls[i]);
						}
					}, 5);
				})(cls);
			}

			tmp = attrcom(sc, 'init');
			if (tmp) {
				tmp = scopes.get(tmp);
				if (tmp) {
					var a = current_owner;
					current_owner = 'scope' + d._id;
					tmp.call(d, p, $(sc));
					current_owner = a;
				}
			}
		}

		return scope.$scopedata;
	}

	function rebinddecode(val) {
		return val.replace(/&#39;/g, '\'');
	}

	function jBinder() {}

	var JBP = jBinder.prototype;
	JBP.exec = function(value, path, index, wakeup, can) {

		var item = this;
		var el = item.el;
		if (index != null) {
			if (item.child == null)
				return;
			item = item.child[index];
			if (item == null)
				return;
		}

		if (item.notnull && value == null)
			return;

		if (item.selector) {
			if (item.cache)
				el = item.cache;
			else {
				el = el.find(item.selector);
				if (el.length)
					item.cache = el;
			}
		}

		if (!el.length)
			return;

		if (!wakeup && item.delay) {
			item.$delay && clearTimeout(item.$delay);
			item.$delay = setTimeout(function(obj, value, path, index, can) {
				obj.$delay = null;
				obj.exec(value, path, index, true, can);
			}, item.delay, item, value, path, index, can);
			return;
		}

		if (item.init) {
			if (item.strict && item.path !== path)
				return;
			if (item.track && item.path !== path) {
				var can = false;
				for (var i = 0; i < item.track.length; i++) {
					if (item.track[i] === path) {
						can = true;
						break;
					}
				}
				if (!can)
					return;
			}
		} else {
			item.init = 1;
		}

		if (item.def && value == null) {
			value = item.def;
		}

		if (item.format) {
			value = item.format(value, path);
		}

		var tmp = null;

		can = can !== false;

		if (item.show && (value != null || !item.show.$nn)) {
			tmp = item.show.call(item.el, value, path, item.el);
			el.tclass('hidden', !tmp);
			if (!tmp)
				can = false;
		}

		if (item.hide && (value != null || !item.hide.$nn)) {
			tmp = item.hide.call(el, value, path, el);
			el.tclass('hidden', tmp);
			if (tmp)
				can = false;
		}

		if (item.invisible && (value != null || !item.invisible.$nn)) {
			tmp = item.invisible.call(item.el, value, path, item.el);
			el.tclass('invisible', tmp);
			if (!tmp)
				can = false;
		}

		if (item.visible && (value != null || !item.visible.$nn)) {
			tmp = item.visible.call(item.el, value, path, item.el);
			el.tclass('invisible', !tmp);
			if (!tmp)
				can = false;
		}

		if (item.classes) {
			for (var i = 0; i < item.classes.length; i++) {
				var cls = item.classes[i];
				if (!cls.fn.$nn || value != null)
					el.tclass(cls.name, !!cls.fn.call(el, value, path, el));
			}
		}

		if (can && item.import) {
			if (typeof(item.import) === TYPE_FN) {
				if (value) {
					!item.$ic && (item.$ic = {});
					!item.$ic[value] && IMPORT('ONCE ' + value, el);
					item.$ic[value] = 1;
				}
			} else {
				IMPORT(item.import, el);
				delete item.import;
			}
		}

		if (item.config && (can || item.config.$nv)) {
			if (value != null || !item.config.$nn) {
				tmp = item.config.call(el, value, path, el);
				if (tmp) {
					for (var i = 0; i < el.length; i++) {
						var c = el[i].$com;
						c && c.$ready && c.reconfigure(tmp);
					}
				}
			}
		}

		if (item.html && (can || item.html.$nv)) {
			if (value != null || !item.html.$nn) {
				tmp = item.html.call(el, value, path, el);
				el.html(tmp == null ? (item.htmlbk || '') : tmp);
			} else
				el.html(item.htmlbk || '');
		}

		if (item.text && (can || item.text.$nv)) {
			if (value != null || !item.text.$nn) {
				tmp = item.text.call(el, value, path, el);
				el.text(tmp == null ? (item.htmlbk || '') : tmp);
			} else
				el.html(item.htmlbk || '');
		}

		if (item.val && (can || item.val.$nv)) {
			if (value != null || !item.val.$nn) {
				tmp = item.val.call(el, value, path, el);
				el.val(tmp == null ? (item.valbk || '') : tmp);
			} else
				el.val(item.valbk || '');
		}

		if (item.template && (can || item.template.$nv) && (value != null || !item.template.$nn)) {
			DEFMODEL.value = value;
			DEFMODEL.path = path;
			el.html(item.template(DEFMODEL));
		}

		if (item.disabled && (can || item.disabled.$nv)) {
			if (value != null || !item.disabled.$nn) {
				tmp = item.disabled.call(el, value, path, el);
				el.prop('disabled', tmp == true);
			} else
				el.prop('disabled', item.disabledbk == true);
		}

		if (item.enabled && (can || item.enabled.$nv)) {
			if (value != null || !item.enabled.$nn) {
				tmp = item.enabled.call(el, value, path, el);
				el.prop('disabled', !tmp);
			} else
				el.prop('disabled', item.enabledbk == false);
		}

		if (item.checked && (can || item.checked.$nv)) {
			if (value != null || !item.checked.$nn) {
				tmp = item.checked.call(el, value, path, el);
				el.prop('checked', tmp == true);
			} else
				el.prop('checked', item.checkedbk == true);
		}

		if (item.title && (can || item.title.$nv)) {
			if (value != null || !item.title.$nn) {
				tmp = item.title.call(el, value, path, el);
				el.attr('title', tmp == null ? (item.titlebk || '') : tmp);
			} else
				el.attr('title', item.titlebk || '');
		}

		if (item.href && (can || item.href.$nv)) {
			if (value != null || !item.href.$nn) {
				tmp = item.href.call(el, value, path, el);
				el.attr('href', tmp == null ? (item.hrefbk || '') : tmp);
			} else
				el.attr(item.hrefbk || '');
		}

		if (item.src && (can || item.src.$nv)) {
			if (value != null || !item.src.$nn) {
				tmp = item.src.call(el, value, path, el);
				el.attr('src', tmp == null ? (item.srcbk || '') : tmp);
			} else
				el.attr('src', item.srcbk || '');
		}

		if (item.setter && (can || item.setter.$nv) && (value != null || !item.setter.$nn))
			item.setter.call(el, value, path, el);

		if (item.change && (value != null || !item.change.$nn))
			item.change.call(el, value, path, el);

		if (can && index == null && item.child) {
			for (var i = 0; i < item.child.length; i++)
				item.exec(value, path, i, undefined, can);
		}

		if (item.tclass) {
			el.tclass(item.tclass);
			delete item.tclass;
		}
	};
	function parsebinderskip(str) {
		var a = arguments;
		for (var i = 1; i < a.length; i++) {
			if (str.indexOf(a[i]) !== -1)
				return false;
		}
		return true;
	}

	function parsebinder(el, b, scopes, r) {
		var meta = b.split(REGMETA);
		if (meta.indexOf('|') !== -1) {
			//Multiple watchers (__|__)
			if (!r) {
				var tmp = [];
				var output = [];
				for (var i = 0; i < meta.length; i++) {
					var m = meta[i];
					if (m === '|') {
						if (tmp.length) {
							output.push(parsebinder(el, tmp.join('__'), scopes));
						} 
						tmp = [];
						continue;
					}
					m && tmp.push(m);
				}
				if (tmp.length) {
					output.push(parsebinder(el, tmp.join('__'), scopes, true));
				} 
			}
			return output;
		}

		var path = null;
		var index = null;
		var obj = new jBinder();
		var cls = [];
		var sub = {};
		var e = obj.el = $(el);

		for (var i = 0; i < meta.length; i++) {
			var item = meta[i].trim();
			if (item) {
				if (i) {

					var k, v;

					if (item !== 'template' && item !== '!template' && item !== 'strict') {

						index = item.indexOf(':');

						if (index === -1) {
							index = item.length;
							item += ':value';
						}

						k = item.substring(0, index).trim();
						v = item.substring(index + 1).trim();
					} else {
						k = item;
					}

					if (k === 'selector') {
						obj[k] = v;
						continue;
					}

					var rki = k.indexOf(' ');
					var rk = rki === -1 ? k : k.substring(0, rki);
					var fn = parsebinderskip(rk, 'setter', 'strict', 'track', 'delay', 'import', 'class', 'template') && k.substring(0, 3) !== 'def' ? v.indexOf('=>') !== -1 ? FN(rebinddecode(v)) : isValue(v) ? FN('(value,path,el)=>' + rebinddecode(v), true) : v.substring(0, 1) === '@' ? obj.com[v.substring(1)] : scopes.get(v) : 1;
					if (!fn)
						return null;

					var keys = k.split('+');
					for (var j = 0; j < keys.length; j++) {

						k = keys[j].trim();

						var s = '';
						var notvisible = false;
						var notnull = false;
						var backup = false;

						index = k.indexOf(' ');
						if (index !== -1) {
							s = k.substring(index + 1);
							k = k.substring(0, index);
						}

						k = k.replace(/^(~!|!~|!|~)/, function(text) {
							if (text.indexOf('!') !== -1)
								notnull = true;
							if (text.indexOf('~') !== -1)
								notvisible = true;
							return '';
						});

						var c = k.substring(0, 1);

						if (k === 'class')
							k = 'tclass';

						if (c === '.') {
							if (notnull)
								fn.$nn = 1;
							cls.push({ name: k.substring(1), fn: fn });
							k = 'class';
						}

						if (typeof(fn) === TYPE_FN) {
							if (notnull)
								fn.$nn = 1;
							if (notvisible)
								fn.$nv = 1;
						}

						switch (k) {
							case 'track':
								obj[k] = v.split(',').trim();
								continue;
							case 'strict':
								obj[k] = true;
								continue;
							case 'hidden':
								k = 'hide';
								break;
							case 'exec':
								k = 'change';
								break;
							case 'disable':
								k = 'disabled';
								backup = true;
								break;
							case 'value':
								k = 'val';
								backup = true;
								break;
							case 'default':
								k = 'def';
								break;
							case 'delay':
								fn = +v;
								break;
							case 'href':
							case 'src':
							case 'val':
							case 'title':
							case 'html':
							case 'text':
							case 'disabled':
							case 'enabled':
							case 'checked':
								backup = true;
								break;

							case 'setter':
								fn = langx.fn('(value,path,el)=>el.SETTER(' + v + ')');
								if (notnull)
									fn.$nn = 1;
								if (notvisible)
									fn.$nv =1;
								break;
							case 'import':
								var c = v.substring(0, 1);
								if ((/^(https|http):\/\//).test(v) || c === '/' || c === '.') {
									if (c === '.')
										fn = v.substring(1);
									else
										fn = v;
								}
								else
									fn = FN(rebinddecode(v));
								break;
							case 'tclass':
								fn = v;
								break;
							case 'template':
								var scr = e.find('script');
								if (!scr.length) {
									scr = e;
								}
								fn = Tangular.compile(scr.html());
								if (notnull) {
									fn.$nn = 1;
								}
								if (notvisible) {
									fn.$nv = 1;
								}
								break;
						}

						if (k === 'def') {
							fn = new Function('return ' + v)();
						}

						if (backup && notnull) {
							obj[k + 'bk'] = (k == 'src' || k == 'href' || k == 'title') ? e.attr(k) : (k == 'html' || k == 'text') ? e.html() : k == 'val' ? e.val() : (k == 'disabled' || k == 'checked') ? e.prop(k) : '';
						}

						if (s) {

							if (!sub[s])
								sub[s] = {};

							if (k !== 'class')
								sub[s][k] = fn;

							else {
								var p = cls.pop();
								if (sub[s].cls) {
									sub[s].cls.push(p);
								} else {
									sub[s].cls = [p];
								}
							}
						} else {
							if (k !== 'class') {
								obj[k] = fn;
							}
						}
					}

				} else {

					// path
					path = item;

					var c = path.substring(0, 1);

					if (c === '!') {
						path = path.substring(1);
						obj.notnull = true;
					}

					if (meta.length === 1) {
						var fn = GET(path);
						fn && fn.call(obj.el, obj.el);
						return fn ? fn : null;
					}

					var tmp = findFormat(path);
					if (tmp) {
						path = tmp.path;
						obj.format = tmp.fn;
					}

					// Is virtual path?
					if (c === '.') {
						obj.virtual = true;
						path = path.substring(1);
						continue;
					}

					if (path.substring(path.length - 1) === '.')
						path = path.substring(0, path.length - 1);

					if (path.substring(0, 1) === '@') {
						path = path.substring(1);

						var isCtrl = false;
						if (path.substring(0, 1) === '@') {
							isCtrl = true;
							path = path.substring(1);
						}

						if (!path)
							path = '@';

						var parent = el.parentNode;
						while (parent) {
							if (isCtrl) {
								if (parent.$ctrl) {
									obj.com = parent.$ctrl;
									if (path === '@' && !obj.com.$dataw) {
										obj.com.$dataw = 1;
										obj.com.watch(function(path, value) {
											obj.com.data('@', value);
										});
									}
									break;
								}
							} else {
								if (parent.$com) {
									obj.com = parent.$com;
									break;
								}
							}
							parent = parent.parentNode;
						}

						if (!obj.com)
							return null;
					}
				}
			}
		}

		var keys = Object.keys(sub);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!obj.child)
				obj.child = [];
			var o = sub[key];
			o.selector = key;
			obj.child.push(o);
		}

		if (cls.length)
			obj.classes = cls;

		if (obj.virtual) {
			path = pathmaker(path);
		} else {

			var bj = obj.com && path.substring(0, 1) === '@';
			path = bj ? path : pathmaker(path);

			if (path.indexOf('?') !== -1) {
				// jComponent scopes
				// You can use data-bind in jComponent scopes, but you need to defined ? (question mark) 
				// on the start of data-bind path. Question mark ? will be replaced for a scope path.
				var scope = initscopes(scopes);
				if (scope)
					path = path.replace(/\?/g, scope.path);
				else
					return;
			}

			var arr = path.split('.');
			var p = '';

			if (obj.com) {
				!obj.com.$data[path] && (obj.com.$data[path] = { value: null, items: [] });
				obj.com.$data[path].items.push(obj);
			} else {
				for (var i = 0, length = arr.length; i < length; i++) {
					p += (p ? '.' : '') + arr[i];
					var k = i === length - 1 ? p : '!' + p;
					if (binders[k]) {
						binders[k].push(obj);
					} else {
						binders[k] = [obj];
					}
				}
			}
		}

		obj.path = path;

		if (obj.track) {
			for (var i = 0; i < obj.track.length; i++)
				obj.track[i] = path + '.' + obj.track[i];
		}

		obj.init = 0;
		!obj.virtual && bindersnew.push(obj);
		return obj;
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


	function findFormat(val) {
		var a = val.indexOf('-->');
		var s = 3;

		if (a === -1) {
			a = val.indexOf('->');
			s = 2;
		}

		if (a !== -1) {
			if (val.indexOf('/') !== -1 && val.indexOf('(') === -1)
				val += '(value)';
		}

		return a === -1 ? null : { 
			path: val.substring(0, a).trim(), 
			fn: langx.fn(val.substring(a + s).trim()) 
		};
	}

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

	var REGFNPLUGIN = /[a-z0-9_-]+\/[a-z0-9_]+\(|(^|(?=[^a-z0-9]))@[a-z0-9-_]+\./i;


	var regfnplugin = function(v) {
		var l = v.length;
		return pathmaker(v.substring(0, l - 1)) + v.substring(l - 1);
	};

   /**
   * Generates Function from expression of Arrow Function.
   * @example var fn = FN('n => n.toUpperCase()');
   *          console.log(fn('peter')); //Output: PETER
   * @param  {String} exp 
   * @return {Function} 
   */
	function arrowFn(exp, notrim) {  // W.FN = 

		exp = exp.replace(REGFNPLUGIN, regfnplugin);

		var index = exp.indexOf('=>');
		if (index === -1)
			return isValue(exp) ? FN('value=>' + rebinddecode(exp), true) : new Function('return ' + (exp.indexOf('(') === -1 ? 'typeof({0})==\'function\'?{0}.apply(this,arguments):{0}'.format(exp) : exp));

		var arg = exp.substring(0, index).trim();
		var val = exp.substring(index + 2).trim();
		var is = false;

		arg = arg.replace(/\(|\)|\s/g, '').trim();
		if (arg)
			arg = arg.split(',');

		if (val.charCodeAt(0) === 123 && !notrim) {
			is = true;
			val = val.substring(1, val.length - 1).trim();
		}


		var output = (is ? '' : 'return ') + val;
		switch (arg.length) {
			case 1:
				return new Function(arg[0], output);
			case 2:
				return new Function(arg[0], arg[1], output);
			case 3:
				return new Function(arg[0], arg[1], arg[2], output);
			case 4:
				return new Function(arg[0], arg[1], arg[2], arg[3], output);
			case 0:
			default:
				return new Function(output);
		}
	};

	function VBinder(html) {
		var t = this;
		var e = t.element = $(html);
		t.binders = [];
		var fn = function() {
			var dom = this;
			var el = $(dom);
			var b = el.attrd('bind') || el.attr('bind') || el.attrd('vbind');
			dom.$jcbind = parser.parsebinder(dom, b, langx.empties.array); //EMPTYARRAY);
			if(dom.$jcbind) {
			   t.binders.push(dom.$jcbind);
			}
		};
		e.filter(ATTRBIND).each(fn);
		e.find(ATTRBIND).each(fn);
	}

	var VBP = VBinder.prototype;

	VBP.on = function() {
		var t = this;
		t.element.on.apply(t.element, arguments);
		return t;
	};

	VBP.remove = function() {
		var t = this;
		var e = t.element;
		e.find('*').off();
		e.off().remove();
		t.element = null;
		t.binders = null;
		t = null;
		return t;
	};

	VBP.set = function(path, model) {

		var t = this;

		if (model == null) {
			model = path;
			path = '';
		}

		for (var i = 0; i < t.binders.length; i++) {
			var b = t.binders[i];
			if (!path || path === b.path) {
				var val = path || !b.path ? model : $get(b.path, model);
				t.binders[i].exec(val, b.path);
			}
		}

		return t;
	};


	function vbind(html) { // W.VBIND = 
		return new VBinder(html);
	};

	function vbindArray(html, el) { //W.VBINDARRAY = 
		var obj = {};
		obj.html = html;
		obj.items = [];
		obj.element = el instanceof COM ? el.element : $(el);
		obj.element[0].$vbindarray = obj;
		obj.remove = function() {
			for (var i = 0; i < obj.items.length; i++)
				obj.items[i].remove();
			obj.checksum = null;
			obj.items = null;
			obj.html = null;
			obj.element = null;
		};

		var serialize = function(val) {
			switch (typeof(val)) {
				case TYPE_N:
					return val + '';
				case 'boolean':
					return val ? '1' : '0';
				case TYPE_S:
					return val;
				default:
					return val == null ? '' : val instanceof Date ? val.getTime() : JSON.stringify(val);
			}
		};

		var checksum = function(item) {
			var sum = 0;
			var binder = obj.items[0];
			if (binder) {
				for (var j = 0; j < binder.binders.length; j++) {
					var b = binder.binders[j];
					var p = b.path;
					if (b.track) {
						for (var i = 0; i < b.track.length; i++)
							sum += serialize($get((p ? (p + '.') : '') + b.track[i].substring(1), item));
					} else
						sum += serialize(p ? $get(p, item) : item);
				}
			}
			return HASH(sum);
		};

		obj.set = function(index, value) {

			var sum = null;

			if (!(index instanceof Array)) {
				var item = obj.items[index];
				if (item) {
					sum = checksum(value);
					var el = item.element[0];
					if (el.$bchecksum !== sum) {
						el.$bchecksum = sum;
						item.set(value);
					}
				}
				return obj;
			}

			value = index;

			if (obj.items.length > value.length) {
				var rem = obj.items.splice(value.length);
				for (var i = 0; i < rem.length; i++)
					rem[i].remove();
			}

			for (var i = 0; i < value.length; i++) {
				var val = value[i];
				var item = obj.items[i];

				if (!item) {
					item = vbind(obj.html); //VBIND
					obj.items.push(item);
					item.element.attrd('index', i);
					item.element[0].$vbind = item;
					item.index = i;
					obj.element.append(item.element);
				}

				var el = item.element[0];
				sum = checksum(val);

				if (el.$bchecksum !== sum) {
					el.$bchecksum = sum;
					item.set(val);
				}
			}
		};

		return obj;
	};

	return jc.binders = {
		parser,

		jBinder,

		VBinder,
		vbind,
		vbindArray
	};

});