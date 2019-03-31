define([
	"./registry",
	"../binding/pathmaker"
],function(compRegistry,pathmaker){

   /**
   * Resets dirty and valid state in all components on the path.
   * @param  {String} path 
   * @param  {Number} delay  Optional, in milliseconds (default: 0)
   */
	function reset(path, timeout, onlyComponent) { //W.RESET = M.reset

		if (timeout > 0) {
			setTimeout(function() {
				reset(path);
			}, timeout);
			return this;
		}

		path = pathmaker(path).replaceWildcard();

		var arr = [];
		var all = compRegistry.allInstances();//M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path)) {
				continue;
			}

			com.state && arr.push(com);

			if (onlyComponent && onlyComponent._id !== com._id) {
				continue;
			}

			findcontrol2(com);

			if (!com.$dirty_disabled) {
				com.$dirty = true;
				com.$interaction(101);
			}

			if (!com.$valid_disabled) {
				com.$valid = true;
				com.$validate = false;
				if (com.validate) {
					com.$valid = com.validate(com.get());
					com.$interaction(102);
				}
			}
		}

		clear('valid', 'dirty');
		state(arr, 1, 3);
		return this;
	}

	function each(fn, path) {   // M.each
		var wildcard = path ? path.lastIndexOf('*') !== -1 : false;
		if (wildcard)
			path = path.replace('.*', '');
		var all = components;//M.components;
		var index = 0;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || !com.$loaded || com.$removed || (path && (!com.path || !com.$compare(path))))
				continue;
			var stop = fn(com, index++, wildcard);
			if (stop === true)
				return this;
		}
		return this;
	}

	function used(path) {   //M.used
		each(function(obj) {
			!obj.disabled && obj.used();
		}, path);
		return this;
	};

   /**
   * Returns all modified components by user on the path.
   * @param  {String} path 
   * @returns {Array<String>}   
   */
	function modified(path) { //W.MODIFIED = 
		var output = [];
		M.each(function(obj) {
			if (!(obj.disabled || obj.$dirty_disabled)) {
				obj.$dirty === false && output.push(obj.path);
			}
		}, pathmaker(path));
		return output;
	}

	function errors(path, except, highlight) { //W.ERRORS = 

		if (path instanceof Array) {
			except = path;
			path = undefined;
		}

		if (except === true) {
			except = highlight instanceof Array ? highlight : null;
			highlight = true;
		}

		var arr = [];

		each(function(obj) { // M.each
			if (!obj.disabled && (!except || !obj.$except(except)) && obj.$valid === false && !obj.$valid_disabled)
				arr.push(obj);
		}, pathmaker(path));

		highlight && langx.state(arr, 1, 1);
		return arr;
	}

  /**
   * Reads a value according to the path.
   * @param  {String} path 
   */
	function getx(path, scope) { // W.GET = M.get
		path = pathmaker(path);
		if (scope === true) {
			scope = null;
			reset(path, true); // RESET
		}
		return get(path, scope); 
	}

  /**
   * Reads value and resets all components according to the path.
   * @param  {String} path 
   */
	function getr(path) {  //W.GETR =
		return getx(path, true); //GET
	}


	// 1 === manually
	// 2 === by input
	// 3 === default
	function immSetx(path, value, type) {  // M.set

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++) 
				immSetx(path[i], value, type);
			return M;
		}

		path = pathmaker(path);

		if (!path) {
			return M;
		}

		var is = path.charCodeAt(0) === 33; // !
		if (is) {
			path = path.substring(1);
		}

		if (path.charCodeAt(0) === 43) { // +
			path = path.substring(1);
			return M.push(path, value, type);
		}

		if (!path) {
			return M;
		}

		var isUpdate = (typeof(value) === 'object' && !(value instanceof Array) && value != null);
		var reset = type === true;
		if (reset) {
			type = 1;
		}

		M.skipproxy = path;
		set(path, value);

		if (isUpdate) {
			return immUpdate(path, reset, type, true);
		}

		var result = get(path);
		var state = [];

		if (type === undefined) {
			type = 1;
		}

		var all = M.components.all;//M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.disabled || com.$removed || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (com.setter) {
				if (com.path === path) {
					if (com.setter) {
						com.setterX(result, path, type);
						com.$interaction(type);
					}
				} else {
					if (com.setter) {
						com.setterX(get(com.path), path, type);
						com.$interaction(type);
					}
				}
			}

			if (!com.$ready) {
				com.$ready = true;
			}

			type !== 3 && com.state && state.push(com);

			if (reset) {
				if (!com.$dirty_disabled)
					com.$dirty = true;
				if (!com.$valid_disabled) {
					com.$valid = true;
					com.$validate = false;
					if (com.validate) {
						com.$valid = com.validate(result);
						com.$interaction(102);
					}
				}

				findcontrol2(com);

			} else if (com.validate && !com.$valid_disabled) {
				com.valid(com.validate(result), true);
			}
		}

		if (reset) {
			caches.clear('dirty', 'valid');
		}

		for (var i = 0, length = state.length; i < length; i++) {
			state[i].stateX(type, 5);
		}

		emitwatch(path, result, type);
		return M;
	}

   /**
   * Sets a new value according to the path..
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} timeout  Optional, value > 10 will be used as delay
   * @param {Boolean} reset Optional  default: false
   */
	function setx(path, value, timeout, reset) {   // W.SET
		var t = typeof(timeout);
		if (t === 'boolean')
			return immSetx(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return immSetx(path, value, timeout);
		setTimeout(function() {
			immSetx(path, value, reset);
		}, timeout);
		return this; // W
	};

   /**
   * Sets a new value according to the path and performs CHANGE() for all components 
   * which are listening on the path.
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} type  Optional, value > 10 will be used as delay
   */
	function setx2(path, value, type) { //W.SET2 = 
		setx(path, value, type); // SET
		change(path);
		return this;
	};

   /**
   * Sets a new value according to the path and resets the state. 
   * @param  {String} path 
   * @param  {Object} value.
   * @param  {String/Number} type  Optional, value > 10 will be used as delay
   */
	function setr(path, value, type) { //  W.SETR
		immSetx(path, value, type);
		reset(path); // RESET
		return this;
	};

   /**
   * Performs SET() and CHANGE() together.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	function modify(path, value, timeout) { // W.MODIFY =
		if (path && typeof(path) === TYPE_O) {
			Object.keys(path).forEach(function(k) {
				modify(k, path[k], value);
			});
		} else {
			if (langx.isFunction(value)) {
				value = value(get2(path));
			}
			setx(path, value, timeout); // SET
			if (timeout) {
				langx.setTimeout(change, timeout + 5, path);
			} else {
				change(path);
			}
		}
		return this;
	};


   /**
   * Performs toggle for the path. A value must be Boolean.
   * @param  {String} path 
   * @param  {String/Number} timeout  Optional, value > 10 will be used as delay
   * @param {Boolean} reset Optional  default: false
   */
	function toggle(path, timeout, reset) { // W.TOGGLE = 
		var v = getx(path);  // GET
		setx(path, !v, timeout, reset); // SET
		return this;
	};

   /**
   * Performs toggle for the path and performs CHANGE() for all components which are listening on the path.
   * A value must be Boolean.
   * @param  {String} path 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	function toogle2(path, type) { //W.TOGGLE2 = 
		toogle(path, type);
		change(path);
		return this;
	};

   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	function inc(path, value, timeout, reset) { // W.INC = 

		if (value == null)
			value = 1;

		var t = typeof(timeout);
		if (t === 'boolean')
			return immInc(path, value, timeout);
		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return immInc(path, value, timeout);
		setTimeout(function() {
			immInc(path, value, reset);
		}, timeout);
		return W;
	}

   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	function extend(path, value, timeout, reset) { // W.EXTEND = 
		var t = typeof(timeout);
		if (t === 'boolean')
			return immExtend(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return immExtend(path, value, timeout);
		setTimeout(function() {
			immExtend(path, value, reset);
		}, timeout);
		return this; // W
	}

   /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	function extend2(path, value, type) { // W.EXTEND2 = 
		extend(path, value, type); // W.EXTEND
		change(path);
		return this;
	}

  /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	 function inc2(path, value, type) {  // W.INC2 = 
		inc(path, value, type);
		change(path);
		return this;
	}	

   /**
   * Pushs a new item into the Array according to the path.
   * @param  {String} path 
   * @param  {Object|Array} value.
   * @param  {String/Number} timeout  Optional, "value > 10" will be used as delay
   * @param {Boolean} reset Optional
   */
	function push(path, value, timeout, reset) {  // W.PUSH = 
		var t = typeof(timeout);
		if (t === 'boolean')
			return M.push(path, value, timeout);
		if (!timeout || timeout < 10 || t !== 'number') // TYPE
			return M.push(path, value, timeout);
		setTimeout(function() {
			M.push(path, value, reset);
		}, timeout);
		return this; // W
	};


	function update(path, timeout, reset) { // W.UPDATE
		var t = typeof(timeout); 
		if (t === 'boolean')
			return immUpdate(path, timeout);
		if (!timeout || timeout < 10 || t !== TYPE_N) // TYPE
			return immUpdate(path, reset, timeout);
		setTimeout(function() {
			immUpdate(path, reset);
		}, timeout);
	};

	function update2(path, type) { //W.UPDATE2 = 
		update(path, type); // W.UPDATE
		W.CHANGE(path); 
		return this; // W
	};	

   /**
   * Extends a path by adding/rewrite new fields with new values and performs CHANGE().
   * @param  {String} path 
   * @param  {Object} value 
   * @param {String|Number} type  Optional, "value > 10" will be used as timeout
   */
	function push2(path, value, type) { // W.PUSH2 = 
		push(path, value, type);
		change(path);
		return this; // W
	};


	return {
		cleaner2,
		default2,
		each,
		find,
		refresh,
		reset,
		setter,
		usage,
		version,

		extend,
		extend2,
		inc,
		inc2,
		push,
		push2,
		update,
		update2

	};
});