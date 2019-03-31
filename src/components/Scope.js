define([
	"../langx",
	"../topic",
],function(langx,topic){
	// ===============================================================
	// SCOPE
	// scopes can simplify paths in HTML declaration. In other words: 
	// scopes can reduce paths in all nested components.
	// ===============================================================

	function Scope() {

	}

	var SCP = Scope.prototype;

	SCP.unwatch = function(path, fn) {
		var self = this;
		topic.off('scope' + self._id + '#watch', self.path + (path ? '.' + path : ''), fn); // OFF
		return self;
	};

	SCP.watch = function(path, fn, init) {
		var self = this;
		topic.on('scope' + self._id + '#watch', self.path + (path ? '.' + path : ''), fn, init, self); // ON 
		return self;
	};

	SCP.reset = function(path, timeout) {
		if (path > 0) {
			timeout = path;
			path = '';
		}
		return RESET(this.path + '.' + (path ? + path : '*'), timeout);
	};

	SCP.default = function(path, timeout) {
		if (path > 0) {
			timeout = path;
			path = '';
		}
		return DEFAULT(this.path + '.' + (path ? path : '*'), timeout);
	};

	SCP.set = function(path, value, timeout, reset) {
		return setx(this.path + (path ? '.' + path : ''), value, timeout, reset); // SET
	};

	SCP.push = function(path, value, timeout, reset) {
		return push(this.path + (path ? '.' + path : ''), value, timeout, reset); // PUSH
	};

	SCP.update = function(path, timeout, reset) {
		return update(this.path + (path ? '.' + path : ''), timeout, reset); // UPDATE
	};

	SCP.get = function(path) {
		return getx(this.path + (path ? '.' + path : '')); // GET
	};

	SCP.can = function(except) {
		return CAN(this.path + '.*', except);
	};

	SCP.errors = function(except, highlight) {
		return errors(this.path + '.*', except, highlight); // ERRORS
	};

	SCP.remove = function() {
		var self = this;
		var arr = M.components.all;//M.components;

		for (var i = 0; i < arr.length; i++) {
			var a = arr[i];
			a.scope && a.scope.path === self.path && a.remove(true);
		}

		if (self.isolated) {
			arr = Object.keys(proxy);
			for (var i = 0; i < arr.length; i++) {
				var a = arr[i];
				if (a.substring(0, self.path.length) === self.path)
					delete proxy[a];
			}
		}

		topic.off('scope' + self._id + '#watch'); // OFF
		var e = self.element;
		e.find('*').off();
		e.off();
		e.remove();
		langx.setTimeout2('$cleaner', cleaner2, 100);
	};

	SCP.FIND = function(selector, many, callback, timeout) {
		return this.element.FIND(selector, many, callback, timeout);
	};

	SCP.SETTER = function(a, b, c, d, e, f, g) {
		return this.element.SETTER(a, b, c, d, e, f, g);
	};

	SCP.RECONFIGURE = function(selector, name) {
		return this.element.RECONFIGURE(selector, name);
	};

	return Scope;
	
})