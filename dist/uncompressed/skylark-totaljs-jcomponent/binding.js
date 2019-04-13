define([
	"skylark-utils-dom/query",
	"./jc",
	"./langx",
	"./plugins",
	"./binding/Binder",
	"./binding/findFormat",
	"./binding/func",
	"./binding/parse",
	"./binding/pathmaker",
	"./binding/VirtualBinder",
	"./binding/vbind",
	"./binding/vbindArray"
],function($, jc,langx,plugins,Binder,findFormat,func,parse,pathmaker,VirtualBinder,vbind,vbindArray){

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
		"findFormat" : findFormat,
		"func" : func,
		"pathmaker" : pathmaker,
		"parse" : parse,

		"Binder" : Binder,
		"VirtualBinder" : VirtualBinder,
		"vbind" : vbind,
		"vbindArray" : vbindArray
	};

});