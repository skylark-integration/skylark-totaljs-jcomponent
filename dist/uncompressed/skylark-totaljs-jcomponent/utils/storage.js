define([
	"../langx",
	"./localStorage"
],function(langx, localStorage){
	//var M = jc,
	//	MD = defaults;

	var	sessionData = {} ,
		localData= {};

	function save() {
		//if(!M.isPRIVATEMODE && MD.localstorage){ // !W.isPRIVATEMODE && MD.localstorage
		localStorage.setItem('cache', localData); // M.$localstorage
		//}
	}


	function storage(key, value, expire) { //cachestorage //W.CACHE =  

		if (value !== undefined) {
			return storage.set(key,value,expire)
		} else {
			return storage.get(key);
		}

	}

	function save() {
		//if(!M.isPRIVATEMODE && MD.localstorage){ // !W.isPRIVATEMODE && MD.localstorage
		//	localStorage.setItem($localstorage + '.cache', JSON.stringify(storage)); // M.$localstorage
		//}
		localStorage.set('cache', localData);
	}

	storage.get = function (key,expire) {
		var checkSession = !expire || expire == "session",
			checkStorage = !expire  || expire != "session",
			value;

		if (checkSession) {
			value = session[key];
		}

		if (value === undefined && checkStorage) {
			var item = localData[key];
			if (item && item.expire > langx.now()) {
				value = item.value;
			}
		}

		return value;
	};

	storage.set = function (key, value, expire) { 
		if (!expire || expire === 'session') {
			session[key] = value;
			return this;
		}

		if (langx.isString(expire)) {
			expire = expire.parseExpire();
		}

		var now = Date.now();

		localData[key] = { 
			expire: now + expire, 
			value: value 
		};

		save();
		return this;

	};

	storage.remove = function (key, isSearching) { // W.REMOVECACHE = 
		if (isSearching) {
			for (var m in localData) {
				if (m.indexOf(key) !== -1)
					delete localData[key];
			}
		} else {
			delete localData[key];
		}
		save();
		return this;
	};


	storage.clean = function () { 
		for (var key in localData) {
			var item = localData[key];
			if (!item.expire || item.expire <= now) {
				delete localData[key];
			}
		}

		save();		

		return this;
	};


	storage.clear = function () { // W.CLEARCACHE = 
		//if (!M.isPRIVATEMODE) { // !W.isPRIVATEMODE
			var rem = localStorage.removeItem;
			var k = $localstorage; //M.$localstorage;
			rem(k); 
			rem(k + '.cache');
			rem(k + '.blocked');
		//}
		return this;
	};


	storage.getSessionData = function(key) {
		return session[key];
	};

	storage.setSessionData = function(key,value) {
		session[key] = value;
		return this;
	};

	storage.clearSessionData = function() {

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


	storage.getStorageData = function(key) {
		return session[key];
	};

	storage.setStorageData = function(key,value) {
		session[key] = value;
		return this;
	};

	storage.clearStorageData = function() {

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

	storage.load = function () {
		clearTimeout($ready);
		if (MD.localstorage) {
			var cache;
			try {
				cache = localStorage.getItem(M.$localstorage + '.cache');
				if (cache && langx.isString(cache)) {
					localData = langx.parse(cache); // PARSE
				}
			} catch (e) {}

		}

		if (localData) {
			var obj = localData['$jcpath'];
			obj && Object.keys(obj.value).forEach(function(key) {
				immSetx(key, obj.value[key], true);
			});
		}

		M.loaded = true;
	}


	function clean() {

	}

	return storage;
});