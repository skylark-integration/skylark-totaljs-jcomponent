define([
	"../langx",
	"../binding/findFormat"
],function(langx,findFormat){
	var MULTIPLE = ' + ';

	function eventer(view) {
		var events = {};

		function emitwatch(path, value, type) {
			for (var i = 0, length = watches.length; i < length; i++) {
				var self = watches[i];
				if (self.path === '*') {
					self.fn.call(self.context, path, self.format ? self.format(value, path, type) : value, type);
				} else if (path.length > self.path.length) {
					var index = path.lastIndexOf('.', self.path.length);
					if (index === -1 ? false : self.path === path.substring(0, index)) {
						var val = view.storing.get(self.path); // GET
						self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
					}
				} else {
					for (var j = 0, jl = self.$path.length; j < jl; j++) {
						if (self.$path[j] === path) {
							var val = view.storing.get(self.path); // get2
							self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
							break;
						}
					}
				}
			}
		}

		// ===============================================================
		// Eventer
		// ===============================================================


		function on(name, path, fn, init, context) {

			if (name.indexOf(MULTIPLE) !== -1) {
				//ex: ON('name1 + name2 + name3', function() {});
				var arr = name.split(MULTIPLE).trim();
				for (var i = 0; i < arr.length; i++) {
					on(arr[i], path, fn, init, context);
				}
				return this; //W;
			}

			var push = true;

			if (name.substring(0, 1) === '^') {
				push = false;
				name = name.substring(1);
			}

			var owner = null;
			var index = name.indexOf('#');

			if (index) {
				owner = name.substring(0, index).trim();
				name = name.substring(index + 1).trim();
			}

			if (langx.isFunction(path)) {
				fn = path;
				path = name === 'watch' ? '*' : '';
			} else {
				path = path.replace('.*', '');
			}

			var obj = { 
				name: name, 
				fn: fn, 
				owner: owner , 
				context: context 
//				owner: owner || current_owner, 
//				context: context || (current_com == null ? undefined : current_com) 
			};

			if (name === 'watch') {
				var arr = [];

				var tmp = findFormat(path);
				if (tmp) {
					path = tmp.path;
					obj.format = tmp.fn;
				}

				if (path.substring(path.length - 1) === '.') {
					path = path.substring(0, path.length - 1);
				}

				// Temporary
				if (path.charCodeAt(0) === 37) { // %
					path = 'jctmp.' + path.substring(1);
				}

				path = path.env();

				// !path = fixed path
				if (path.charCodeAt(0) === 33) { // !
					path = path.substring(1);
					arr.push(path);
				} else {
					var p = path.split('.');
					var s = [];
					for (var j = 0; j < p.length; j++) {
						var b = p[j].lastIndexOf('[');
						if (b !== -1) {
							var c = s.join('.');
							arr.push(c + (c ? '.' : '') + p[j].substring(0, b));
						}
						s.push(p[j]);
						arr.push(s.join('.'));
					}
				}

				obj.path = path;
				obj.$path = arr;

				if (push) {
					watches.push(obj);
				} else {
					watches.unshift(obj);
				}

				init && fn.call(context || view, path, obj.format ? obj.format(view.storing.get(path), path, 0) : view.storing.get(path), 0); // || M
			} else {
				if (events[name]) {
					if (push) {
						events[name].push(obj);
					} else {
						events[name].unshift(obj);
					}
				} else {
					events[name] = [obj];
				}
				//(!C.ready && (name === 'ready' || name === 'init')) && fn(); // TODO: lwf
			}
			return this; //W;
		}

		function off(name, path, fn) {

			if (name.indexOf('+') !== -1) {
				var arr = name.split('+').trim();
				for (var i = 0; i < arr.length; i++) {
					off(arr[i], path, fn); //W.OFF
				}
				return this; //W;
			}

			if (lang.isFunction(path)) {
				fn = path;
				path = '';
			}

			if (path === undefined) {
				path = '';
			}

			var owner = null;
			var index = name.indexOf('#');
			if (index) {
				owner = name.substring(0, index).trim();
				name = name.substring(index + 1).trim();
			}

			if (path) {
				path = path.replace('.*', '').trim();
				var tmp = findFormat(path);
				if (tmp) {
					path = tmp.path;
				}
				if (path.substring(path.length - 1) === '.') {
					path = path.substring(0, path.length - 1);
				}
			}

			var type = 0;

			if (owner && !path && !fn && !name)
				type = 1;
			else if (owner && name && !fn && !path)
				type = 2;
			else if (owner && name && path)
				type = 3;
			else if (owner && name && path && fn)
				type = 4;
			else if (name && path && fn)
				type = 5;
			else if (name && path)
				type = 7;
			else if (fn)
				type = 6;

			var cleararr = function(arr, key) {
				return arr.remove(function(item) {
					if (type > 2 && type < 5) {
						if (item.path !== path)
							return false;
					}
					var v = false;
					if (type === 1)
						v = item.owner === owner;
					else if (type === 2)
						v = key === name && item.owner === owner;
					else if (type === 3)
						v = key === name && item.owner === owner;
					else if (type === 4)
						v = key === name && item.owner === owner && item.fn === fn;
					else if (type === 5 || type === 6)
						v = key === name && item.fn === fn;
					else if (type === 6)
						v = item.fn === fn;
					else if (type === 7)
						v = key === name && item.path === path;
					else
						v = key === name;
					return v;
				});
			};

			Object.keys(events).forEach(function(p) {
				events[p] = cleararr(events[p], p);
				if (!events[p].length) {
					delete events[p];
				}
			});

			watches = cleararr(watches, 'watch');
			return this; //W;
		}

		function emit(name) {

			var e = events[name];
			if (!e) {
				return false;
			}

			var args = [];

			for (var i = 1, length = arguments.length; i < length; i++) {
				args.push(arguments[i]);
			}

			for (var i = 0, length = e.length; i < length; i++) {
				var context = e[i].context;
				if (context !== undefined && (context === null || context.$removed)) {
					continue;
				}
				e[i].fn.apply(context || window, args);
			}

			return true;
		}

		function each(fn) {

			var keys = Object.keys(events);
			var length = keys.length;

			for (var i = 0; i < length; i++) {
				var key = keys[i];
				arr = events[key];
				fn(key,arr);

				if (!arr.length) {
					delete events[key];
				}

			}

		}

		var watches = [];

		function unwatch(path, fn) { //W.UNWATCH 

			if (path.indexOf(MULTIPLE) !== -1) {
				var arr = path.split(MULTIPLE).trim();
				for (var i = 0; i < arr.length; i++)
					unwatch(arr[i], fn);
				return this; //W;
			}

			return off('watch', path, fn); //OFF
		};

		function watch(path, fn, init) { // W.WATCH

			if (path.indexOf(MULTIPLE) !== -1) {
				var arr = path.split(MULTIPLE).trim();
				for (var i = 0; i < arr.length; i++)
					watch(arr[i], fn, init);
				return this; //W;
			}

			if (langx.isFunction(path)) { //if (typeof(path) === TYPE_FN) {
				init = fn;
				fn = path;
				path = '*';
			}

			var push = '';

			if (path.substring(0, 1) === '^') {
				path = path.substring(1);
				push = '^';
			}

			path = view.binding.pathmaker(path, true);
			on(push + 'watch', path, fn, init);  // ON
			return this; //W;
		}

		function clean() {
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
		}

		return {
			"clean" : clean,
			"on" : on,
			"off" : off,
			"emit" : emit,
			"watch" : watch,
			"unwatch" : unwatch,
			"emitwatch" : emitwatch
		};

	}

	return eventer;
});