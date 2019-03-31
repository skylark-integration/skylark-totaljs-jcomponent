define([
	"skylark-langx/langx",
	"./regexp"
],function(slangx,regexp){

	var AP = Array.prototype;
	AP.wait = AP.waitFor = function(onItem, callback, thread, tmp) {

		var self = this;
		var init = false;

		// INIT
		if (!tmp) {

			if (!slangx.isFunction(callback)) {
				thread = callback;
				callback = null;
			}

			tmp = {};
			tmp.pending = 0;
			tmp.index = 0;
			tmp.thread = thread;

			// thread === Boolean then array has to be removed item by item
			init = true;
		}

		var item = thread === true ? self.shift() : self[tmp.index++];

		if (item === undefined) {
			if (!tmp.pending) {
				callback && callback();
				tmp.cancel = true;
			}
			return self;
		}

		tmp.pending++;
		onItem.call(self, item, function() {
			setTimeout(next_wait, 1, self, onItem, callback, thread, tmp);
		}, tmp.index);

		if (!init || tmp.thread === 1){
			return self;
		}

		for (var i = 1; i < tmp.thread; i++) {
			self.wait(onItem, callback, 1, tmp);
		}

		return self;
	};

	function next_wait(self, onItem, callback, thread, tmp) {
		tmp.pending--;
		self.wait(onItem, callback, thread, tmp);
	}

	AP.limit = function(max, fn, callback, index) {

		if (index === undefined)
			index = 0;

		var current = [];
		var self = this;
		var length = index + max;

		for (var i = index; i < length; i++) {
			var item = self[i];

			if (item !== undefined) {
				current.push(item);
				continue;
			}

			if (!current.length) {
				callback && callback();
				return self;
			}

			fn(current, function() { callback && callback(); }, index, index + max);
			return self;
		}

		if (!current.length) {
			callback && callback();
			return self;
		}

		fn(current, function() {
			if (length < self.length)
				self.limit(max, fn, callback, length);
			else
				callback && callback();
		}, index, index + max);

		return self;
	};

	AP.async = function(context, callback) {

		if (slangx.isFunction(context)) {
			var tmp = callback;
			callback = context;
			context = tmp;
		}

		if (!context) {
			context = {};
		}

		var arr = this;
		var index = 0;

		var c = function() {
			var fn = arr[index++];
			if (fn) {
				fn.call(context, c, index - 1);
			} else {
				return callback && callback.call(context);
			}
		};

		c();
		return this;
	};

	AP.take = function(count) {
		var arr = [];
		var self = this;
		var length = self.length;
		for (var i = 0; i < length; i++) {
			arr.push(self[i]);
			if (arr.length >= count) {
				return arr;
			}
		}
		return arr;
	};

	AP.skip = function(count) {
		var arr = [];
		var self = this;
		var length = self.length;
		for (var i = 0; i < length; i++) {
			i >= count && arr.push(self[i]);
		}
		return arr;
	};

	AP.takeskip = function(take, skip) {
		var arr = [];
		var self = this;
		var length = self.length;
		for (var i = 0; i < length; i++) {
			if (i < skip)
				continue;
			if (arr.length >= take)
				return arr;
			arr.push(self[i]);
		}
		return arr;
	};

	AP.trim = function(empty) {
		var self = this;
		var output = [];
		for (var i = 0, length = self.length; i < length; i++) {
			if (slangx.isString(self[i]))
				self[i] = self[i].trim();
			if (empty || self[i])
				output.push(self[i]);
		}
		return output;
	};

	AP.findIndex = function(cb, value) {

		var self = this;
		var isFN = slangx.isFunction(cb);
		var isV = value !== undefined;

		for (var i = 0, length = self.length; i < length; i++) {
			if (isFN) {
				if (cb.call(self, self[i], i)) {
					return i;
				}
			} else if (isV) {
				if (self[i][cb] === value) {
					return i;
				}
			} else if (self[i] === cb) {
				return i;
			}
		}
		return -1;
	};

	AP.findAll = function(cb, value) {

		var self = this;
		var isFN = slangx.isFunction(cb);
		var isV = value !== undefined;
		var arr = [];

		for (var i = 0, length = self.length; i < length; i++) {
			if (isFN) {
				cb.call(self, self[i], i) && arr.push(self[i]);
			} else if (isV) {
				self[i][cb] === value && arr.push(self[i]);
			} else {
				self[i] === cb && arr.push(self[i]);
			}
		}
		return arr;
	};

	AP.findItem = function(cb, value) {
		var index = this.findIndex(cb, value);
		if (index !== -1)
			return this[index];
	};


	AP.remove = function(cb, value) {

		var self = this;
		var arr = [];
		var isFN = slangx.isFunction(cb);
		var isV = value !== undefined;

		for (var i = 0, length = self.length; i < length; i++) {
			if (isFN) {
				!cb.call(self, self[i], i) && arr.push(self[i]);
			} else if (isV) {
				self[i][cb] !== value && arr.push(self[i]);
			} else {
				self[i] !== cb && arr.push(self[i]);
			}
		}
		return arr;
	};

	AP.last = function(def) {
		var item = this[this.length - 1];
		return item === undefined ? def : item;
	};

	AP.quicksort = function(name, asc, type) {

		var self = this;
		var length = self.length;
		if (!length || length === 1) {
			return self;
		}

		if (typeof(name) === 'boolean') {
			asc = name;
			name = undefined;
		}

		if (asc == null || asc === 'asc')
			asc = true;
		else if (asc === 'desc')
			asc = false;

		switch (type) {
			case 'date':
				type = 4;
				break;
			case 'string':
				type = 1;
				break;
			case 'number':
				type = 2;
				break;
			case 'bool':
			case 'boolean':
				type = 3;
				break;
			default:
				type = 0;
				break;
		}

		if (!type) {
			var index = 0;
			while (!type) {
				var field = self[index++];
				if (field === undefined)
					return self;
				if (name)
					field = field[name];
				switch (typeof(field)) {
					case 'string':
						type = field.isJSONDate() ? 4 : 1;
						break;
					case 'number':
						type = 2;
						break;
					case 'boolean':
						type = 3;
						break;
					default:
						if (field instanceof Date)
							type = 4;
						break;
				}
			}
		}

		self.sort(function(a, b) {

			var va = name ? a[name] : a;
			var vb = name ? b[name] : b;

			if (va == null)
				return asc ? -1 : 1;

			if (vb == null)
				return asc ? 1 : -1;

			// String
			if (type === 1) {
				return va && vb ? (asc ? LCOMPARER(va, vb) : LCOMPARER(vb, va)) : 0;
			} else if (type === 2) {
				return va > vb ? (asc ? 1 : -1) : va < vb ? (asc ? -1 : 1) : 0;
			} else if (type === 3) {
				return va === true && vb === false ? (asc ? 1 : -1) : va === false && vb === true ? (asc ? -1 : 1) : 0;
			} else if (type === 4) {
				if (!va || !vb)
					return 0;
				if (!va.getTime) {
					va = new Date(va);
				}
				if (!vb.getTime) {
					vb = new Date(vb);
				}
				var at = va.getTime();
				var bt = vb.getTime();
				return at > bt ? (asc ? 1 : -1) : at < bt ? (asc ? -1 : 1) : 0;
			}
			return 0;
		});

		return self;
	};

	AP.attr = function(name, value) {

		var self = this;

		if (arguments.length === 2) {
			if (value == null)
				return self;
		} else if (value === undefined)
			value = name.toString();

		self.push(name + '="' + value.toString().env().toString().replace(/[<>&"]/g, function(c) {
			switch (c) {
				case '&': return '&amp;';
				case '<': return '&lt;';
				case '>': return '&gt;';
				case '"': return '&quot;';
			}
			return c;
		}) + '"');

		return self;
	};

	AP.scalar = function(type, key, def) {

		var output = def;
		var isDate = false;
		var isAvg = type === 'avg' || type === 'average';
		var isDistinct = type === 'distinct';
		var self = this;

		for (var i = 0, length = self.length; i < length; i++) {
			var val = key ? self[i][key] : self[i];

			if (slangx.isString(val))
				val = val.parseFloat();

			if (val instanceof Date) {
				isDate = true;
				val = val.getTime();
			}

			if (isDistinct) {
				if (!output)
					output = [];
				output.indexOf(val) === -1 && output.push(val);
				continue;
			}

			if (type === 'median') {
				if (!output)
					output = [];
				output.push(val);
				continue;
			}

			if (type === 'sum' || isAvg) {
				if (output)
					output += val;
				else
					output = val;
				continue;
			}

			if (type !== 'range') {
				if (!output)
					output = val;
			} else {
				if (!output) {
					output = new Array(2);
					output[0] = val;
					output[1] = val;
				}
			}

			switch (type) {
				case 'range':
					output[0] = Math.min(output[0], val);
					output[1] = Math.max(output[1], val);
					break;
				case 'min':
					output = Math.min(output, val);
					break;
				case 'max':
					output = Math.max(output, val);
					break;
			}
		}

		if (isDistinct)
			return output;

		if (isAvg) {
			output = output / self.length;
			return isDate ? new Date(output) : output;
		}

		if (type === 'median') {
			if (!output)
				output = [0];
			output.sort(function(a, b) {
				return a - b;
			});
			var half = Math.floor(output.length / 2);
			output = output.length % 2 ? output[half] : (output[half - 1] + output[half]) / 2.0;
		}

		if (isDate) {
			if (slangx.isNumber(output))
				return new Date(output);
			output[0] = new Date(output[0]);
			output[1] = new Date(output[1]);
		}

		return output;
	};

	
});