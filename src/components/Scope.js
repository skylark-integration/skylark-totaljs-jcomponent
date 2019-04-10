define([
	"../langx"
],function(langx){
	// ===============================================================
	// SCOPE
	// scopes can simplify paths in HTML declaration. In other words: 
	// scopes can reduce paths in all nested components.
	// ===============================================================

	var Scope = langx.klass({
		_construct(elm,view) {
			var self = this;
			self.view = view;
			self.storing = view.storing;
			self.eventer = view.eventer;
		}
	});

	var SCP = Scope.prototype;

	SCP.unwatch = function(path, fn) {
		var self = this;
		self.eventer.off('scope' + self._id + '#watch', self.path + (path ? '.' + path : ''), fn); // OFF
		return self;
	};

	SCP.watch = function(path, fn, init) {
		var self = this;
		self.eventer.on('scope' + self._id + '#watch', self.path + (path ? '.' + path : ''), fn, init, self); // ON 
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
		return this.storing.default(this.path + '.' + (path ? path : '*'), timeout); // DEFAULT
	};

	SCP.set = function(path, value, timeout, reset) {
		return this.storing.setx(this.path + (path ? '.' + path : ''), value, timeout, reset); // SET
	};

	SCP.push = function(path, value, timeout, reset) {
		return this.storing.push(this.path + (path ? '.' + path : ''), value, timeout, reset); // PUSH
	};

	SCP.update = function(path, timeout, reset) {
		return this.storing.update(this.path + (path ? '.' + path : ''), timeout, reset); // UPDATE
	};

	SCP.get = function(path) {
		return this.storing.get(this.path + (path ? '.' + path : '')); // GET
	};

	SCP.can = function(except) {
		return this.storing.can(this.path + '.*', except);  // CAN
	};

	SCP.errors = function(except, highlight) {
		return this.storing.errors(this.path + '.*', except, highlight); // ERRORS
	};

	SCP.remove = function() {
		var self = this;
		var arr = self.view.components;//M.components;

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

		self.eventer.off('scope' + self._id + '#watch'); // OFF
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