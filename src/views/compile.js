define([
	"./jc",
	"./defaults",
	"../langx",
	"./utils/caches",
	"./http",
	"./plugins",
	"./Component",
	"./paths",
	"./views"
],function(jc, defaults, langx, caches, http,plugins,Component,paths,views){


	var M = jc,
		MD = defaults;
		extensions = Component.extensions,
		components = views.components,

		C = jc.compiler = {}; // var C = {}; // COMPILER

	var toggles = [];
    
	C.is = false;
	C.recompile = false;
	C.importing = 0;
	C.pending = [];
	C.init = [];
	C.imports = {};
	C.ready = [];

	C.get = get; // paths

	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================
	var $ready = setTimeout(load, 2);
	var $loaded = false;



	function init(el, obj) {

		var dom = el[0];
		var type = dom.tagName;
		var collection;

		// autobind
		if (domx.inputable(type)) {
			obj.$input = true;
			collection = obj.element;
		} else {
			collection = el;
		}

		findcontrol2(obj, collection);

		obj.released && obj.released(obj.$released);
		components.push(obj); // M.components.push(obj)
		C.init.push(obj);
		type !== 'BODY' && REGCOM.test(el[0].innerHTML) && compile(el);
		ready();
	}


	// Component
	Component.prototype.compile = function(container) {
		var self = this;
		!container && self.attrd('jc-compile') && self.attrd('jc-compile', '1');
		compile(container || self.element);
		return self;
	};


	return compile;

});