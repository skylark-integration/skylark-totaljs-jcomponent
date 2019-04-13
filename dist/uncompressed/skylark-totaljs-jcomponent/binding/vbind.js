define([
	"../utils/domx",
	"../utils/query",
	"./VirtualBinder"
],function(domx, $, VBinder){
	function vbind(html) { // W.VBIND = 
		return new VBinder(html);
	};

	return vbind;
});
