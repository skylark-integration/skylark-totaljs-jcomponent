define([],function(){
	var versions = {};
	
   /**
   * sets a version for specific components.
   * ex : version('textbox@1', 'dropdown@1');
   */
	function version() { // W.VERSION = 
		for (var j = 0; j < arguments.length; j++) {
			var keys = arguments[j].split(',');
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i].trim();
				var tmp = key.indexOf('@');
				if (tmp === -1) {
					continue;
				}
				var version = key.substring(tmp + 1);
				key = key.substring(0, tmp);
				if (version) {
					versions[key] = version;
				}
			}
		}
	}

	return version;
	
});