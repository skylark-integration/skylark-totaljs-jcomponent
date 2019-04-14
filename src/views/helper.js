define([
	"../langx",	
	"../utils/domx",	
	"../utils/query",	
	"../components/Component",
	"../components/configs"
],function(langx, domx, $,Component,configs){

	var MD = {
		keypress : true,

	};

	function helper(view) {
		var ATTRCOM = '[data-jc]',
			ATTRURL = '[data-jc-url]',
			ATTRDATA = 'jc',
			ATTRDEL = 'data-jc-removed',
			ATTRREL = 'data-jc-released',
			ATTRSCOPE = 'data-jc-scope',
			ATTRCOMPILE = 'data-jc-comile';


		var REGCOM = /(data-jc|data-jc-url|data-jc-import|data-bind|bind)=|COMPONENT\(/;

		function findControl2(com, input) {

			if (com.$inputcontrol) {
				if (com.$inputcontrol % 2 !== 0) {
					com.$inputcontrol++;
					return;
				}
			}

			var target = input ? input : com.element;
			findControl(target[0], function(el) {
				if (!el.$com || el.$com !== com) {
					el.$com = com;
					com.$inputcontrol = 1;
				}
			});
		}

		function findControl(container, onElement, level) {

			var arr = container.childNodes;
			var sub = [];

			domx.inputable(container) && onElement(container);

			if (level == null) {
				level = 0;
			} else {
				level++;
			}

			for (var i = 0, length = arr.length; i < length; i++) {
				var el = arr[i];
				if (el && el.tagName) {
					el.childNodes.length && el.tagName !== 'SCRIPT' && el.getAttribute('data-jc') == null && sub.push(el);
					if (domx.inputable(el) && el.getAttribute('data-jc-bind') != null && onElement(el) === false)
						return;
				}
			}

			for (var i = 0, length = sub.length; i < length; i++) {
				el = sub[i];
				if (el && findControl(el, onElement, level) === false) {
					return;
				}
			}
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

		function findComponent(container, selector, callback) {
			var components = view.components;

			var s = (selector ? selector.split(' ') : []);
			var path = '';
			var name = '';
			var id = '';
			var version = '';
			var index;

			for (var i = 0, length = s.length; i < length; i++) {
				switch (s[i].substring(0, 1)) {
					case '*':
						break;
					case '.':
						// path
						path = s[i].substring(1);
						break;
					case '#':
						// id;
						id = s[i].substring(1);
						index = id.indexOf('[');
						if (index !== -1) {
							path = id.substring(index + 1, id.length - 1).trim();
							id = id.substring(0, index);
						}
						break;
					default:
						// name
						name = s[i];
						index = name.indexOf('[');

						if (index !== -1) {
							path = name.substring(index + 1, name.length - 1).trim();
							name = name.substring(0, index);
						}

						index = name.lastIndexOf('@');

						if (index !== -1) {
							version = name.substring(index + 1);
							name = name.substring(0, index);
						}

						break;
				}
			}

			var arr = callback ? undefined : [];
			if (container) {
				var stop = false;
				container.find('['+view.option("elmAttrNames.com.base")+']').each(function() { // [data-jc]
					var com = this.$com;

					if (stop || !com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.$version !== version) || (path && (com.$pp || (com.path !== path && (!com.pathscope || ((com.pathscope + '.' + path) !== com.path))))))
						return;

					if (callback) {
						if (callback(com) === false) {
							stop = true;
						}
					} else {
						arr.push(com);
					}
				});
			} else {
				for (var i = 0, length = components.length; i < length; i++) { // M.components.length
					var com = components[i]; // M.components[i]
					if (!com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.$version !== version) || ((path && (com.$pp || (com.path !== path && (!com.pathscope || ((com.pathscope + '.' + path) !== com.path)))))))
						continue;

					if (callback) {
						if (callback(com) === false) {
							break;
						}
					} else {
						arr.push(com);
					}
				}
			}

			return arr;
		}

		function attrcom(el, name) {
			name = name ? '-' + name : '';
			return el.getAttribute ? el.getAttribute('data-jc' + name) : el.attrd('jc' + name);
		}

		function attrbind(el) {
			return el.getAttribute('data-bind') || el.getAttribute('bind');
		}

		function attrscope(el) {
			return el.getAttribute(ATTRSCOPE);
		}

		function scope(el) {
			var results = $(el).closest('[' + ATTRCOMPILE + ']');
			if (results && results.length) {
				return reesults[0];
			}
		}

		function nocompile(el,value) {
			if (value === undefined) {
				var value = $(el).attr(ATTRCOMPILE) ;
				if (value === '0' || value === 'false') {
					// no compile
					return true;
				} else {
					return false;
				}
			} else {
				$(el).attr(ATTRCOMPILE,value);
				return this; 
			}
		}

		function released(el,value) {
			if (value === undefined) {
				var value = $(el).attr(ATTRREL) ;
				if (value === '0' || value === 'false') {
					// no compile
					return true;
				} else {
					return false;
				}
			} else {
				$(el).attr(ATTRREL,value);
				return this; 
			}
		}		

		function canCompile(el) {
			var html = el.innerHTML ? el.innerHTML : el;
			return REGCOM.test(html);
		}

		function findUrl(container) {
			return $(ATTRURL,container);
		}

		function makeurl(url, make) {

			// TODO
			//defaults.makeurl && (url = defaults.makeurl(url));
			//
			//if (make)
			//	return url;

			var builder = [];
			var en = encodeURIComponent;

			//M.$version && builder.push('version=' + en(M.$version));
			//M.$language && builder.push('language=' + en(M.$language));

			if (!builder.length)
				return url;

			var index = url.indexOf('?');
			if (index == -1)
				url += '?';
			else
				url += '&';

			return url + builder.join('&');
		}

		function startView() {
			var $el = $(view.elm());

			//if ($ready) {
			//	clearTimeout($ready);
			//	load();
			//}

			function keypressdelay(self) {
				var com = self.$com;
				// Reset timeout
				self.$jctimeout = 0;
				// It's not dirty
				com.dirty(false, true);
				// Binds a value
				com.getter(self.value, true);
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

			//setTimeout(compile, 2);

		}

		return {
			"attrcom" 		: attrcom,
			"attrbind"      : attrbind,
			"attrscope"     : attrscope,
			"canCompile"    : canCompile,
			"Component"     : Component,
			"findComponent" : findComponent,
			"findControl" 	: findControl,
			"findControl2" 	: findControl2,
			"findUrl"       : findUrl,
			"kill"          : kill,
			"makeurl"		: makeurl,
			"nested"        : nested,
			"nocompile" 	: nocompile,
			"released" 		: released,
			"scope" 		: scope,
			"startView"     : startView
		};

	}

	return helper;
});