define([
	"../langx"
],function(langx){

	var $localstorage = 'jc.'; //M.$localstorage


	function get(key) {
		var value = localStorage.getItem($localstorage + key);
		if (value && langx.isString(value)) {
			value = langx.parse(value); // PARSE
		}
		return value;
	}

	function set(key,value) {
		localStorage.setItem($localstorage + key, JSON.stringify(value)); // M.$localstorage
		return this;
	}

	function remove(key) {
		localStorage.removeItem($localstorage + key);
	}

	function clear() {
		var keys = [];
	  	for (var i = 0; i < localStorage.length; i++) {
    		var key = localStorage.key(i);
    		if (key.indexOf($localstorage) == 0)  {
    			keys.push(key);
    		}
  		}
  		for (var i=0;i<keys.length;i++) {
  			localStorage.removeItem(keys[i]);
  		}
	}
	return  {
		"clear" : clear,
		"get" : get,
		"remove": remove,
		"set" : set
	};
});