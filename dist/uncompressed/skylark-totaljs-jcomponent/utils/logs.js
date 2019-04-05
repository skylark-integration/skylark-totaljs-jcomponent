define([
	"../langx"
],function(langx){
	var W = langx.hoster.global;

	function warn() { // W.WARN
		if (W.console) {
			W.console.warn.apply(W.console, arguments);
		}
	};
	
	return {
		warn
	}

});