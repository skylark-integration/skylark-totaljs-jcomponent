define([
	"../utils/domx",
	"../utils/query",
	"./VirtualBinder"
],function(domx, $, VBinder){
	function vbind(html) { // W.VBIND = 
		return new VBinder(html);
	};

	$.fn.vbind = function() {
		return domx.findinstance(this, '$vbind');
	};

	return vbind;
});
