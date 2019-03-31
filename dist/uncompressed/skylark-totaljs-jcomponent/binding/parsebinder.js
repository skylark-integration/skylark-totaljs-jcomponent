define([
	"../langx",
	"../utils/query",
	"./func",
	"./pathmaker",
	"./findFormat",
	"./Binder"
],function(langx, $,func,pathmaker,findFormat,jBinder){
	
	var REGMETA = /_{2,}/;
	
	function parsebinderskip(str) {
		var a = arguments;
		for (var i = 1; i < a.length; i++) {
			if (str.indexOf(a[i]) !== -1) {
				return false;
			}
		}
		return true;
	}

	/*
	 * A binder declaration:
	 * <div data-bind="path.to.property__command1:exp__command2:exp__commandN:exp"></div>
	 */
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
					if (m) {
						tmp.push(m);
					}
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
					//command

					var k, // command 
						v; // expression

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
					var fn;

					if ( (parsebinderskip(rk, 'setter', 'strict', 'track', 'delay', 'import', 'class', 'template')) && (k.substring(0, 3) !== 'def') ) {
					   if (v.indexOf('=>') !== -1 ) {
					       fn = func( func.rebinddecode(v)); 
					   } else {   
					       if (func.isValue(v) ) {
					          fn = func('(value,path,el)=>' + func.rebinddecode(v), true) ;
					       } else { 
					          if (v.substring(0, 1) === '@' ) {
					          	  // binding component method
					              fn = obj.com[v.substring(1)] ;
					          } else {
					          	  fn = GET(v) ;
					          } 
					        }
					    }
					} else {
						fn = 1;
					}


					if (!fn) {
						return null;
					}

					var keys = k.split('+'); // commands to same expression with help of + char with spaces on both sides.
					for (var j = 0; j < keys.length; j++) {

						k = keys[j].trim();

						var s = '';
						var notvisible = false;
						var notnull = false;
						var backup = false;

						index = k.indexOf(' ');
						if (index !== -1) {
							s = k.substring(index + 1); // selector
							k = k.substring(0, index);
						}

						k = k.replace(/^(~!|!~|!|~)/, function(text) { 
							if (text.indexOf('!') !== -1) {
								notnull = true; // !command 
							}
							if (text.indexOf('~') !== -1) { 
								notvisible = true; // ~command
							}
							return '';
						});

						var c = k.substring(0, 1);

						if (k === 'class') {
							k = 'tclass';
						}

						if (c === '.') { // command: .class_name
							if (notnull) {
								fn.$nn = 1;
							}
							cls.push({ 
								name: k.substring(1), 
								fn: fn 
							});
							k = 'class';
						}

						if (langx.isFunction(fn)) {
							if (notnull) {
								fn.$nn = 1;
							}
							if (notvisible) {
								fn.$nv = 1;
							}
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
									if (c === '.') {
										fn = v.substring(1);
									} else {
										fn = v;
									}
								}
								else
									fn = func(func.rebinddecode(v));
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

							if (!sub[s]) {
								sub[s] = {};
							}

							if (k !== 'class') {
								sub[s][k] = fn;
							} else {
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

					if (path.substring(path.length - 1) === '.') {
						path = path.substring(0, path.length - 1);
					}

					if (path.substring(0, 1) === '@') {
						//component scope
						path = path.substring(1);

						var isCtrl = false;
						if (path.substring(0, 1) === '@') {
							isCtrl = true;
							path = path.substring(1);
						}

						if (!path) {
							path = '@';
						}

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

						if (!obj.com) {
							return null;
						}
					}
				}
			}
		}

		var keys = Object.keys(sub);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!obj.child) {
				obj.child = [];
			}
			var o = sub[key];
			o.selector = key;
			obj.child.push(o);
		}

		if (cls.length) {
			obj.classes = cls;
		}

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
				if (scope) {
					path = path.replace(/\?/g, scope.path);
				} else {
					return;
				}
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
			for (var i = 0; i < obj.track.length; i++) {
				obj.track[i] = path + '.' + obj.track[i];
			}
		}

		obj.init = 0; 
		if(!obj.virtual) {
			bindersnew.push(obj);
		}
		return obj;
	}

	return parsebinder;
});