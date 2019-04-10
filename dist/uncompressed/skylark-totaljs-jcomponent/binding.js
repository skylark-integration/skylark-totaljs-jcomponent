define([
	"skylark-utils-dom/query",
	"./jc",
	"./langx",
	"./plugins",
	"./binding/Binder",
	"./binding/bind",
	"./binding/VirtualBinder",
	"./binding/vbind",
	"./binding/vbindArray"
],function($, jc,langx,plugins,Binder,bind,VirtualBinder,vbind,vbindArray){

	var REGCOMMA = /,/g;


	//var W = jc.W = {};


	// temporary
	//W.jctmp = {}; // not used
	//W.W = window; 
	//W.FUNC = {};



	
	// ===============================================================
	// MAIN FUNCTIONS
	// ===============================================================



//	jc.$parser.push(function(path, value, type) {

	return jc.binding = {
		parser,

		"Binder" : Binder,
		"bind" : bind,
		"VirtualBinder" : VirtualBinder,
		"vbind" : vbind,
		"vbindArray" : vbindArray
	};

});