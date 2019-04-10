define([
	"../langx"
],function(langx){
	var Store = langx.Evented.inherit({
		_construct : function(options) {
			this.data = options.data;
		}

	});

	return Store;
});