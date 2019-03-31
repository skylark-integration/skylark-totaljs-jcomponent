define([
	"skylark-langx/skylark",
	"skylark-langx/langx",
	"skylark-utils-dom/query"
],function(skylark,langx,$){
	var totaljs = skylark.totaljs = {};
	var M = totaljs.jc = {
		isPRIVATEMODE : false,
		isMOBILE : /Mobi/.test(navigator.userAgent),
		isROBOT : navigator.userAgent ? (/search|agent|bot|crawler|spider/i).test(navigator.userAgent) : true,
		isSTANDALONE : navigator.standalone || window.matchMedia('(display-mode: standalone)').matches,
		isTOUCH : !!('ontouchstart' in window || navigator.maxTouchPoints)
	}; // W.MAIN = W.M = W.jC = W.COM = M = {};

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


	var BLACKLIST = { sort: 1, reverse: 1, splice: 1, slice: 1, pop: 1, unshift: 1, shift: 1, push: 1 };


	//- queryex



	//- parseBinder
	//- jBinder


	//- Plugin


	M.months = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
	M.days = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

	//M.skipproxy = '';

	M.loaded = false;
	M.version = 16.044;
	//M.$localstorage = 'jc';
	M.$version = '';
	M.$language = '';

	//M.$parser = [];
	//M.transforms = {};
	//M.compiler = C;

	//M.compile = compile;

	M.environment = function(name, version, language, env) {
		M.$localstorage = name;
		M.$version = version || '';
		M.$language = language || '';
		env && ENV(env);
		return M;
	};


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