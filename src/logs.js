define([],function(){

	function warn() { // W.WARN
		Window.console && Window.console.warn.apply(W.console, arguments);
	};
	
	return {
		warn
	}

});