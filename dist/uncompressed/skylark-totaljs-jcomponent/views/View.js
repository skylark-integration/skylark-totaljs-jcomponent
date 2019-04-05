define([
	"../langx",
	"./compose",
	"./crawler",
	"./download",
	"./pend"
],function(langx, compose, crawler, download, pend){

	var $rebinder;

	function rebindbinder() {
		$rebinder && clearTimeout($rebinder);
		$rebinder = setTimeout(function() {
			var arr = bindersnew.splice(0);
			for (var i = 0; i < arr.length; i++) {
				var item = arr[i];
				if (!item.init) {
					if (item.com) {
						item.exec(item.com.data(item.path), item.path);
					} else {
						item.exec(getx(item.path), item.path);  // GET
					}
				}
			}
		}, 50);
	}

	function keypressdelay(self) {
		var com = self.$com;
		// Reset timeout
		self.$jctimeout = 0;
		// It's not dirty
		com.dirty(false, true);
		// Binds a value
		com.getter(self.value, true);
	}


	var View = langx.Evented.inherit({
	    options : {
	      elmComAttrNames: {
	        base : "data-jc",
	        url : "data-jc-url",
	        removed : "data-jc-removed",
	        released : "data-jc-released",
	        scope : "data-jc-scope"
	      }
	    },

		_construct : function(elm,options) {

			this.is = false;
			this.recompile = false;
			this.importing = 0;
			this.pending = [];
			this.init = [];
			this.imports = {};
			this.ready = [];

			this.storing = storing(this);
		},

		attrcom : function(el) {
			return attrcom(el);
		},

		compile : function (container,immediate) {
			var self = this;

			if (self.is) {
				self.recompile = true;
				return;
			}

			var arr = [];

			if (W.READY instanceof Array)  {
				arr.push.apply(arr, W.READY);
			}
			if (W.jComponent instanceof Array) {
				arr.push.apply(arr, W.jComponent);
			}
			if (W.components instanceof Array) {
				arr.push.apply(arr, W.components);
			}

			if (arr.length) {
				while (true) {
					var fn = arr.shift();
					if (!fn){
						break;
					}
					fn();
				}
			}

			self.is = true;
			download(self);

			if (self.pending.length) {
				(function(container) {
					self.pending.push(function() {
						compile(self,container);
					});
				})(container);
				return;
			}

			var has = false;

			crawler(self,container, compose);

			// perform binder
			rebindbinder();

			if (!has || !self.pending.length) {
				self.is = false;
			}

			if (container !== undefined || !toggles.length) {
				return pend();
			}

			langx.async(toggles, function(item, next) {
				for (var i = 0, length = item.toggle.length; i < length; i++)
					item.element.tclass(item.toggle[i]);
				next();
			}, pend);
		},

		refresh : function () {
			setTimeout2('$refresh', function() {
				all.sort(function(a, b) {  // M.components.sort
					if (a.$removed || !a.path)
						return 1;
					if (b.$removed || !b.path)
						return -1;
					var al = a.path.length;
					var bl = b.path.length;
					return al > bl ? - 1 : al === bl ? LCOMPARER(a.path, b.path) : 1;
				});
			}, 200);
		},

		start : function() {
			var $el = $(this.elm);
			$(document).ready(function() {

				if ($ready) {
					clearTimeout($ready);
					load();
				}

				$el.on('input', 'input[data-jc-bind],textarea[data-jc-bind]', function() {

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

				$el.on('focus blur', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function(e) {

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

				$el.on('change', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function() {

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

		},

		end : function() {

		}

	});

	return View;
});