define([
	"skylark-utils-dom/query",
	"../utils/cache",
	"./_registry"
],function($, caches, registry){
	
	function Plugin(name, fn) {
		if ((/\W/).test(name)) {
			warn('Plugin name must contain A-Z chars only.');
		}
		if (registry[name]) {
			registry[name].$remove(true);
		}
		var t = this;
		//t.element = $(caches.current.element || document.body); // TODO
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


	return Plugin;
});