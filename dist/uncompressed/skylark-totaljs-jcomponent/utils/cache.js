define([
	"../langx",
	"./localStorage"
],function(langx, localStorage){
	//var M = jc,
	//	MD = defaults;

	var page = {},
		session = {} ,
		storage = {};

	function save() {
		//if(!M.isPRIVATEMODE && MD.localstorage){ // !W.isPRIVATEMODE && MD.localstorage
		localStorage.setItem('cache', storage); // M.$localstorage
		//}
	}


	function cache(key, value, expire) {  //W.CACHE = 

		if (value !== undefined) {
			return cache.set(key,value,expire)
		} else {
			return cache.get(key);
		}

	}

	function save() {
		//if(!M.isPRIVATEMODE && MD.localstorage){ // !W.isPRIVATEMODE && MD.localstorage
		//	localStorage.setItem($localstorage + '.cache', JSON.stringify(storage)); // M.$localstorage
		//}
		localStorage.set('cache', storage);
	}

	cache.get = function (key,expire) {
		var checkSession = !expire || expire == "session",
			checkStorage = !expire  || expire != "session",
			value;

		if (checkSession) {
			value = session[key];
		}

		if (value === undefined && checkStorage) {
			var item = storage[key];
			if (item && item.expire > now) {
				value = item.value;
			}
		}

		return value;
	};

	cache.set = function (key, value, expire) { 
		if (!expire || expire === 'session') {
			session[key] = value;
			return this;
		}

		if (langx.isString(expire)) {
			expire = expire.parseExpire();
		}

		var now = Date.now();

		storage[key] = { 
			expire: now + expire, 
			value: value 
		};

		save();
		return this;

	};

	cache.remove = function (key, isSearching) { // W.REMOVECACHE = 
		if (isSearching) {
			for (var m in storage) {
				if (m.indexOf(key) !== -1)
					delete storage[key];
			}
		} else {
			delete storage[key];
		}
		save();
		return this;
	};


	cache.clear = function () { // W.CLEARCACHE = 
		if (!M.isPRIVATEMODE) { // !W.isPRIVATEMODE
			var rem = localStorage.removeItem;
			var k = $localstorage; //M.$localstorage;
			rem(k); 
			rem(k + '.cache');
			rem(k + '.blocked');
		}
		return this;
	};

	cache.getPageData = function(key) {
		return page[key];
	};

	cache.setPageData = function(key,value) {
		page[key] = value;
		return this;
	};

	cache.clearPageData = function() {

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
	};

	cache.getSessionData = function(key) {
		return session[key];
	};

	cache.setSessionData = function(key,value) {
		session[key] = value;
		return this;
	};

	cache.clearSessionData = function() {

		if (!arguments.length) {
			session = {};
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
				delete session[key];
			}
		}
	};


	cache.getStorageData = function(key) {
		return session[key];
	};

	cache.setStorageData = function(key,value) {
		session[key] = value;
		return this;
	};

	cache.clearStorageData = function() {

		if (!arguments.length) {
			session = {};
		} else {
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
					delete session[key];
				}
			}
		}
		save();

	};

	cache.load = function () {
		clearTimeout($ready);
		if (MD.localstorage) {
			var cache;
			try {
				cache = localStorage.getItem(M.$localstorage + '.cache');
				if (cache && langx.isString(cache)) {
					storage = langx.parse(cache); // PARSE
				}
			} catch (e) {}

		}

		if (storage) {
			var obj = storage['$jcpath'];
			obj && Object.keys(obj.value).forEach(function(key) {
				immSetx(key, obj.value[key], true);
			});
		}

		M.loaded = true;
	}

	return cache;
});