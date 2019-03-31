define([],function(){

	function keypressdelay(self) {
		var com = self.$com;
		// Reset timeout
		self.$jctimeout = 0;
		// It's not dirty
		com.dirty(false, true);
		// Binds a value
		com.getter(self.value, true);
	}


	function emitwatch(path, value, type) {
		for (var i = 0, length = watches.length; i < length; i++) {
			var self = watches[i];
			if (self.path === '*') {
				self.fn.call(self.context, path, self.format ? self.format(value, path, type) : value, type);
			} else if (path.length > self.path.length) {
				var index = path.lastIndexOf('.', self.path.length);
				if (index === -1 ? false : self.path === path.substring(0, index)) {
					var val = getx(self.path); // GET
					self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
				}
			} else {
				for (var j = 0, jl = self.$path.length; j < jl; j++) {
					if (self.$path[j] === path) {
						var val = get2(self.path);
						self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
						break;
					}
				}
			}
		}
	}


	$(document).ready(function() {

		if ($ready) {
			clearTimeout($ready);
			load();
		}

		$(Window).on('orientationchange', mediaquery);

		$(document).on('input', 'input[data-jc-bind],textarea[data-jc-bind]', function() {

			// realtime binding
			var self = this;
			var com = self.$com;

			if (!com || com.$removed || !com.getter || self.$jckeypress === false) {
				return;
			}

			self.$jcevent = 2;

			if (self.$jckeypress === undefined) {
				var tmp = attrcom(self, 'keypress');
				if (tmp)
					self.$jckeypress = tmp === 'true';
				else if (com.config.$realtime != null)
					self.$jckeypress = com.config.$realtime === true;
				else if (com.config.$binding)
					self.$jckeypress = com.config.$binding === 1;
				else
					self.$jckeypress = MD.keypress;
				if (self.$jckeypress === false)
					return;
			}

			if (self.$jcdelay === undefined) {
				self.$jcdelay = +(attrcom(self, 'keypress-delay') || com.config.$delay || MD.delay);
			}

			if (self.$jconly === undefined) {
				self.$jconly = attrcom(self, 'keypress-only') === 'true' || com.config.$keypress === true || com.config.$binding === 2;
			}

			if (self.$jctimeout) {
				clearTimeout(self.$jctimeout);	
			} 
			self.$jctimeout = setTimeout(keypressdelay, self.$jcdelay, self);
		});

		$(document).on('focus blur', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function(e) {

			var self = this;
			var com = self.$com;

			if (!com || com.$removed || !com.getter)
				return;

			if (e.type === 'focusin')
				self.$jcevent = 1;
			else if (self.$jcevent === 1) {
				com.dirty(false, true);
				com.getter(self.value, 3);
			} else if (self.$jcskip) {
				self.$jcskip = false;
			} else {
				// formatter
				var tmp = com.$skip;
				if (tmp)
					com.$skip = false;
				com.setter(com.get(), com.path, 2);
				if (tmp) {
					com.$skip = tmp;
				}
			}
		});

		$(document).on('change', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function() {

			var self = this;
			var com = self.$com;

			if (self.$jconly || !com || com.$removed || !com.getter)
				return;

			if (self.$jckeypress === false) {
				// bind + validate
				self.$jcskip = true;
				com.getter(self.value, false);
				return;
			}

			switch (self.tagName) {
				case 'SELECT':
					var sel = self[self.selectedIndex];
					self.$jcevent = 2;
					com.dirty(false, true);
					com.getter(sel.value, false);
					return;
				case 'INPUT':
					if (self.type === 'checkbox' || self.type === 'radio') {
						self.$jcevent = 2;
						com.dirty(false, true);
						com.getter(self.checked, false);
						return;
					}
					break;
			}

			if (self.$jctimeout) {
				com.dirty(false, true);
				com.getter(self.value, true);
				clearTimeout(self.$jctimeout);
				self.$jctimeout = 0;
			} else {
				self.$jcskip = true;
				com.setter && com.setterX(com.get(), self.path, 2);
			}
		});

		setTimeout(compile, 2);
		$domready = true;
	});
	
});