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

	
	return jc.plugins = {
		"Plugin" : Plugin,
		"plugin" : plugin,
		"find" : find
	};
});