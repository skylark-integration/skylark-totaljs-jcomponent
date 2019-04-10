define([
	"../components/Scope"
],function(Scope){
	function scoper(view) {
		var helper = view.helper;

		function initscopes(scopes) {

			var scope = scopes[scopes.length - 1];
			if (scope.$scopedata) {
				return scope.$scopedata;
			}

			var path = helper.attrscope(scope); //attrcom(scope, 'scope');
			var independent = path.substring(0, 1) === '!';

			if (independent) {
				path = path.substring(1);
			}

			var arr = [scope];
			if (!independent) {
				for (var i = scopes.length - 1; i > -1; i--) {
					arr.push(scopes[i]);
					if (helpers.attrscope(scopes[i]).substring(0, 1) === '!') { // scopes[i].getAttribute(ATTRSCOPE).
						break;
					}
				}
			}

			var absolute = '';

			arr.length && arr.reverse();

			for (var i = 0, length = arr.length; i < length; i++) {

				var sc = arr[i];
				var p = sc.$scope || helper.attrscope(sc); //attrcom(sc, 'scope');

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
					p = langx.guid(25).replace(/\d/g, ''); //GUID

				if (sc.$isolated) {
					absolute = p;
				} else {
					absolute += (absolute ? '.' : '') + p;
				}

				sc.$scope = absolute;
				var d = new Scope();
				d._id = d.ID = d.id = langx.guid(10); //GUID
				d.path = absolute;
				d.elements = arr.slice(0, i + 1);
				d.isolated = sc.$isolated;
				d.element = $(arr[0]);
				sc.$scopedata = d;

				var tmp = helper.attrcom(sc, 'value');
				if (tmp) {
					var fn = new Function('return ' + tmp);
					defaults['#' + HASH(p)] = fn; // paths by path (DEFAULT() --> can reset scope object)
					tmp = fn();
					set(p, tmp);
					emitwatch(p, tmp, 1);
				}

				// Applies classes
				var cls = helper.attrcom(sc, 'class');
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

				tmp = helper.attrcom(sc, 'init');
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


	}

	return scoper;
});