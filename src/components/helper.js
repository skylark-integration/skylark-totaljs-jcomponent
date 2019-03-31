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