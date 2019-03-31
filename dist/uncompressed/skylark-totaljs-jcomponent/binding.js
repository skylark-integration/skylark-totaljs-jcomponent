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
	paths.parser(function(path, value, type) {

		switch (type) {
			case 'number':
			case 'currency':
			case 'float':
				var v = +(langx.isString(value) ? value.trimAll().replace(REGCOMMA, '.') : value);
				return isNaN(v) ? null : v;

			case 'date':
			case 'datetime':

				if (!value) {
					return null;
				}

				if (value instanceof Date) {
					return value;
				}

				value = value.parseDate();
				return value && value.getTime() ? value : null;
		}

		return value;
	});




	return jc.binding = {
		parser,

		"Binder" : Binder,
		"bind" : bind,
		"VirtualBinder" : VirtualBinder,
		"vbind" : vbind,
		"vbindArray" : vbindArray
	};

});