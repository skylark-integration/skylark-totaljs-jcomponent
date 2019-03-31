define([
	"../topic"
],function(topic) {
	function cleaner2() {
		clear();
		cleaner();
	}

	function cleaner() {
		var is = false;
		var index;

		topic.each(function(key,arr){
			index = 0;
			while (true) {

				var item = arr[index++];
				if (item === undefined) {
					break;
				}

				if (item.context == null || (item.context.element && inDOM(item.context.element[0]))) {
					continue;
				}

				if (item.context && item.context.element) {
					item.context.element.remove();
				}

				item.context.$removed = true;
				item.context = null;
				arr.splice(index - 1, 1);

				if (!arr.length) {
					delete events[key];
				}

				index -= 2;
				is = true;
			}

		});

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


	setInterval(function() {
//		temp = {};
//		paths = {};
		cleaner();
	}, (1000 * 60) * 5);

	return cleaner;
});