define([
	"./jc",
	"./defaults",
	"./langx"
],function(jc,defaults,langx){
	var M = jc,
		MD = defaults;

	var cache = {};


	var autofill = [];
	var current = {
		owner : null,
		element : null,
		com : null
	};

	//var current_owner = null;
	//var current_element = null;
	//var current_com = null;	

	// cache
	function get(key) {
		return cache[key];
	}

	function put(key,value) {
		cache[key] = value;
		return this;
	}

	function clear() {

		if (!arguments.length) {
			cache = {};
			return;
		}

		var arr = langx.keys(cache);

		for (var i = 0, length = arr.length; i < length; i++) {
			var key = arr[i];
			var remove = false;
			var a = arguments;

			for (var j = 0; j < a.length; j++) {
				if (key.substring(0, a[j].length) !== a[j]) {
					continue;
				}
				remove = true;
				break;
			}

			if (remove) {
				delete cache[key];
			}
		}
	}

	var temp = {};

	setInterval(function() {
//		temp = {};
		for (var k in temp) {
			delete temp[k];
		}
//		paths = {};
//		cleaner();
	}, (1000 * 60) * 5);	

	return {
		get,
		put,
		clear,

		temp,
		autofill,
		cache,
		current
	};
});