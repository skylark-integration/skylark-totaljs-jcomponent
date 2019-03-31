define([
	"./jc",
	"./defaults",
	"./langx",
	"./utils/caches"
],function(jc,defaults,langx,caches){
	var M = jc,
		MD = defaults;

	var storage = {};

	var $localstorage = 'jc.'; //M.$localstorage


	function cachestorage(key, value, expire) {

		var now = Date.now();

		if (value !== undefined) {

			if (expire === 'session') {
				caches.set('$session' + key, value);
				return value;
			}

			if (langx.isString(expire)) {
				expire = expire.parseExpire();
			}

			storage[key] = { expire: now + expire, value: value };
			save();
			return value;
		}

		var item = caches.get('$session' + key);
		if (item) {
			return item;
		}

		item = storage[key];
		if (item && item.expire > now) {
			return item.value;
		}
	}

	function get(key) {
		return cachestorage(key);
	}

	function put(key, value, expire) { //W.CACHE = 
		return cachestorage(key, value, expire);
	}


	function remove(key, isSearching) { // W.REMOVECACHE = 
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

	function save() {
		if(!M.isPRIVATEMODE && MD.localstorage){ // !W.isPRIVATEMODE && MD.localstorage
			localStorage.setItem($localstorage + '.cache', JSON.stringify(storage)); // M.$localstorage
		}
	}

	function clearCache() { // W.CLEARCACHE = 
		if (!M.isPRIVATEMODE) { // !W.isPRIVATEMODE
			var rem = localStorage.removeItem;
			var k = $localstorage; //M.$localstorage;
			rem(k); 
			rem(k + '.cache');
			rem(k + '.blocked');
		}
		return this;
	};

	function load() {
		clearTimeout($ready);
		if (MD.localstorage) {
			var cache;
			try {
				cache = localStorage.getItem(M.$localstorage + '.cache');
				if (cache && langx.isString(cache)) {
					storage = langx.parse(cache); // PARSE
				}
			} catch (e) {}
			try {
				cache = localStorage.getItem(M.$localstorage + '.blocked');
				if (cache && langx.isString(cache)) {
					blocked = langx.parse(cache);  // PARSE
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