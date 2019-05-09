define([
],function(){
	var registry = { //M.transforms

	};

	function register(name, callback) { // W.NEWTRANSFORM
		registry[name] = callback;  
		return this;
	};

	function transform(name, value, callback) { //W.TRANSFORM

		var m = registry;

		if (arguments.length === 2) {
			// name + value (is callback)
			return function(val) {
				transform(name, val, value);
			};
		}

		var cb = function() {
			if (typeof(callback) === 'string') {
				SET(callback, value);
			} else {
				callback(value);
			}
		};

		var keys = name.split(',');
		var async = [];
		var context = {};

		context.value = value;

		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i].trim();
			key && m[key] && async.push(m[key]);
		}

		if (async.length === 1)
			async[0].call(context, value, function(val) {
				if (val !== undefined)
					value = val;
				cb();
			});
		else if (async.length) {
			async.wait(function(fn, next) {
				fn.call(context, value, function(val) {
					if (val !== undefined)
						value = val;
					next();
				});
			}, cb);
		} else {
			cb();
		}

		return this;
	};

	return  {
		register,
		transform
	}
});