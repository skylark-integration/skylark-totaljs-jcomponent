define([
	"skylark-langx/langx",
	"./jc",
	"./_langx/regexp",
	"./_langx/now",
	"./_langx/ArrayEx",
	"./_langx/DateEx",
	"./_langx/NumberEx",
	"./_langx/StringEx"
],function(slangx,jc,regexp,now){
	var statics = {};
	var waits = {};



	function async(arr, fn, done) {
		var item = arr.shift();
		if (item == null)
			return done && done();
		fn(item, function() {
			async(arr, fn, done);
		});
	}


	function clone(obj, path) {

		var type = typeof(obj);
		switch (type) {
			case TYPE_N:
			case 'boolean':
				return obj;
			case TYPE_S:
				return path ? obj : CLONE(get(obj), true);
		}

		if (obj == null)
			return obj;

		if (obj instanceof Date)
			return new Date(obj.getTime());

		return PARSE(JSON.stringify(obj));
	}

	function copy(a, b) {
		var keys = Object.keys(a);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			var val = a[key];
			var type = typeof(val);
			b[key] = type === TYPE_O ? val ? CLONE(val) : val : val;
		}
		return b;
	}


	/*
	 * Generates a unique String.
	 *
	 */
	function guid(size) {
		if (!size)
			size = 10;
		var l = ((size / 10) >> 0) + 1;
		var b = [];
		for (var i = 0; i < l; i++)
			b.push(Math.random().toString(36).substring(2));
		return b.join('').substring(0, size);
	}

	/*
	 *  Generates Number hash sum.
	 *
	 */
	function hashCode(s) {
		if (!s)
			return 0;
		var type = typeof(s);
		if (type === TYPE_N)
			return s;
		else if (type === 'boolean')
			return s ? 1 : 0;
		else if (s instanceof Date)
			return s.getTime();
		else if (type === TYPE_O)
			s = STRINGIFY(s);
		var hash = 0, i, char;
		if (!s.length)
			return hash;
		var l = s.length;
		for (i = 0; i < l; i++) {
			char = s.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	/*
	 *  Parses JSON String to Object.
	 *
	 */
	function parse(value, date) {

		// Is selector?
		var c = value.substring(0, 1);
		if (c === '#' || c === '.')
			return parse($(value).html(), date); // PARSE

		if (date === undefined) {
			date = MD.jsondate;
		} 
		try {
			return JSON.parse(value, function(key, value) {
				return typeof(value) === TYPE_S && date && value.isJSONDate() ? new Date(value) : value;
			});
		} catch (e) {
			return null;
		}
	}

	var LCOMPARER = window.Intl ? window.Intl.Collator().compare : function(a, b) {
		return a.localeCompare(b);
	};

   /**
   * Wait for a feature
   * @param  {String|Function} path/fn  
   * @param  {Function} callback  
   * @param  {Number} interval  Optional, in milliseconds (default: 500)
   * @param  {Number} timeout Optional, a timeout (default: 0 - disabled) 
   * @return {Boolean}  
   */ 
	function wait(fn, callback, interval, timeout) { // W.WAIT = 
		var key = ((Math.random() * 10000) >> 0).toString(16);
		var tkey = timeout > 0 ? key + '_timeout' : 0;

		if (typeof(callback) === TYPE_N) {
			var tmp = interval;
			interval = callback;
			callback = tmp;
		}

		var is = typeof(fn) === TYPE_S;
		var run = false;

		if (is) {
			var result = get(fn);
			if (result)
				run = true;
		} else if (fn())
			run = true;

		if (run) {
			callback(null, function(sleep) {
				setTimeout(function() {
					WAIT(fn, callback, interval, timeout);
				}, sleep || 1);
			});
			return;
		}

		if (tkey) {
			waits[tkey] = setTimeout(function() {
				clearInterval(waits[key]);
				delete waits[tkey];
				delete waits[key];
				callback(new Error('Timeout.'));
			}, timeout);
		}

		waits[key] = setInterval(function() {

			if (is) {
				var result = get(fn);
				if (result == null)
					return;
			} else if (!fn())
				return;

			clearInterval(waits[key]);
			delete waits[key];

			if (tkey) {
				clearTimeout(waits[tkey]);
				delete waits[tkey];
			}

			callback && callback(null, function(sleep) {
				setTimeout(function() {
					WAIT(fn, callback, interval);
				}, sleep || 1);
			});

		}, interval || 500);
	};



	/*
	 * Serializes Object to JSON.
	 * @param
	 * @param 
	 * @param {Array|Object} fields
	 */
	function stringify(obj, compress, fields) {
		if(compress === undefined) {
			compress = MD.jsoncompress;
		} 
		var tf = typeof(fields);
		return JSON.stringify(obj, function(key, value) {

			if (!key) {
				return value;
			}

			if (fields) {
				if (fields instanceof Array) {
					if (fields.indexOf(key) === -1) {
						return undefined;
					}
				} else if (tf === TYPE_FN) {
					if (!fields(key, value)){
						return undefined;
					}
				} else if (fields[key] === false)
					return undefined;
			}

			if (compress === true) {
				var t = typeof(value);
				if (t === TYPE_S) {
					value = value.trim();
					return value ? value : undefined;
				} else if (value === false || value == null)
					return undefined;
			}

			return value;
		});
	}

	var empties = {
		array : [],
		object : {},
		fn :  function() {}
	};

	var singletons = {};

	function singleton(name, def) { //W.SINGLETON 
		return singletons[name] || (singletons[name] = (new Function('return ' + (def || '{}')))());
	};


	if (Object.freeze) {
		Object.freeze(empties.array);
		Object.freeze(empties.object);
	}


   /**
   * improves setTimeout method. This method cancels a previous unexecuted call.
   * @param  {String} name 
   * @param  {Function(name)} fn 
   * @param  {Number} timeout 
   * @param  {Number} limit  Optional, a maximum clear limit (default: 0)
   * @param  {Object} param  Optional, additional argument
   * @return {Number} 
   */
	function setTimeout2(name, fn, timeout, limit, param) { //W.setTimeout2 = 
		var key = ':' + name;
		if (limit > 0) {
			var key2 = key + ':limit';
			if (statics[key2] >= limit) {
				return;
			}
			statics[key2] = (statics[key2] || 0) + 1;
			statics[key] && clearTimeout(statics[key]);
			return statics[key] = setTimeout(function(param) {
				statics[key2] = undefined;
				fn && fn(param);
			}, timeout, param);
		}
		statics[key] && clearTimeout(statics[key]);
		return statics[key] = setTimeout(fn, timeout, param);
	}

   /**
   * clears a registered by setTimeout2().
   * @param  {String} name 
   * @return {Boolean} 
   */
	function clearTimeout2(name) { // W.clearTimeout2 = 
		var key = ':' + name;
		if (statics[key]) {
			clearTimeout(statics[key]);
			statics[key] = undefined;
			statics[key + ':limit'] && (statics[key + ':limit'] = undefined);
			return true;
		}
		return false;
	}


	// what:
	// 1. valid
	// 2. dirty
	// 3. reset
	// 4. update
	// 5. set
	function state(arr, type, what) {
		if (arr && arr.length) {
			setTimeout(function() {
				for (var i = 0, length = arr.length; i < length; i++) {
					arr[i].stateX(type, what);
				}
			}, 2, arr);
		}
	}

	return jc.langx = {

		mixin : slangx.mixin,
		isFunction : slangx.isFunction,
		isNumber : slangx.isNumber,

		async:async,
		clearTimeout2:clearTimeout2,
		clone:clone,
		copy:copy,
		empties:empties,
		Evented : slangx.Evented,
		guid:guid,
		hashCode:hashCode,
		now:now,
		parse:parse,
		regexp:regexp,
		setTimeout2:setTimeout2,
		singleton:singleton,
		state:state,
		stringify:stringify,
		wait:wait
	};

});