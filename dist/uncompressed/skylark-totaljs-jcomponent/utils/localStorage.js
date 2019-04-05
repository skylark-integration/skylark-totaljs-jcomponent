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

	return  {
		"get" : get,
		"set" : set
	};
});