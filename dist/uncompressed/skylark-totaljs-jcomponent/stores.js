define([
	"skylark-langx/langx",
	"./jc",
	"./stores/Store"
],function(langx, jc, Store){


	// paths -> view model

	var REGPARAMS = /\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi;

	var proxy = {};

	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================

	var REGISARR = /\[\d+\]$/;


	Array.prototype.findValue = function(cb, value, path, def, cache) {

		if (langx.isFunction(cb)) {
			def = path;
			path = value;
			value = undefined;
			cache = false;
		}

		var key, val = def;

		if (cache) {
			key = 'fv_' + cb + '=' + value;
			if (caches.temp[key]) {
				return caches.temp[key];
			}
		}

		var index = this.findIndex(cb, value);
		if (index !== -1) {
			var item = this[index];
			if (path.indexOf('.') === -1) {
				item = item[path];
			} else {
				item = get(path, item);
			}
			cache && (caches.temp[key] = val);
			val = item == null ? def : item;
		}

		return val;
	};

	String.prototype.params = String.prototype.arg = function(obj) {
		return this.replace(REGPARAMS, function(text) {
			// Is double?
			var l = text.charCodeAt(1) === 123 ? 2 : 1;
			var val = get(text.substring(l, text.length - l).trim(), obj);
			return val == null ? text : val;
		});
	};



	return jc.stores  = {
		"Store" : Store
	}
});