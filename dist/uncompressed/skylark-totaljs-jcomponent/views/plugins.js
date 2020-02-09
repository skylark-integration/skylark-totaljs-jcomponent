define([
	"../utils/query",
	"../jc"
],function($, jc){

	function plugins() {
		var registry = {}; // W.PLUGINS

		function Plugin(name, fn) {
			if ((/\W/).test(name)) {
				warn('Plugin name must contain A-Z chars only.');
			}
			if (registry[name]) {
				registry[name].$remove(true);
			}
			var t = this;
			//t.element = $(caches.current.element || document.body); // TODO
			t.element = $(".importing");
			t.id = 'plug' + name;
			t.name = name;
			registry[name] = t;
			//var a = caches.current.owner;
			//caches.current.owner = t.id;
			fn.call(t, t);
			//caches.current.owner = a;
			// topic.emit('plugin', t); // EMIT TODO
		}

		Plugin.prototype.$remove = function() {

			var self = this;
			if (!self.element) {	
				return true;
			}

			/* TODO
			topic.emit('plugin.destroy', self); // EMIT
			if (self.destroy) {
				self.destroy();
			}

			// Remove all global events
			Object.keys(events).forEach(function(e) {
				var evt = events[e];
				evt = evt.remove('owner', self.id);
				if (!evt.length) {
					delete events[e];
				}
			});

			watches = watches.remove('owner', self.id);

			// Remove events
			topic.off(self.id + '#watch'); // OFF 
			*/

			// Remove schedulers
			//schedulers = schedulers.remove('owner', self.id);
			//schedulers.clearAll(self.id);

			// self.element.remove();
			self.element = null;

			delete registry[self.name];
			return true;
		};


		function register(name, fn) { //W.PLUGIN = 
			return fn ? new Plugin(name, fn) : registry[name]; // W.PLUGINS
		};

		function find(name) {
			return registry[name];
		}

		function clean() {
				// Checks PLUGINS
				var R = plugins.registry; //W.PLUGINS;
				Object.keys(R).forEach(function(key) {
					var a = R[key];
					if (!inDOM(a.element[0]) || !a.element[0].innerHTML) {
						a.$remove();
						delete R[key];
					}
				});
			
		}
		
		return  {
			"Plugin" : Plugin,
			"register" : register,
			"registry" : registry,
			"find" : find,
			"clean" : clean
		};

	}

	return plugins;
});