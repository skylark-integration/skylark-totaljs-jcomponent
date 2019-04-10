define([
	"skylark-utils-dom/query",
	"./jc",
	"./plugins/_registry",
	"./plugins/Plugin"
],function($, jc, registry,Plugin){

	function plugin(name, fn) { //W.PLUGIN = 
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
	
	return jc.plugins = {
		"Plugin" : Plugin,
		"plugin" : plugin,
		"find" : find
	};
});