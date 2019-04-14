define([
	"../langx",
	"../utils/domx",
	"./binding",
	"./componenter",
	"./eventer",
	"./compiler",
	"./helper",
	"./scoper",
	"./storing",
],function(langx, domx, binding, componenter, eventer,compiler, helper,scoper,storing){

	function keypressdelay(self) {
		var com = self.$com;
		// Reset timeout
		self.$jctimeout = 0;
		// It's not dirty
		com.dirty(false, true);
		// Binds a value
		com.getter(self.value, true);
	}


	// data-scope    
	// data-compile 
	// data-released 
	// data-vendor
	// data-store
	// data-com
	// data-bind
	var View = domx.Plugin.inherit({
	    options : {
	      elmAttrNames: {
	        scope   : "data-scope",             // data-jc-scope
	        bind    : "data-bind",              // data-bind
	        store   : "data-store",
	      	com  : {
		        base     : "data-com",          // data-jc
		        url      : "data-comp-url",     // data-jc-url
		        removed  : "data-com-removed",  //data-jc-removed
		        released : "data-com-released", //data-jc-released
	      	},
	        compile : "data-compile"            // data-jc-comile
	      }
	    },

		_construct : function(elm,options) {
			domx.Plugin.prototype._construct.apply(this,arguments);

			this.eventer = eventer(this);
			this.scoper = scoper(this);
			this.storing = storing(this);
			this.helper = helper(this);
			this.componenter = componenter(this);
			this.binding = binding(this);
			this.compiler = compiler(this);
		},

	   /**
	   * Create new components dynamically.
	   * @param  {String|Array<String>} declaration 
	   * @param  {jQuery Element/Component/Scope/Plugin} element optional,a parent element (default: "document.body")
	   */
		add : function (value, element) { // W.ADD =
			if (element instanceof COM || element instanceof Scope || element instanceof Plugin) {
				element = element.element;
			}
			if (value instanceof Array) {
				for (var i = 0; i < value.length; i++)
					ADD(value[i], element);
			} else {
				$(element || document.body).append('<div data-jc="{0}"></div>'.format(value));
				setTimeout2('ADD', COMPILE, 10);
			}
		},

		compile : function (container,immediate) {

		},

		refresh : function () {
			setTimeout2('$refresh', function() {
				componenter.components.sort(function(a, b) {  // M.components.sort
					if (a.$removed || !a.path)
						return 1;
					if (b.$removed || !b.path)
						return -1;
					var al = a.path.length;
					var bl = b.path.length;
					return al > bl ? - 1 : al === bl ? langx.localCompare(a.path, b.path) : 1;
				});
			}, 200);
		},

		start : function() {
			var $el = $(this._elm);

			//if ($ready) {
			//	clearTimeout($ready);
			//	load();
			//}

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

			//setTimeout(compile, 2);

		},

		end : function() {

		}

	});

	return View;
});