define([],function(){
	var fallbackpending = [];

	function downloadfallback() {
		if (C.importing) {
			setTimeout(downloadfallback, 1000);
		} else {
			langx.setTimeout2('$fallback', function() {
				fallbackpending.splice(0).wait(function(item, next) {
					if (Component.registry[item]){ // M.$components
						next();
					}else {
						warn('Downloading: ' + item);
						http.importCache(MD.fallback.format(item), MD.fallbackcache, next);
					}
				}, 3);
			}, 100);
		}
	}

	function nextpending() {

		var next = C.pending.shift();
		if (next) {
			next();
		}
		else if ($domready) {

			if (C.ready)
				C.is = false;

			if (MD.fallback && fallback.$ && !C.importing) {
				var arr = Object.keys(fallback);
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] !== '$') {
						var num = fallback[arr[i]];
						if (num === 1) {
							fallbackpending.push(arr[i].toLowerCase());
							fallback[arr[i]] = 2;
						}
					}
				}
				fallback.$ = 0;
				fallbackpending.length && downloadfallback();
			}
		}
	}

	return nextpending;
	
});