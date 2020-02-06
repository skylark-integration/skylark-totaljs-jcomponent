define([
],function(){
	function cache(view) {	
		var page = {};

		function getPageData(key) {
			return page[key];
		}

		function setPageData(key,value) {
			page[key] = value;
			return this;
		}

		function clearPageData() {

			if (!arguments.length) {
				page = {};
				return;
			}

			var keys = langx.keys(page);

			for (var i = 0, length = keys.length; i < length; i++) {
				var key = keys[i];
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
					delete page[key];
				}
			}
		}

		return {
			"get" : getPageData,
			"set" : setPageData,
			"clear" : clearPageData
		}

	}

	return cache;
});