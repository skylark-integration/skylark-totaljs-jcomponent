define([
	"../utils/query",
	"../components/helper",
	"../binding/parsebinder"
],function($, helper, parsebinder){
	var attrcom = helper.attrcom;

	function crawler(container, onComponent, level, paths) {

		if (container) {
			container = $(container)[0];
		} else {
			container = document.body;
		}

		if (!container) {
			return;
		}

		var comp = attrcom(container, 'compile') ;
		if (comp === '0' || comp === 'false') {
			// no compile
			return;
		}

		if (level == null || level === 0) {
			paths = [];
			if (container !== document.body) {
				var scope = $(container).closest('[' + ATTRSCOPE + ']');
				if (scope && scope.length) {
					paths.push(scope[0]);
				}
			}
		}

		var b = null;
		var released = container ? attrcom(container, 'released') === 'true' : false;
		var tmp = attrcom(container, 'scope');
		var binders = null;

		if (tmp) {
			paths.push(container);
		}

		if (!container.$jcbind) {
			b = container.getAttribute('data-bind') || container.getAttribute('bind');
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

		var name = attrcom(container);
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

				comp = el.getAttribute('data-jc-compile');
				if (comp === '0' || comp === 'false') {
					continue;
				}

				if (el.$com === undefined) {
					name = attrcom(el);
					if (name != null) {
						if (released) {
							el.setAttribute(ATTRREL, 'true');
						}
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
				if (comp !== '0' && comp !== 'false') {
					if (el.childNodes.length && el.tagName !== 'SCRIPT' && REGCOM.test(el.innerHTML) && sub.indexOf(el) === -1)  {
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

	return crawler;
});
