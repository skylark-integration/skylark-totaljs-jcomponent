define([
	"../plugins"
],function(plugins){

	function pathmaker(path, clean) {

		if (!path) {
			return path;
		}

		var tmp = '';

		if (clean) {
			var index = path.indexOf(' ');
			if (index !== -1) {
				tmp = path.substring(index);
				path = path.substring(0, index);
			}
		}

		// temporary
		if (path.charCodeAt(0) === 37)  { // % 
			return 'jctmp.' + path.substring(1) + tmp;
		}
		
		if (path.charCodeAt(0) === 64) { // @
			// parent component.data()
			return path;
		}

		var index = path.indexOf('/');

		if (index === -1) {
			return path + tmp;
		}

		var p = path.substring(0, index);
		var rem = plugins.find(p); //W.PLUGINS[p];
		return ((rem ? ('PLUGINS.' + p) : (p + '_plugin_not_found')) + '.' + path.substring(index + 1)) + tmp;
	}

	return pathmaker;

});