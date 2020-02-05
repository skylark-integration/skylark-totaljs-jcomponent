define([
	"skylark-langx/skylark",
	"skylark-langx/langx",
	"./utils/query"
],function(skylark,langx,$){
	var M = skylark.attach("intg.totaljs.jc",{}); // W.MAIN = W.M = W.jC = W.COM = M = {};

	// Internal cache
	//var blocked = {};
	//var storage = {};
	//var extensions = {}; // COMPONENT_EXTEND()
	//var configs = [];
	//var cache = {};
	//var paths = {}; // saved paths from get() and set()
	//var events = {};
	//var temp = {};
	//var toggles = [];
	//var versions = {};
	//var autofill = [];
	//var defaults = {};
	//var skips = {};

	//var current_owner = null;
	//var current_element = null;
	//var current_com = null;

	//W.EMPTYARRAY = [];
	//W.EMPTYOBJECT = {};
	//W.DATETIME = W.NOW = new Date();

	//- defaults

	//- M
	
	//- C



	//- VBinder

	//- W




	//- Scope


	//- Component

	//- Usage


	//- Windows

	//- Arrayx

	// ===============================================================
	// PROTOTYPES
	// ===============================================================
    
    //- Ex


	//- queryex



	//- parseBinder
	//- jBinder


	//- Plugin


	//M.months 
	//M.days 

	//M.skipproxy = '';

	//M.loaded = false;
	M.version = 16.044;
	//M.$localstorage = 'jc';
	M.$version = '';
	M.$language = '';

	//M.$parser = [];
	//M.transforms = {};
	//M.compiler = C;

	//M.compile = compile;


	M.prototypes = function(fn) {
		var obj = {};
		obj.Component = PPC;
		obj.Usage = USAGE.prototype;
		obj.Plugin = Plugin.prototype;
		fn.call(obj, obj);
		return M;
	};


	return M;
});