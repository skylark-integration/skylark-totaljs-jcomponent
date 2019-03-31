define([
	"skylark-utils-dom/query",
	"./jc",
	"./plugins/Plugin"
],function($, jc, Plugin){
	var registry = {}; // W.PLUGINS

	function plugin(name, fn) { //W.PLUGIN = 
		return fn ? new Plugin(name, fn) : registry[name]; // W.PLUGINS
	};

	function find(name) {
		return registry[name];
	}

	function add(plugin) {
		registry[plugin.name] = plugin;

	}

	function remove() {

	}
	
	return {
		Plugin: Plugin,
		plugin,
		find
	};
});