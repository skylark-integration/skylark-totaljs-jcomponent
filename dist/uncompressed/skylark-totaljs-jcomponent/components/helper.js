define([
	"skylark-utils-dom/query"
],function($){

	var ATTRCOM = '[data-jc]',
		ATTRURL = '[data-jc-url]',
		ATTRDATA = 'jc',
		ATTRDEL = 'data-jc-removed',
		ATTRREL = 'data-jc-released',
		ATTRSCOPE = 'data-jc-scope';


	var REGCOM = /(data-jc|data-jc-url|data-jc-import|data-bind|bind):|COMPONENT\(/;


	function attrcom(el, name) {
		name = name ? '-' + name : '';
		return el.getAttribute ? el.getAttribute('data-jc' + name) : el.attrd('jc' + name);
	}

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

		domx.inputable(container) && onElement(container);

		if (level == null) {
			level = 0;
		} else {
			level++;
		}

		for (var i = 0, length = arr.length; i < length; i++) {
			var el = arr[i];
			if (el && el.tagName) {
				el.childNodes.length && el.tagName !== 'SCRIPT' && el.getAttribute('data-jc') == null && sub.push(el);
				if (domx.inputable(el) && el.getAttribute('data-jc-bind') != null && onElement(el) === false)
					return;
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			if (el && findcontrol(el, onElement, level) === false) {
				return;
			}
		}
	}

	// find all nested component
	function nested(el) {
		var $el = $(el),
			arr = [];
		$el.find(ATTRCOM).each(function() {
			var el = $(this);
			var com = el[0].$com;
			if (com && !el.attr(ATTRDEL)) {
				if (com instanceof Array) {
					arr.push.apply(arr, com);
				} else {
					arr.push(com);
				}
			}
		});
		return arr;
	}

	// destory all nested component
	function kill(el) {
		var $el = $(el);
		$el.removeData(ATTRDATA);
		$el.attr(ATTRDEL, 'true').find(ATTRCOM).attr(ATTRDEL, 'true');
	}


	$.fn.scope = function() {

		if (!this.length) {
			return null; 
		}

		var data = this[0].$scopedata;
		if (data) {
			return data;
		}
		var el = this.closest('[' + ATTRSCOPE + ']');
		if (el.length) {
			data = el[0].$scopedata;
			if (data) {
				return data;
			}
		}
		return null;
	};

});