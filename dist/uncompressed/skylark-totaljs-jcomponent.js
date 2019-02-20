/**
 * skylark-totaljs-jcomponent - A version of totaljs jcomponent that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-totaljs-jcomponent/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-totaljs-jcomponent/totaljs',[
	"skylark-langx/skylark"
],function(skylark){
	return skylark.totaljs = {};
});
define('skylark-totaljs-jcomponent/jc',[
	"skylark-langx/langx",
	"skylark-utils-dom/query",
	"./totaljs"
],function(langx,$,totaljs){
	var M = totaljs.jc = {
		isPRIVATEMODE : false,
		isMOBILE : /Mobi/.test(navigator.userAgent),
		isROBOT : navigator.userAgent ? (/search|agent|bot|crawler|spider/i).test(navigator.userAgent) : true,
		isSTANDALONE : navigator.standalone || window.matchMedia('(display-mode: standalone)').matches,
		isTOUCH : !!('ontouchstart' in window || navigator.maxTouchPoints)
	}; // W.MAIN = W.M = W.jC = W.COM = M = {};

	// Internal cache
	//var blocked = {};
	//var storage = {};
	//var extensions = {}; // COMPONENT_EXTEND()
	//var configs = [];
	//var cache = {};
	//var paths = {}; // saved paths from get() and set()
	//var events = {};
	//var temp = {};
	//var toggles = [];
	//var versions = {};
	//var autofill = [];
	//var defaults = {};
	//var skips = {};

	//var current_owner = null;
	//var current_element = null;
	//var current_com = null;

	//W.EMPTYARRAY = [];
	//W.EMPTYOBJECT = {};
	//W.DATETIME = W.NOW = new Date();

	//- defaults

	//- M
	
	//- C



	//- VBinder

	//- W




	//- Scope


	//- Component

	//- Usage


	//- Windows

	//- Arrayx

	// ===============================================================
	// PROTOTYPES
	// ===============================================================
    
    //- Ex


	var BLACKLIST = { sort: 1, reverse: 1, splice: 1, slice: 1, pop: 1, unshift: 1, shift: 1, push: 1 };


	//- queryex



	//- parseBinder
	//- jBinder


	function isValue(val) {
		var index = val.indexOf('value');
		return index !== -1 ? (((/\W/).test(val)) || val === 'value') : false;
	}

	//- Plugin


	M.months = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
	M.days = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

	//M.skipproxy = '';

	M.loaded = false;
	M.version = 16.044;
	//M.$localstorage = 'jc';
	M.$version = '';
	M.$language = '';

	M.$parser = [];
	//M.transforms = {};
	//M.compiler = C;

	//M.compile = compile;

	M.environment = function(name, version, language, env) {
		M.$localstorage = name;
		M.$version = version || '';
		M.$language = language || '';
		env && ENV(env);
		return M;
	};


	M.prototypes = function(fn) {
		var obj = {};
		obj.Component = PPC;
		obj.Usage = USAGE.prototype;
		obj.Plugin = Plugin.prototype;
		fn.call(obj, obj);
		return M;
	};


	return M;
});
define('skylark-totaljs-jcomponent/_langx/regexp',[],function(){
	var MR = {};
	MR.int = /(-|\+)?[0-9]+/;
	MR.float = /(-|\+)?[0-9.,]+/;
	MR.date = /yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|a|ww|w/g;
	MR.pluralize = /#{1,}/g;
	MR.format = /\{\d+\}/g;

	return MR;
});

define('skylark-totaljs-jcomponent/_langx/now',[],function(){
	var _n = null

	return function(n) {
		if (n !== undefined) {
			if (typeof n === "boolean"){
				//reset
				_n = new Date();
			} else {
				_n = n;
			}
		}
		return _n;
	}

});
define('skylark-totaljs-jcomponent/constants',[
	"./jc"
],function(jc){
	// Constants
	return jc.constants = {
		REGCOM : /(data-jc|data-jc-url|data-jc-import|data-bind|bind):|COMPONENT\(/,
		REGENV : /(\[.*?\])/gi,
		ATTRURL : '[data-jc-url]',
		ATTRDATA : 'jc',
		ATTRDEL : 'data-jc-removed',
		ATTRREL : 'data-jc-released',
		ATTRSCOPE : 'data-jc-scope',
		SELINPUT : 'input,textarea,select',
		ACTRLS : { INPUT: true, TEXTAREA: true, SELECT: true },
		DEFMODEL : { value: null },
		OK : Object.keys,
		TYPE_FN : 'function',
		TYPE_S : 'string',
		TYPE_N : 'number',
		TYPE_O : 'object',
		KEY_ENV : 'environment'
	};
});
define('skylark-totaljs-jcomponent/_langx/ArrayEx',[
	"skylark-langx/langx",
	"../constants",
	"./regexp"
],function(slangx,constants,regexp){
	var TYPE_FN = constants.TYPE_FN,
		TYPE_S = constants.TYPE_S,
		TYPE_N = constants.TYPE_N ;

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
define('skylark-totaljs-jcomponent/_langx/DateEx',[
	"./regexp"
],function(regexp){

	window.$jcdatempam = function(value) {  // TODO: will be changed
		return value >= 12 ? value - 12 : value;
	};


	var DP = Date.prototype;
	DP.toNumber = function(format) {
		return +this.format(format || 'yyyyMMdd');
	};

	DP.parseDate = function() {
		return this;
	};

	DP.add = function(type, value) {

		if (value === undefined) {
			var arr = type.split(' ');
			type = arr[1];
			value = parseInt(arr[0]);
		}

		if (typeof(value) === TYPE_S)
			value = value.env();

		var self = this;
		var dt = new Date(self.getTime());

		switch(type.substring(0, 3)) {
			case 's':
			case 'ss':
			case 'sec':
				dt.setSeconds(dt.getSeconds() + value);
				return dt;
			case 'm':
			case 'mm':
			case 'min':
				dt.setMinutes(dt.getMinutes() + value);
				return dt;
			case 'h':
			case 'hh':
			case 'hou':
				dt.setHours(dt.getHours() + value);
				return dt;
			case 'd':
			case 'dd':
			case 'day':
				dt.setDate(dt.getDate() + value);
				return dt;
			case 'w':
			case 'ww':
			case 'wee':
				dt.setDate(dt.getDate() + (value * 7));
				return dt;
			case 'M':
			case 'MM':
			case 'mon':
				dt.setMonth(dt.getMonth() + value);
				return dt;
			case 'y':
			case 'yy':
			case 'yyy':
			case 'yea':
				dt.setFullYear(dt.getFullYear() + value);
				return dt;
		}
		return dt;
	};

	DP.toUTC = function(ticks) {
		var self = this;
		var dt = self.getTime() + self.getTimezoneOffset() * 60000;
		return ticks ? dt : new Date(dt);
	};

	DP.format = function(format, utc) {

		var self = utc ? this.toUTC() : this;

		if (format == null)
			format = MD.dateformat;

		if (!format)
			return self.getFullYear() + '-' + (self.getMonth() + 1).toString().padLeft(2, '0') + '-' + self.getDate().toString().padLeft(2, '0') + 'T' + self.getHours().toString().padLeft(2, '0') + ':' + self.getMinutes().toString().padLeft(2, '0') + ':' + self.getSeconds().toString().padLeft(2, '0') + '.' + self.getMilliseconds().toString().padLeft(3, '0') + 'Z';

		var key = 'dt_' + format;

		if (statics[key])
			return statics[key](self);

		var half = false;

		format = format.env();

		if (format && format.substring(0, 1) === '!') {
			half = true;
			format = format.substring(1);
		}

		var beg = '\'+';
		var end = '+\'';
		var before = [];

		var ismm = false;
		var isdd = false;
		var isww = false;

		format = format.replace(regexp.date, function(key) {
			switch (key) {
				case 'yyyy':
					return beg + 'd.getFullYear()' + end;
				case 'yy':
					return beg + 'd.getFullYear().toString().substring(2)' + end;
				case 'MMM':
					ismm = true;
					return beg + 'mm.substring(0, 3)' + end;
				case 'MMMM':
					ismm = true;
					return beg + 'mm' + end;
				case 'MM':
					return beg + '(d.getMonth() + 1).padLeft(2, \'0\')' + end;
				case 'M':
					return beg + '(d.getMonth() + 1)' + end;
				case 'ddd':
					isdd = true;
					return beg + 'dd.substring(0, 2).toUpperCase()' + end;
				case 'dddd':
					isdd = true;
					return beg + 'dd' + end;
				case 'dd':
					return beg + 'd.getDate().padLeft(2, \'0\')' + end;
				case 'd':
					return beg + 'd.getDate()' + end;
				case 'HH':
				case 'hh':
					return beg + (half ? 'window.$jcdatempam(d.getHours()).padLeft(2, \'0\')' : 'd.getHours().padLeft(2, \'0\')') + end;
				case 'H':
				case 'h':
					return beg + (half ? 'window.$jcdatempam(d.getHours())' : 'd.getHours()') + end;
				case 'mm':
					return beg + 'd.getMinutes().padLeft(2, \'0\')' + end;
				case 'm':
					return beg + 'd.getMinutes()' + end;
				case 'ss':
					return beg + 'd.getSeconds().padLeft(2, \'0\')' + end;
				case 's':
					return beg + 'd.getSeconds()' + end;
				case 'w':
				case 'ww':
					isww = true;
					return beg + (key === 'ww' ? 'ww.padLeft(2, \'0\')' : 'ww') + end;
				case 'a':
					var b = '\'PM\':\'AM\'';
					return beg + '(d.getHours() >= 12 ? ' + b + ')' + end;
			}
		});

		ismm && before.push('var mm = M.months[d.getMonth()];');
		isdd && before.push('var dd = M.days[d.getDay()];');
		isww && before.push('var ww = new Date(+d);ww.setHours(0, 0, 0);ww.setDate(ww.getDate() + 4 - (ww.getDay() || 7));ww = Math.ceil((((ww - new Date(ww.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);');

		statics[key] = new Function('d', before.join('\n') + 'return \'' + format + '\';');
		return statics[key](self);
	};
	
});
define('skylark-totaljs-jcomponent/_langx/NumberEx',[
	"../constants",
	"./regexp"
],function(constants,regexp){
	var TYPE_S = constants.TYPE_S,
		TYPE_N = constants.TYPE_N ;
			var NP = Number.prototype;
	NP.pluralize = function(zero, one, few, other) {

		if (zero instanceof Array) {
			one = zero[1];
			few = zero[2];
			other = zero[3];
			zero = zero[0];
		}

		var num = this;
		var value = '';

		if (num == 0)
			value = zero || '';
		else if (num == 1)
			value = one || '';
		else if (num > 1 && num < 5)
			value = few || '';
		else
			value = other;

		return value.indexOf('#') === -1 ? value : value.replace(regexp.pluralize, function(text) {
			return text === '##' ? num.format() : num.toString();
		});
	};

	NP.format = function(decimals, separator, separatorDecimal) {

		var self = this;
		var num = self.toString();
		var dec = '';
		var output = '';
		var minus = num.substring(0, 1) === '-' ? '-' : '';
		if (minus)
			num = num.substring(1);

		var index = num.indexOf('.');

		if (typeof(decimals) === TYPE_S) {
			var tmp;
			if (decimals.substring(0, 1) === '[') {
				tmp = ENV(decimals.substring(1, decimals.length - 1));
				if (tmp) {
					decimals = tmp.decimals;
					if (tmp.separator)
						separator = tmp.separator;
					if (tmp.decimalseparator)
						separatorDecimal = tmp.decimalseparator;
				}
			} else {
				tmp = separator;
				separator = decimals;
				decimals = tmp;
			}
		}

		if (separator === undefined)
			separator = MD.thousandsseparator;

		if (index !== -1) {
			dec = num.substring(index + 1);
			num = num.substring(0, index);
		}

		index = -1;
		for (var i = num.length - 1; i >= 0; i--) {
			index++;
			if (index > 0 && index % 3 === 0)
				output = separator + output;
			output = num[i] + output;
		}

		if (decimals || dec.length) {
			if (dec.length > decimals)
				dec = dec.substring(0, decimals || 0);
			else
				dec = dec.padRight(decimals || 0, '0');
		}

		if (dec.length && separatorDecimal === undefined)
			separatorDecimal = MD.decimalseparator;

		return minus + output + (dec.length ? separatorDecimal + dec : '');
	};

	NP.padLeft = function(t, e) {
		return this.toString().padLeft(t, e || '0');
	};

	NP.padRight = function(t, e) {
		return this.toString().padRight(t, e || '0');
	};

	NP.async = function(fn, callback) {
		var number = this;
		if (number >= 0)
			fn(number, function() {
				setTimeout(function() {
					(number - 1).async(fn, callback);
				}, 1);
			});
		else
			callback && callback();
		return number;
	};

	NP.add = NP.inc = function(value, decimals) {

		var self = this;

		if (value == null)
			return self;

		if (typeof(value) === TYPE_N)
			return self + value;

		var first = value.charCodeAt(0);
		var is = false;

		if (first < 48 || first > 57) {
			is = true;
			value = value.substring(1);
		}

		var length = value.length;
		var num;

		if (value[length - 1] === '%') {
			value = value.substring(0, length - 1);
			if (is) {
				var val = value.parseFloat();
				switch (first) {
					case 42:
						num = self * ((self / 100) * val);
						break;
					case 43:
						num = self + ((self / 100) * val);
						break;
					case 45:
						num = self - ((self / 100) * val);
						break;
					case 47:
						num = self / ((self / 100) * val);
						break;
				}
				return decimals !== undefined ? num.floor(decimals) : num;
			} else {
				num = (self / 100) * value.parseFloat();
				return decimals !== undefined ? num.floor(decimals) : num;
			}

		} else
			num = value.parseFloat();

		switch (first) {
			case 42:
				num = self * num;
				break;
			case 43:
				num = self + num;
				break;
			case 45:
				num = self - num;
				break;
			case 47:
				num = self / num;
				break;
			default:
				num = self;
				break;
		}

		return decimals !== undefined ? num.floor(decimals) : num;
	};

	NP.floor = function(decimals) {
		return Math.floor(this * Math.pow(10, decimals)) / Math.pow(10, decimals);
	};

	NP.parseDate = function(offset) {
		return new Date(this + (offset || 0));
	};
	
});
define('skylark-totaljs-jcomponent/_langx/StringEx',[
	"./regexp",
	"./now"
],function(regexp,now){
	var REGSEARCH = /[^a-zA-Zá-žÁ-Žа-яА-Я\d\s:]/g;
	var DIACRITICS = {225:'a',228:'a',269:'c',271:'d',233:'e',283:'e',357:'t',382:'z',250:'u',367:'u',252:'u',369:'u',237:'i',239:'i',244:'o',243:'o',246:'o',353:'s',318:'l',314:'l',253:'y',255:'y',263:'c',345:'r',341:'r',328:'n',337:'o'};
	
	var SP = String.prototype;
	SP.ROOT = function(noBase) {
		var url = this;
		var r = MD.root;
		var b = MD.baseurl;
		var ext = /(https|http|wss|ws|file):\/\/|\/\/[a-z0-9]|[a-z]:/i;
		var replace = function(t) {
			return t.substring(0, 1) + '/';
		};
		if (r)
			url = typeof(r) === TYPE_FN ? r(url) : ext.test(url) ? url : (r + url);
		else if (!noBase && b)
			url = typeof(b) === TYPE_FN ? b(url) : ext.test(url) ? url : (b + url);
		return url.replace(/[^:]\/{2,}/, replace);
	};

	SP.env = function() {
		var self = this;
		return self.replace(REGENV, function(val) {
			return ENV[val.substring(1, val.length - 1)] || val;
		});
	};

	SP.$env = function() {
		var self = this;
		var index = this.indexOf('?');
		return index === -1 ? self.env() : self.substring(0, index).env() + self.substring(index);
	};

	SP.parseConfig = SP.$config = function(def, callback) {

		var output;

		switch (typeof(def)) {
			case TYPE_FN:
				callback = def;
				output = {};
				break;
			case TYPE_S:
				output = def.parseConfig();
				break;
			case TYPE_O:
				if (def != null)
					output = def;
				else
					output = {};
				break;
			default:
				output = {};
				break;
		}

		var arr = this.env().replace(/\\;/g, '\0').split(';');
		var num = /^(-)?[0-9.]+$/;
		var colon = /(https|http|wss|ws):\/\//gi;

		for (var i = 0, length = arr.length; i < length; i++) {

			var item = arr[i].replace(/\0/g, ';').replace(/\\:/g, '\0').replace(colon, function(text) {
				return text.replace(/:/g, '\0');
			});

			var kv = item.split(':');
			var l = kv.length;

			if (l !== 2)
				continue;

			var k = kv[0].trim();
			var v = kv[1].trim().replace(/\0/g, ':').env();

			if (v === 'true' || v === 'false')
				v = v === 'true';
			else if (num.test(v)) {
				var tmp = +v;
				if (!isNaN(tmp))
					v = tmp;
			}

			output[k] = v;
			callback && callback(k, v);
		}

		return output;
	};

	SP.render = function(a, b) {
		return Tangular.render(this, a, b);
	};

	SP.isJSONDate = function() {
		var t = this;
		var l = t.length - 1;
		return l > 18 && l < 30 && t.charCodeAt(l) === 90 && t.charCodeAt(10) === 84 && t.charCodeAt(4) === 45 && t.charCodeAt(13) === 58 && t.charCodeAt(16) === 58;
	};

	SP.parseExpire = function() {

		var str = this.split(' ');
		var number = parseInt(str[0]);

		if (isNaN(number))
			return 0;

		var min = 60000 * 60;

		switch (str[1].trim().replace(/\./g, '')) {
			case 'minutes':
			case 'minute':
			case 'min':
			case 'mm':
			case 'm':
				return 60000 * number;
			case 'hours':
			case 'hour':
			case 'HH':
			case 'hh':
			case 'h':
			case 'H':
				return min * number;
			case 'seconds':
			case 'second':
			case 'sec':
			case 'ss':
			case 's':
				return 1000 * number;
			case 'days':
			case 'day':
			case 'DD':
			case 'dd':
			case 'd':
				return (min * 24) * number;
			case 'months':
			case 'month':
			case 'MM':
			case 'M':
				return (min * 24 * 28) * number;
			case 'weeks':
			case 'week':
			case 'W':
			case 'w':
				return (min * 24 * 7) * number;
			case 'years':
			case 'year':
			case 'yyyy':
			case 'yy':
			case 'y':
				return (min * 24 * 365) * number;
			default:
				return 0;
		}
	};

	SP.removeDiacritics = function() {
		var buf = '';
		for (var i = 0, length = this.length; i < length; i++) {
			var c = this[i];
			var code = c.charCodeAt(0);
			var isUpper = false;

			var r = DIACRITICS[code];
			if (r === undefined) {
				code = c.toLowerCase().charCodeAt(0);
				r = DIACRITICS[code];
				isUpper = true;
			}

			if (r === undefined) {
				buf += c;
				continue;
			}

			c = r;
			buf += isUpper ? c.toUpperCase() : c;
		}
		return buf;
	};

	SP.toSearch = function() {

		var str = this.replace(REGSEARCH, '').trim().toLowerCase().removeDiacritics();
		var buf = [];
		var prev = '';

		for (var i = 0, length = str.length; i < length; i++) {
			var c = str.substring(i, i + 1);
			if (c === 'y')
				c = 'i';
			if (c !== prev) {
				prev = c;
				buf.push(c);
			}
		}

		return buf.join('');
	};

	SP.slug = function(max) {
		max = max || 60;

		var self = this.trim().toLowerCase().removeDiacritics();
		var builder = '';
		var length = self.length;

		for (var i = 0; i < length; i++) {
			var c = self.substring(i, i + 1);
			var code = self.charCodeAt(i);

			if (builder.length >= max)
				break;

			if (code > 31 && code < 48) {
				if (builder.substring(builder.length - 1, builder.length) !== '-')
					builder += '-';
			} else if (code > 47 && code < 58)
				builder += c;
			else if (code > 94 && code < 123)
				builder += c;
		}

		var l = builder.length - 1;
		return builder[l] === '-' ? builder.substring(0, l) : builder;
	};

	SP.isEmail = function() {
		var str = this;
		return str.length <= 4 ? false : MV.email.test(str);
	};

	SP.isPhone = function() {
		var str = this;
		return str.length < 6 ? false : MV.phone.test(str);
	};

	SP.isURL = function() {
		var str = this;
		return str.length <= 7 ? false : MV.url.test(str);
	};

	SP.parseInt = function(def) {
		var str = this.trim();
		var val = str.match(regexp.int);
		if (!val)
			return def || 0;
		val = +val[0];
		return isNaN(val) ? def || 0 : val;
	};

	SP.parseFloat = function(def) {
		var str = this.trim();
		var val = str.match(regexp.float);
		if (!val)
			return def || 0;
		val = val[0];
		if (val.indexOf(',') !== -1)
			val = val.replace(',', '.');
		val = +val;
		return isNaN(val) ? def || 0 : val;
	};

	SP.padLeft = function(t, e) {
		var r = this.toString();
		return Array(Math.max(0, t - r.length + 1)).join(e || ' ') + r;
	};

	SP.padRight = function(t, e) {
		var r = this.toString();
		return r + Array(Math.max(0, t - r.length + 1)).join(e || ' ');
	};
	
	SP.format = function() {
		var arg = arguments;
		return this.replace(regexp.format, function(text) {
			var value = arg[+text.substring(1, text.length - 1)];
			return value == null ? '' : value instanceof Array ? value.join('') : value;
		});
	};

	SP.parseDate = function() {
		var self = this.trim();
		if (!self)
			return null;

		var lc = self.charCodeAt(self.length - 1);

		// Classic date
		if (lc === 41)
			return new Date(self);

		// JSON format
		if (lc === 90)
			return new Date(Date.parse(self));

		var arr = self.indexOf(' ') === -1 ? self.split('T') : self.split(' ');
		var index = arr[0].indexOf(':');
		var length = arr[0].length;

		if (index !== -1) {
			var tmp = arr[1];
			arr[1] = arr[0];
			arr[0] = tmp;
		}

		if (arr[0] === undefined)
			arr[0] = '';

		var noTime = arr[1] === undefined ? true : arr[1].length === 0;

		for (var i = 0; i < length; i++) {
			var c = arr[0].charCodeAt(i);
			if ((c > 47 && c < 58) || c === 45 || c === 46)
				continue;
			if (noTime)
				return new Date(self);
		}

		if (arr[1] === undefined)
			arr[1] = '00:00:00';

		var firstDay = arr[0].indexOf('-') === -1;

		var date = (arr[0] || '').split(firstDay ? '.' : '-');
		var time = (arr[1] || '').split(':');
		var parsed = [];

		if (date.length < 4 && time.length < 2)
			return new Date(self);

		index = (time[2] || '').indexOf('.');

		// milliseconds
		if (index !== -1) {
			time[3] = time[2].substring(index + 1);
			time[2] = time[2].substring(0, index);
		} else
			time[3] = '0';

		parsed.push(+date[firstDay ? 2 : 0]); // year
		parsed.push(+date[1]); // month
		parsed.push(+date[firstDay ? 0 : 2]); // day
		parsed.push(+time[0]); // hours
		parsed.push(+time[1]); // minutes
		parsed.push(+time[2]); // seconds
		parsed.push(+time[3]); // miliseconds

		var def = now(true); //def = W.DATETIME = W.NOW = new Date();

		for (var i = 0, length = parsed.length; i < length; i++) {
			if (isNaN(parsed[i]))
				parsed[i] = 0;

			var value = parsed[i];
			if (value !== 0)
				continue;

			switch (i) {
				case 0:
					if (value <= 0)
						parsed[i] = def.getFullYear();
					break;
				case 1:
					if (value <= 0)
						parsed[i] = def.getMonth() + 1;
					break;
				case 2:
					if (value <= 0)
						parsed[i] = def.getDate();
					break;
			}
		}

		return new Date(parsed[0], parsed[1] - 1, parsed[2], parsed[3], parsed[4], parsed[5]);
	};
});
define('skylark-totaljs-jcomponent/langx',[
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
define('skylark-totaljs-jcomponent/defaults',[
	"./jc"
],function(jc){
	var defaults =  {
		scope : Window,
		delay : 555,
		delaywatcher : 555,
		delaybinder : 200,
		fallback : 'https://cdn.componentator.com/j-{0}.html',
		fallbackcache : '',
		localstorage : true,
		version : '',
		importcache : 'session',
		root : '' , // String or Function
		keypress : true,
		jsoncompress : false,
		thousandsseparator : ' ',
		decimalseparator : '.',
		dateformat : null

	};

	try {
		var pmk = 'jc.test';
		Window.localStorage.setItem(pmk, '1');
		defaults.isPRIVATEMODE = Window.localStorage.getItem(pmk) !== '1'; //W.isPRIVATEMODE
		Window.localStorage.removeItem(pmk);
	} catch (e) {
		defaults.isPRIVATEMODE = true; //W.isPRIVATEMODE
	}
	
	return jc.defaults = defaults;
});
define('skylark-totaljs-jcomponent/caches',[
	"./jc",
	"./defaults",
	"./langx"
],function(jc,defaults,langx){
	var M = jc,
		MD = defaults;

	var cache = {};


	var autofill = [];
	var current = {
		owner : null,
		element : null,
		com : null
	};

	//var current_owner = null;
	//var current_element = null;
	//var current_com = null;	

	// cache
	function get(key) {
		return cache[key];
	}

	function put(key,value) {
		cache[key] = value;
		return this;
	}

	function clear() {

		if (!arguments.length) {
			cache = {};
			return;
		}

		var arr = langx.keys(cache);

		for (var i = 0, length = arr.length; i < length; i++) {
			var key = arr[i];
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
				delete cache[key];
			}
		}
	}

	var temp = {};

	setInterval(function() {
//		temp = {};
		for (var k in temp) {
			delete temp[k];
		}
//		paths = {};
//		cleaner();
	}, (1000 * 60) * 5);	

	return {
		get,
		put,
		clear,

		temp,
		autofill,
		cache,
		current
	};
});
define('skylark-totaljs-jcomponent/topic',[
	"./jc",
	"./langx",
	"./caches"
],function(jc, langx,caches){
	var events = {};

	// ===============================================================
	// Eventer
	// ===============================================================


	function on(name, path, fn, init, context) {

		if (name.indexOf(MULTIPLE) !== -1) {
			var arr = name.split(MULTIPLE).trim();
			for (var i = 0; i < arr.length; i++)
				on(arr[i], path, fn, init, context);
			return this; //W;
		}

		var push = true;

		if (name.substring(0, 1) === '^') {
			push = false;
			name = name.substring(1);
		}

		var owner = null;
		var index = name.indexOf('#');

		if (index) {
			owner = name.substring(0, index).trim();
			name = name.substring(index + 1).trim();
		}

		if (typeof(path) === TYPE_FN) {
			fn = path;
			path = name === 'watch' ? '*' : '';
		} else
			path = path.replace('.*', '');

		var obj = { name: name, fn: fn, owner: owner || current_owner, context: context || (current_com == null ? undefined : current_com) };

		if (name === 'watch') {
			var arr = [];

			var tmp = findFormat(path);
			if (tmp) {
				path = tmp.path;
				obj.format = tmp.fn;
			}

			if (path.substring(path.length - 1) === '.')
				path = path.substring(0, path.length - 1);

			// Temporary
			if (path.charCodeAt(0) === 37)
				path = 'jctmp.' + path.substring(1);

			path = path.env();

			// !path = fixed path
			if (path.charCodeAt(0) === 33) {
				path = path.substring(1);
				arr.push(path);
			} else {
				var p = path.split('.');
				var s = [];
				for (var j = 0; j < p.length; j++) {
					var b = p[j].lastIndexOf('[');
					if (b !== -1) {
						var c = s.join('.');
						arr.push(c + (c ? '.' : '') + p[j].substring(0, b));
					}
					s.push(p[j]);
					arr.push(s.join('.'));
				}
			}

			obj.path = path;
			obj.$path = arr;

			if (push)
				watches.push(obj);
			else
				watches.unshift(obj);

			init && fn.call(context || M, path, obj.format ? obj.format(get(path), path, 0) : get(path), 0);
		} else {
			if (events[name]) {
				if (push)
					events[name].push(obj);
				else
					events[name].unshift(obj);
			} else
				events[name] = [obj];
			(!C.ready && (name === 'ready' || name === 'init')) && fn();
		}
		return this; //W;
	}

	function off(name, path, fn) {

		if (name.indexOf('+') !== -1) {
			var arr = name.split('+').trim();
			for (var i = 0; i < arr.length; i++)
				W.OFF(arr[i], path, fn);
			return this; //W;
		}

		if (typeof(path) === TYPE_FN) {
			fn = path;
			path = '';
		}

		if (path === undefined)
			path = '';

		var owner = null;
		var index = name.indexOf('#');
		if (index) {
			owner = name.substring(0, index).trim();
			name = name.substring(index + 1).trim();
		}

		if (path) {
			path = path.replace('.*', '').trim();
			var tmp = findFormat(path);
			if (tmp)
				path = tmp.path;
			if (path.substring(path.length - 1) === '.')
				path = path.substring(0, path.length - 1);
		}

		var type = 0;

		if (owner && !path && !fn && !name)
			type = 1;
		else if (owner && name && !fn && !path)
			type = 2;
		else if (owner && name && path)
			type = 3;
		else if (owner && name && path && fn)
			type = 4;
		else if (name && path && fn)
			type = 5;
		else if (name && path)
			type = 7;
		else if (fn)
			type = 6;

		var cleararr = function(arr, key) {
			return arr.remove(function(item) {
				if (type > 2 && type < 5) {
					if (item.path !== path)
						return false;
				}
				var v = false;
				if (type === 1)
					v = item.owner === owner;
				else if (type === 2)
					v = key === name && item.owner === owner;
				else if (type === 3)
					v = key === name && item.owner === owner;
				else if (type === 4)
					v = key === name && item.owner === owner && item.fn === fn;
				else if (type === 5 || type === 6)
					v = key === name && item.fn === fn;
				else if (type === 6)
					v = item.fn === fn;
				else if (type === 7)
					v = key === name && item.path === path;
				else
					v = key === name;
				return v;
			});
		};

		Object.keys(events).forEach(function(p) {
			events[p] = cleararr(events[p], p);
			if (!events[p].length)
				delete events[p];
		});

		watches = cleararr(watches, 'watch');
		return this; //W;
	}

	function emit(name) {

		var e = events[name];
		if (!e)
			return false;

		var args = [];

		for (var i = 1, length = arguments.length; i < length; i++)
			args.push(arguments[i]);

		for (var i = 0, length = e.length; i < length; i++) {
			var context = e[i].context;
			if (context !== undefined && (context === null || context.$removed))
				continue;
			e[i].fn.apply(context || window, args);
		}

		return true;
	}

	return jc.topic = {
		on,
		off,
		emit
	}
});
define('skylark-totaljs-jcomponent/schedulers',[
	"./jc",
	"./langx",
	"./caches"
],function(jc,langx,caches){
	var schedulers = [];
	var schedulercounter = 0;


	function clearAll(ownerId) {
		schedulers.remove('owner', ownerId);
		return this;
	}	

	// scheduler
	schedulercounter = 0;
	setInterval(function() {

		if (!schedulers.length)
			return;

		schedulercounter++;
		//var now = new Date();
		//W.DATETIME = W.NOW = now;
		var now = langx.now(true);
		for (var i = 0, length = schedulers.length; i < length; i++) {
			var item = schedulers[i];
			if (item.type === 'm') {
				if (schedulercounter % 30 !== 0)
					continue;
			} else if (item.type === 'h') {
				// 1800 seconds --> 30 minutes
				// 1800 / 2 (seconds) --> 900
				if (schedulercounter % 900 !== 0)
					continue;
			}

			var dt = now.add(item.expire);
			var arr = FIND(item.selector, true);
			for (var j = 0; j < arr.length; j++) {
				var a = arr[j];
				a && a.usage.compare(item.name, dt) && item.callback(a);
			}
		}
	}, 3500);


	function schedule(selector, name, expire, callback) { //W.SCHEDULE = 
		if (expire.substring(0, 1) !== '-')
			expire = '-' + expire;
		var arr = expire.split(' ');
		var type = arr[1].toLowerCase().substring(0, 1);
		var id = GUID(10);
		schedulers.push({ 
			id: id, 
			name: name, 
			expire: expire, 
			selector: selector, callback: callback, type: type === 'y' || type === 'd' ? 'h' : type, owner: current_owner });
		return id;
	};

	function clear(id) {  //W.CLEARSCHEDULE
		schedulers = schedulers.remove('id', id);
		return this;
	};


	return jc.schedulers = {
		clear,
		clearAll,
		schedule
	}
});
define('skylark-totaljs-jcomponent/plugins',[
	"skylark-utils-dom/query",
	"./jc",
	"./caches",
	"./topic",
	"./schedulers"
],function($, jc, caches, topic, schedulers){
	var registry = {}; // W.PLUGINS

	function Plugin(name, fn) {
		if ((/\W/).test(name)) {
			warn('Plugin name must contain A-Z chars only.');
		}
		if (registry[name]) {
			registry[name].$remove(true);
		}
		var t = this;
		t.element = $(caches.current.element || document.body);
		t.id = 'plug' + name;
		t.name = name;
		registry[name] = t;
		var a = caches.current.owner;
		caches.current.owner = t.id;
		fn.call(t, t);
		caches.current.owner = a;
		topic.emit('plugin', t); // EMIT
	}

	Plugin.prototype.$remove = function() {

		var self = this;
		if (!self.element) {
			return true;
		}

		topic.emit('plugin.destroy', self); // EMIT
		if (self.destroy) {
			self.destroy();
		}

		// Remove all global events
		Object.keys(events).forEach(function(e) {
			var evt = events[e];
			evt = evt.remove('owner', self.id);
			if (!evt.length) {
				delete events[e];
			}
		});

		watches = watches.remove('owner', self.id);

		// Remove events
		topic.off(self.id + '#watch'); // OFF

		// Remove schedulers
		//schedulers = schedulers.remove('owner', self.id);
		schedulers.clearAll(self.id);

		// self.element.remove();
		self.element = null;

		delete registry[self.name];
		return true;
	};

	function register(name, fn) { //W.PLUGIN = 
		return fn ? new Plugin(name, fn) : registry[name]; // W.PLUGINS
	};

	function find(name) {
		return registry[name];
	}
	
	return jc.plugins = {
		Plugin,
		find,
		registry,
		register
	};
});
define('skylark-totaljs-jcomponent/binders',[
	"skylark-utils-dom/query",
	"./jc",
	"./langx",
	"./plugins"
],function($, jc,langx,plugins){
	var ATTRBIND = '[data-bind],[bind],[data-vbind]';

	var REGCOMMA = /,/g;
	var REGEMPTY = /\s/g;
	var REGMETA = /_{2,}/;


	//var W = jc.W = {};


	// temporary
	//W.jctmp = {}; // not used
	//W.W = window; 
	//W.FUNC = {};


	function attrcom(el, name) {
		name = name ? '-' + name : '';
		return el.getAttribute ? el.getAttribute('data-jc' + name) : el.attrd('jc' + name);
	}

	$.fn.scope = function() {

		if (!this.length)
			return null;

		var data = this[0].$scopedata;
		if (data)
			return data;
		var el = this.closest('[' + ATTRSCOPE + ']');
		if (el.length) {
			data = el[0].$scopedata;
			if (data)
				return data;
		}
		return null;
	};


	function initscopes(scopes) {

		var scope = scopes[scopes.length - 1];
		if (scope.$scopedata) {
			return scope.$scopedata;
		}

		var path = attrcom(scope, 'scope');
		var independent = path.substring(0, 1) === '!';

		if (independent) {
			path = path.substring(1);
		}

		var arr = [scope];
		if (!independent) {
			for (var i = scopes.length - 1; i > -1; i--) {
				arr.push(scopes[i]);
				if (scopes[i].getAttribute(ATTRSCOPE).substring(0, 1) === '!') {
					break;
				}
			}
		}

		var absolute = '';

		arr.length && arr.reverse();

		for (var i = 0, length = arr.length; i < length; i++) {

			var sc = arr[i];
			var p = sc.$scope || attrcom(sc, 'scope');

			sc.$initialized = true;

			if (sc.$processed) {
				absolute = p;
				continue;
			}

			sc.$processed = true;
			sc.$isolated = p.substring(0, 1) === '!';

			if (sc.$isolated) {
				p = p.substring(1);
			}

			if (!p || p === '?')
				p = GUID(25).replace(/\d/g, '');

			if (sc.$isolated) {
				absolute = p;
			} else {
				absolute += (absolute ? '.' : '') + p;
			}

			sc.$scope = absolute;
			var d = new Scope();
			d._id = d.ID = d.id = GUID(10);
			d.path = absolute;
			d.elements = arr.slice(0, i + 1);
			d.isolated = sc.$isolated;
			d.element = $(arr[0]);
			sc.$scopedata = d;

			var tmp = attrcom(sc, 'value');
			if (tmp) {
				var fn = new Function('return ' + tmp);
				defaults['#' + HASH(p)] = fn; // paths by path (DEFAULT() --> can reset scope object)
				tmp = fn();
				set(p, tmp);
				emitwatch(p, tmp, 1);
			}

			// Applies classes
			var cls = attrcom(sc, 'class');
			if (cls) {
				(function(cls) {
					cls = cls.split(' ');
					setTimeout(function() {
						var el = $(sc);
						for (var i = 0, length = cls.length; i < length; i++) {
							el.tclass(cls[i]);
						}
					}, 5);
				})(cls);
			}

			tmp = attrcom(sc, 'init');
			if (tmp) {
				tmp = scopes.get(tmp);
				if (tmp) {
					var a = current_owner;
					current_owner = 'scope' + d._id;
					tmp.call(d, p, $(sc));
					current_owner = a;
				}
			}
		}

		return scope.$scopedata;
	}

	function rebinddecode(val) {
		return val.replace(/&#39;/g, '\'');
	}

	function jBinder() {}

	var JBP = jBinder.prototype;
	JBP.exec = function(value, path, index, wakeup, can) {

		var item = this;
		var el = item.el;
		if (index != null) {
			if (item.child == null)
				return;
			item = item.child[index];
			if (item == null)
				return;
		}

		if (item.notnull && value == null)
			return;

		if (item.selector) {
			if (item.cache)
				el = item.cache;
			else {
				el = el.find(item.selector);
				if (el.length)
					item.cache = el;
			}
		}

		if (!el.length)
			return;

		if (!wakeup && item.delay) {
			item.$delay && clearTimeout(item.$delay);
			item.$delay = setTimeout(function(obj, value, path, index, can) {
				obj.$delay = null;
				obj.exec(value, path, index, true, can);
			}, item.delay, item, value, path, index, can);
			return;
		}

		if (item.init) {
			if (item.strict && item.path !== path)
				return;
			if (item.track && item.path !== path) {
				var can = false;
				for (var i = 0; i < item.track.length; i++) {
					if (item.track[i] === path) {
						can = true;
						break;
					}
				}
				if (!can)
					return;
			}
		} else {
			item.init = 1;
		}

		if (item.def && value == null) {
			value = item.def;
		}

		if (item.format) {
			value = item.format(value, path);
		}

		var tmp = null;

		can = can !== false;

		if (item.show && (value != null || !item.show.$nn)) {
			tmp = item.show.call(item.el, value, path, item.el);
			el.tclass('hidden', !tmp);
			if (!tmp)
				can = false;
		}

		if (item.hide && (value != null || !item.hide.$nn)) {
			tmp = item.hide.call(el, value, path, el);
			el.tclass('hidden', tmp);
			if (tmp)
				can = false;
		}

		if (item.invisible && (value != null || !item.invisible.$nn)) {
			tmp = item.invisible.call(item.el, value, path, item.el);
			el.tclass('invisible', tmp);
			if (!tmp)
				can = false;
		}

		if (item.visible && (value != null || !item.visible.$nn)) {
			tmp = item.visible.call(item.el, value, path, item.el);
			el.tclass('invisible', !tmp);
			if (!tmp)
				can = false;
		}

		if (item.classes) {
			for (var i = 0; i < item.classes.length; i++) {
				var cls = item.classes[i];
				if (!cls.fn.$nn || value != null)
					el.tclass(cls.name, !!cls.fn.call(el, value, path, el));
			}
		}

		if (can && item.import) {
			if (typeof(item.import) === TYPE_FN) {
				if (value) {
					!item.$ic && (item.$ic = {});
					!item.$ic[value] && IMPORT('ONCE ' + value, el);
					item.$ic[value] = 1;
				}
			} else {
				IMPORT(item.import, el);
				delete item.import;
			}
		}

		if (item.config && (can || item.config.$nv)) {
			if (value != null || !item.config.$nn) {
				tmp = item.config.call(el, value, path, el);
				if (tmp) {
					for (var i = 0; i < el.length; i++) {
						var c = el[i].$com;
						c && c.$ready && c.reconfigure(tmp);
					}
				}
			}
		}

		if (item.html && (can || item.html.$nv)) {
			if (value != null || !item.html.$nn) {
				tmp = item.html.call(el, value, path, el);
				el.html(tmp == null ? (item.htmlbk || '') : tmp);
			} else
				el.html(item.htmlbk || '');
		}

		if (item.text && (can || item.text.$nv)) {
			if (value != null || !item.text.$nn) {
				tmp = item.text.call(el, value, path, el);
				el.text(tmp == null ? (item.htmlbk || '') : tmp);
			} else
				el.html(item.htmlbk || '');
		}

		if (item.val && (can || item.val.$nv)) {
			if (value != null || !item.val.$nn) {
				tmp = item.val.call(el, value, path, el);
				el.val(tmp == null ? (item.valbk || '') : tmp);
			} else
				el.val(item.valbk || '');
		}

		if (item.template && (can || item.template.$nv) && (value != null || !item.template.$nn)) {
			DEFMODEL.value = value;
			DEFMODEL.path = path;
			el.html(item.template(DEFMODEL));
		}

		if (item.disabled && (can || item.disabled.$nv)) {
			if (value != null || !item.disabled.$nn) {
				tmp = item.disabled.call(el, value, path, el);
				el.prop('disabled', tmp == true);
			} else
				el.prop('disabled', item.disabledbk == true);
		}

		if (item.enabled && (can || item.enabled.$nv)) {
			if (value != null || !item.enabled.$nn) {
				tmp = item.enabled.call(el, value, path, el);
				el.prop('disabled', !tmp);
			} else
				el.prop('disabled', item.enabledbk == false);
		}

		if (item.checked && (can || item.checked.$nv)) {
			if (value != null || !item.checked.$nn) {
				tmp = item.checked.call(el, value, path, el);
				el.prop('checked', tmp == true);
			} else
				el.prop('checked', item.checkedbk == true);
		}

		if (item.title && (can || item.title.$nv)) {
			if (value != null || !item.title.$nn) {
				tmp = item.title.call(el, value, path, el);
				el.attr('title', tmp == null ? (item.titlebk || '') : tmp);
			} else
				el.attr('title', item.titlebk || '');
		}

		if (item.href && (can || item.href.$nv)) {
			if (value != null || !item.href.$nn) {
				tmp = item.href.call(el, value, path, el);
				el.attr('href', tmp == null ? (item.hrefbk || '') : tmp);
			} else
				el.attr(item.hrefbk || '');
		}

		if (item.src && (can || item.src.$nv)) {
			if (value != null || !item.src.$nn) {
				tmp = item.src.call(el, value, path, el);
				el.attr('src', tmp == null ? (item.srcbk || '') : tmp);
			} else
				el.attr('src', item.srcbk || '');
		}

		if (item.setter && (can || item.setter.$nv) && (value != null || !item.setter.$nn))
			item.setter.call(el, value, path, el);

		if (item.change && (value != null || !item.change.$nn))
			item.change.call(el, value, path, el);

		if (can && index == null && item.child) {
			for (var i = 0; i < item.child.length; i++)
				item.exec(value, path, i, undefined, can);
		}

		if (item.tclass) {
			el.tclass(item.tclass);
			delete item.tclass;
		}
	};
	function parsebinderskip(str) {
		var a = arguments;
		for (var i = 1; i < a.length; i++) {
			if (str.indexOf(a[i]) !== -1)
				return false;
		}
		return true;
	}

	function parsebinder(el, b, scopes, r) {
		var meta = b.split(REGMETA);
		if (meta.indexOf('|') !== -1) {
			//Multiple watchers (__|__)
			if (!r) {
				var tmp = [];
				var output = [];
				for (var i = 0; i < meta.length; i++) {
					var m = meta[i];
					if (m === '|') {
						if (tmp.length) {
							output.push(parsebinder(el, tmp.join('__'), scopes));
						} 
						tmp = [];
						continue;
					}
					m && tmp.push(m);
				}
				if (tmp.length) {
					output.push(parsebinder(el, tmp.join('__'), scopes, true));
				} 
			}
			return output;
		}

		var path = null;
		var index = null;
		var obj = new jBinder();
		var cls = [];
		var sub = {};
		var e = obj.el = $(el);

		for (var i = 0; i < meta.length; i++) {
			var item = meta[i].trim();
			if (item) {
				if (i) {

					var k, v;

					if (item !== 'template' && item !== '!template' && item !== 'strict') {

						index = item.indexOf(':');

						if (index === -1) {
							index = item.length;
							item += ':value';
						}

						k = item.substring(0, index).trim();
						v = item.substring(index + 1).trim();
					} else {
						k = item;
					}

					if (k === 'selector') {
						obj[k] = v;
						continue;
					}

					var rki = k.indexOf(' ');
					var rk = rki === -1 ? k : k.substring(0, rki);
					var fn = parsebinderskip(rk, 'setter', 'strict', 'track', 'delay', 'import', 'class', 'template') && k.substring(0, 3) !== 'def' ? v.indexOf('=>') !== -1 ? FN(rebinddecode(v)) : isValue(v) ? FN('(value,path,el)=>' + rebinddecode(v), true) : v.substring(0, 1) === '@' ? obj.com[v.substring(1)] : scopes.get(v) : 1;
					if (!fn)
						return null;

					var keys = k.split('+');
					for (var j = 0; j < keys.length; j++) {

						k = keys[j].trim();

						var s = '';
						var notvisible = false;
						var notnull = false;
						var backup = false;

						index = k.indexOf(' ');
						if (index !== -1) {
							s = k.substring(index + 1);
							k = k.substring(0, index);
						}

						k = k.replace(/^(~!|!~|!|~)/, function(text) {
							if (text.indexOf('!') !== -1)
								notnull = true;
							if (text.indexOf('~') !== -1)
								notvisible = true;
							return '';
						});

						var c = k.substring(0, 1);

						if (k === 'class')
							k = 'tclass';

						if (c === '.') {
							if (notnull)
								fn.$nn = 1;
							cls.push({ name: k.substring(1), fn: fn });
							k = 'class';
						}

						if (typeof(fn) === TYPE_FN) {
							if (notnull)
								fn.$nn = 1;
							if (notvisible)
								fn.$nv = 1;
						}

						switch (k) {
							case 'track':
								obj[k] = v.split(',').trim();
								continue;
							case 'strict':
								obj[k] = true;
								continue;
							case 'hidden':
								k = 'hide';
								break;
							case 'exec':
								k = 'change';
								break;
							case 'disable':
								k = 'disabled';
								backup = true;
								break;
							case 'value':
								k = 'val';
								backup = true;
								break;
							case 'default':
								k = 'def';
								break;
							case 'delay':
								fn = +v;
								break;
							case 'href':
							case 'src':
							case 'val':
							case 'title':
							case 'html':
							case 'text':
							case 'disabled':
							case 'enabled':
							case 'checked':
								backup = true;
								break;

							case 'setter':
								fn = langx.fn('(value,path,el)=>el.SETTER(' + v + ')');
								if (notnull)
									fn.$nn = 1;
								if (notvisible)
									fn.$nv =1;
								break;
							case 'import':
								var c = v.substring(0, 1);
								if ((/^(https|http):\/\//).test(v) || c === '/' || c === '.') {
									if (c === '.')
										fn = v.substring(1);
									else
										fn = v;
								}
								else
									fn = FN(rebinddecode(v));
								break;
							case 'tclass':
								fn = v;
								break;
							case 'template':
								var scr = e.find('script');
								if (!scr.length) {
									scr = e;
								}
								fn = Tangular.compile(scr.html());
								if (notnull) {
									fn.$nn = 1;
								}
								if (notvisible) {
									fn.$nv = 1;
								}
								break;
						}

						if (k === 'def') {
							fn = new Function('return ' + v)();
						}

						if (backup && notnull) {
							obj[k + 'bk'] = (k == 'src' || k == 'href' || k == 'title') ? e.attr(k) : (k == 'html' || k == 'text') ? e.html() : k == 'val' ? e.val() : (k == 'disabled' || k == 'checked') ? e.prop(k) : '';
						}

						if (s) {

							if (!sub[s])
								sub[s] = {};

							if (k !== 'class')
								sub[s][k] = fn;

							else {
								var p = cls.pop();
								if (sub[s].cls) {
									sub[s].cls.push(p);
								} else {
									sub[s].cls = [p];
								}
							}
						} else {
							if (k !== 'class') {
								obj[k] = fn;
							}
						}
					}

				} else {

					// path
					path = item;

					var c = path.substring(0, 1);

					if (c === '!') {
						path = path.substring(1);
						obj.notnull = true;
					}

					if (meta.length === 1) {
						var fn = GET(path);
						fn && fn.call(obj.el, obj.el);
						return fn ? fn : null;
					}

					var tmp = findFormat(path);
					if (tmp) {
						path = tmp.path;
						obj.format = tmp.fn;
					}

					// Is virtual path?
					if (c === '.') {
						obj.virtual = true;
						path = path.substring(1);
						continue;
					}

					if (path.substring(path.length - 1) === '.')
						path = path.substring(0, path.length - 1);

					if (path.substring(0, 1) === '@') {
						path = path.substring(1);

						var isCtrl = false;
						if (path.substring(0, 1) === '@') {
							isCtrl = true;
							path = path.substring(1);
						}

						if (!path)
							path = '@';

						var parent = el.parentNode;
						while (parent) {
							if (isCtrl) {
								if (parent.$ctrl) {
									obj.com = parent.$ctrl;
									if (path === '@' && !obj.com.$dataw) {
										obj.com.$dataw = 1;
										obj.com.watch(function(path, value) {
											obj.com.data('@', value);
										});
									}
									break;
								}
							} else {
								if (parent.$com) {
									obj.com = parent.$com;
									break;
								}
							}
							parent = parent.parentNode;
						}

						if (!obj.com)
							return null;
					}
				}
			}
		}

		var keys = Object.keys(sub);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!obj.child)
				obj.child = [];
			var o = sub[key];
			o.selector = key;
			obj.child.push(o);
		}

		if (cls.length)
			obj.classes = cls;

		if (obj.virtual) {
			path = pathmaker(path);
		} else {

			var bj = obj.com && path.substring(0, 1) === '@';
			path = bj ? path : pathmaker(path);

			if (path.indexOf('?') !== -1) {
				// jComponent scopes
				// You can use data-bind in jComponent scopes, but you need to defined ? (question mark) 
				// on the start of data-bind path. Question mark ? will be replaced for a scope path.
				var scope = initscopes(scopes);
				if (scope)
					path = path.replace(/\?/g, scope.path);
				else
					return;
			}

			var arr = path.split('.');
			var p = '';

			if (obj.com) {
				!obj.com.$data[path] && (obj.com.$data[path] = { value: null, items: [] });
				obj.com.$data[path].items.push(obj);
			} else {
				for (var i = 0, length = arr.length; i < length; i++) {
					p += (p ? '.' : '') + arr[i];
					var k = i === length - 1 ? p : '!' + p;
					if (binders[k]) {
						binders[k].push(obj);
					} else {
						binders[k] = [obj];
					}
				}
			}
		}

		obj.path = path;

		if (obj.track) {
			for (var i = 0; i < obj.track.length; i++)
				obj.track[i] = path + '.' + obj.track[i];
		}

		obj.init = 0;
		!obj.virtual && bindersnew.push(obj);
		return obj;
	}
	
	// ===============================================================
	// MAIN FUNCTIONS
	// ===============================================================

   /**
   * Evaluates a global parser.
   * @param  {String} path 
   * @param  {Object} value
   * @param  {String} type 
   * @returns {Boolean}   
   * OR
   * Registers a global parser.
   * @param  {Function} value 
   */
	function parser(value, path, type) { //W.PARSER = M.parser =  

		if (langx.isFunction(value)) {
			!jc.$parser && (jc.$parser = []);

			// Prepend
			if (path === true) {
				jc.$parser.unshift(value);
			} else {
				jc.$parser.push(value);
			}

			return this;
		}

		var a = jc.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(M, path, value, type);
			}
		}

		return value;
	};


	function findFormat(val) {
		var a = val.indexOf('-->');
		var s = 3;

		if (a === -1) {
			a = val.indexOf('->');
			s = 2;
		}

		if (a !== -1) {
			if (val.indexOf('/') !== -1 && val.indexOf('(') === -1)
				val += '(value)';
		}

		return a === -1 ? null : { 
			path: val.substring(0, a).trim(), 
			fn: langx.fn(val.substring(a + s).trim()) 
		};
	}

	jc.$parser.push(function(path, value, type) {

		switch (type) {
			case 'number':
			case 'currency':
			case 'float':
				var v = +(langx.isString(value) ? value.replace(REGEMPTY, '').replace(REGCOMMA, '.') : value);
				return isNaN(v) ? null : v;

			case 'date':
			case 'datetime':

				if (!value) {
					return null;
				}

				if (value instanceof Date) {
					return value;
				}

				value = value.parseDate();
				return value && value.getTime() ? value : null;
		}

		return value;
	});

	var REGFNPLUGIN = /[a-z0-9_-]+\/[a-z0-9_]+\(|(^|(?=[^a-z0-9]))@[a-z0-9-_]+\./i;


	var regfnplugin = function(v) {
		var l = v.length;
		return pathmaker(v.substring(0, l - 1)) + v.substring(l - 1);
	};

   /**
   * Generates Function from expression of Arrow Function.
   * @example var fn = FN('n => n.toUpperCase()');
   *          console.log(fn('peter')); //Output: PETER
   * @param  {String} exp 
   * @return {Function} 
   */
	function arrowFn(exp, notrim) {  // W.FN = 

		exp = exp.replace(REGFNPLUGIN, regfnplugin);

		var index = exp.indexOf('=>');
		if (index === -1)
			return isValue(exp) ? FN('value=>' + rebinddecode(exp), true) : new Function('return ' + (exp.indexOf('(') === -1 ? 'typeof({0})==\'function\'?{0}.apply(this,arguments):{0}'.format(exp) : exp));

		var arg = exp.substring(0, index).trim();
		var val = exp.substring(index + 2).trim();
		var is = false;

		arg = arg.replace(/\(|\)|\s/g, '').trim();
		if (arg)
			arg = arg.split(',');

		if (val.charCodeAt(0) === 123 && !notrim) {
			is = true;
			val = val.substring(1, val.length - 1).trim();
		}


		var output = (is ? '' : 'return ') + val;
		switch (arg.length) {
			case 1:
				return new Function(arg[0], output);
			case 2:
				return new Function(arg[0], arg[1], output);
			case 3:
				return new Function(arg[0], arg[1], arg[2], output);
			case 4:
				return new Function(arg[0], arg[1], arg[2], arg[3], output);
			case 0:
			default:
				return new Function(output);
		}
	};

	function VBinder(html) {
		var t = this;
		var e = t.element = $(html);
		t.binders = [];
		var fn = function() {
			var dom = this;
			var el = $(dom);
			var b = el.attrd('bind') || el.attr('bind') || el.attrd('vbind');
			dom.$jcbind = parser.parsebinder(dom, b, langx.empties.array); //EMPTYARRAY);
			if(dom.$jcbind) {
			   t.binders.push(dom.$jcbind);
			}
		};
		e.filter(ATTRBIND).each(fn);
		e.find(ATTRBIND).each(fn);
	}

	var VBP = VBinder.prototype;

	VBP.on = function() {
		var t = this;
		t.element.on.apply(t.element, arguments);
		return t;
	};

	VBP.remove = function() {
		var t = this;
		var e = t.element;
		e.find('*').off();
		e.off().remove();
		t.element = null;
		t.binders = null;
		t = null;
		return t;
	};

	VBP.set = function(path, model) {

		var t = this;

		if (model == null) {
			model = path;
			path = '';
		}

		for (var i = 0; i < t.binders.length; i++) {
			var b = t.binders[i];
			if (!path || path === b.path) {
				var val = path || !b.path ? model : $get(b.path, model);
				t.binders[i].exec(val, b.path);
			}
		}

		return t;
	};


	function vbind(html) { // W.VBIND = 
		return new VBinder(html);
	};

	function vbindArray(html, el) { //W.VBINDARRAY = 
		var obj = {};
		obj.html = html;
		obj.items = [];
		obj.element = el instanceof COM ? el.element : $(el);
		obj.element[0].$vbindarray = obj;
		obj.remove = function() {
			for (var i = 0; i < obj.items.length; i++)
				obj.items[i].remove();
			obj.checksum = null;
			obj.items = null;
			obj.html = null;
			obj.element = null;
		};

		var serialize = function(val) {
			switch (typeof(val)) {
				case TYPE_N:
					return val + '';
				case 'boolean':
					return val ? '1' : '0';
				case TYPE_S:
					return val;
				default:
					return val == null ? '' : val instanceof Date ? val.getTime() : JSON.stringify(val);
			}
		};

		var checksum = function(item) {
			var sum = 0;
			var binder = obj.items[0];
			if (binder) {
				for (var j = 0; j < binder.binders.length; j++) {
					var b = binder.binders[j];
					var p = b.path;
					if (b.track) {
						for (var i = 0; i < b.track.length; i++)
							sum += serialize($get((p ? (p + '.') : '') + b.track[i].substring(1), item));
					} else
						sum += serialize(p ? $get(p, item) : item);
				}
			}
			return HASH(sum);
		};

		obj.set = function(index, value) {

			var sum = null;

			if (!(index instanceof Array)) {
				var item = obj.items[index];
				if (item) {
					sum = checksum(value);
					var el = item.element[0];
					if (el.$bchecksum !== sum) {
						el.$bchecksum = sum;
						item.set(value);
					}
				}
				return obj;
			}

			value = index;

			if (obj.items.length > value.length) {
				var rem = obj.items.splice(value.length);
				for (var i = 0; i < rem.length; i++)
					rem[i].remove();
			}

			for (var i = 0; i < value.length; i++) {
				var val = value[i];
				var item = obj.items[i];

				if (!item) {
					item = vbind(obj.html); //VBIND
					obj.items.push(item);
					item.element.attrd('index', i);
					item.element[0].$vbind = item;
					item.index = i;
					obj.element.append(item.element);
				}

				var el = item.element[0];
				sum = checksum(val);

				if (el.$bchecksum !== sum) {
					el.$bchecksum = sum;
					item.set(val);
				}
			}
		};

		return obj;
	};

	return jc.binders = {
		parser,

		jBinder,

		VBinder,
		vbind,
		vbindArray
	};

});
define('skylark-totaljs-jcomponent/storages',[
	"./jc",
	"./defaults",
	"./langx",
	"./caches"
],function(jc,defaults,langx,caches){
	var M = jc,
		MD = defaults;

	var storage = {};

	var $localstorage = 'jc'; //M.$localstorage


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

	return jc.storages = {
		get,
		put,
		remove,
		clearCache,
		save
	};
});
define('skylark-totaljs-jcomponent/http',[
	"./jc",
	"./langx",
	"./topic",
	"./caches",
	"./storages"
],function(jc,langx,topic,caches,storages){
	var ajaxconfig = {};
	var defaults = {

	};
	defaults.ajaxerrors = false;
	defaults.pingdata = {};
	defaults.baseurl = ''; // String or Function
	defaults.makeurl = null; // Function
	defaults.delayrepeat = 2000;
	defaults.jsondate = true;
	defaults.jsonconverter = {
		'text json': function(text) {
			return PARSE(text);
		}
	};
	defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' };

	function parseHeaders(val) {
		var h = {};
		val.split('\n').forEach(function(line) {
			var index = line.indexOf(':');
			if (index !== -1) {
				h[line.substring(0, index).toLowerCase()] = line.substring(index + 1).trim();
			}
		});
		return h;
	}

	function cacherest(method, url, params, value, expire) {

		if (params && !params.version && M.$version)
			params.version = M.$version;

		if (params && !params.language && M.$language)
			params.language = M.$language;

		params = langx.stringify(params);
		var key = langx.hashCode(method + '#' + url.replace(/\//g, '') + params).toString();
		return storages.set(key, value, expire);
	}
	
	function makeurl(url, make) {

		defaults.makeurl && (url = defaults.makeurl(url));

		if (make)
			return url;

		var builder = [];
		var en = encodeURIComponent;

		M.$version && builder.push('version=' + en(M.$version));
		M.$language && builder.push('language=' + en(M.$language));

		if (!builder.length)
			return url;

		var index = url.indexOf('?');
		if (index == -1)
			url += '?';
		else
			url += '&';

		return url + builder.join('&');
	}

	function makeParams(url, values, type) { //W.MAKEPARAMS = 

		var l = location;

		if (typeof(url) === TYPE_O) {
			type = values;
			values = url;
			url = l.pathname + l.search;
		}

		var query;
		var index = url.indexOf('?');
		if (index !== -1) {
			query = M.parseQuery(url.substring(index + 1));
			url = url.substring(0, index);
		} else
			query = {};

		var keys = Object.keys(values);

		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i];
			query[key] = values[key];
		}

		var val = $.param(query, type == null || type === true);
		return url + (val ? '?' + val : '');
	}

	function upload(url, data, callback, timeout, progress) { //W.UPLOAD = 

		if (!langx.isNumber(timeout) && progress == null) {
			progress = timeout;
			timeout = null;
		}

		if (!url)
			url = location.pathname;

		var method = 'POST';
		var index = url.indexOf(' ');
		var tmp = null;

		if (index !== -1)
			method = url.substring(0, index).toUpperCase();

		var isCredentials = method.substring(0, 1) === '!';
		if (isCredentials)
			method = method.substring(1);

		var headers = {};
		tmp = url.match(/\{.*?\}/g);

		if (tmp) {
			url = url.replace(tmp, '').replace(/\s{2,}/g, ' ');
			tmp = (new Function('return ' + tmp))();
			if (typeof(tmp) === TYPE_O)
				headers = tmp;
		}

		url = url.substring(index).trim().$env();

		if (typeof(callback) === TYPE_N) {
			timeout = callback;
			callback = undefined;
		}

		var output = {};
		output.url = url;
		output.process = true;
		output.error = false;
		output.upload = true;
		output.method = method;
		output.data = data;

		topic.emit('request', output);

		if (output.cancel)
			return;

		setTimeout(function() {

			var xhr = new XMLHttpRequest();

			if (isCredentials) {
				xhr.withCredentials = true;
			}

			xhr.addEventListener('load', function() {

				var self = this;
				var r = self.responseText;
				try {
					r = PARSE(r, defaults.jsondate);
				} catch (e) {}

				if (progress) {
					if (typeof(progress) === TYPE_S)
						remap(progress, 100);
					else
						progress(100);
				}

				output.response = r;
				output.status = self.status;
				output.text = self.statusText;
				output.error = self.status > 399;
				output.headers = parseHeaders(self.getAllResponseHeaders());

				topic.emit('response', output);

				if (!output.process || output.cancel)
					return;

				if (!r && output.error)
					r = output.response = self.status + ': ' + self.statusText;

				if (!output.error || defaults.ajaxerrors) {
					typeof(callback) === TYPE_S ? remap(callback.env(), r) : (callback && callback(r, null, output));
				} else {
					topic.emit('error', output);
					output.process && typeof(callback) === TYPE_FN && callback({}, r, output);
				}

			}, false);

			xhr.upload.onprogress = function(evt) {
				if (!progress)
					return;
				var percentage = 0;
				if (evt.lengthComputable)
					percentage = Math.round(evt.loaded * 100 / evt.total);
				if (langx.isString(progress)) {
					remap(progress.env(), percentage);
				} else {
					progress(percentage, evt.transferSpeed, evt.timeRemaining);
				}
			};

			xhr.open(method, makeurl(output.url));

			var keys = Object.keys(defaults.headers);
			for (var i = 0; i < keys.length; i++) {
				xhr.setRequestHeader(keys[i].env(), defaults.headers[keys[i]].env());
			}

			if (headers) {
				var keys = Object.keys(headers);
				for (var i = 0; i < keys.length; i++) {
					xhr.setRequestHeader(keys[i], headers[keys[i]]);
				}
			}

			xhr.send(data);

		}, timeout || 0);

		return W;
	}


	function importCache(url, expire, target, callback, insert, preparator) { // W.IMPORTCACHE = 

		var w;

		url = url.$env().replace(/<.*?>/, function(text) {
			w = text.substring(1, text.length - 1).trim();
			return '';
		}).trim();

		// unique
		var first = url.substring(0, 1);
		var once = url.substring(0, 5).toLowerCase() === 'once ';

		if (langx.isFunction(target)) {

			if (langx.isFunction(callback)) {
				preparator = callback;
				insert = true;
			} else if (typeof(insert) === TYPE_FN) {
				preparator = insert;
				insert = true;
			}

			callback = target;
			target = 'body';
		} else if (langx.isFunction(insert)) {
			preparator = insert;
			insert = true;
		}

		if (w) {

			var wf = w.substring(w.length - 2) === '()';
			if (wf) {
				w = w.substring(0, w.length - 2);
			}

			var wo = GET(w);
			if (wf && langx.isFunction(wo)) {
				if (wo()) {
					callback && callback(0);
					return;
				}
			} else if (wo) {
				callback && callback(0);
				return;
			}
		}

		if (url.substring(0, 2) === '//')
			url = location.protocol + url;

		var index = url.lastIndexOf(' .');
		var ext = '';

		if (index !== -1) {
			ext = url.substring(index).trim().toLowerCase();
			url = url.substring(0, index).trim();
		}

		if (first === '!' || once) {

			if (once) {
				url = url.substring(5);
			} else {
				url = url.substring(1);
			}

			if (statics[url]) {
				if (callback) {
					if (statics[url] === 2)
						callback(0);
					else {
						langx.wait(function() {
							return statics[url] === 2;
						}, function() {
							callback(0);
						});
					}
				}
				return W;
			}

			statics[url] = 1;
		}

		if (target && target.setPath)
			target = target.element;

		if (!target)
			target = 'body';

		if (!ext) {
			index = url.lastIndexOf('?');
			if (index !== -1) {
				var index2 = url.lastIndexOf('.', index);
				if (index2 !== -1) {
					ext = url.substring(index2, index).toLowerCase();
				}
			} else {
				index = url.lastIndexOf('.');
				if (index !== -1) {
					ext = url.substring(index).toLowerCase();
				}
			}
		}

		var d = document;
		if (ext === '.js') {
			var scr = d.createElement('script');
			scr.type = 'text/javascript';
			scr.async = false;
			scr.onload = function() {
				statics[url] = 2;
				callback && callback(1);
				setTimeout(compile, 300);//W.jQuery && 
			};
			scr.src = makeurl(url, true);
			d.getElementsByTagName('head')[0].appendChild(scr);
			topic.emit('import', url, $(scr));
			return this;
		}

		if (ext === '.css') {
			var stl = d.createElement('link');
			stl.type = 'text/css';
			stl.rel = 'stylesheet';
			stl.href = makeurl(url, true);
			d.getElementsByTagName('head')[0].appendChild(stl);
			statics[url] = 2;
			callback && setTimeout(callback, 200, 1);
			topic.emit('import', url, $(stl));
			return this;
		}

		langx.wait(function() {
			return !!W.jQuery;
		}, function() {

			statics[url] = 2;
			var id = 'import' + HASH(url);

			var cb = function(response, code, output) {

				if (!response) {
					callback && callback(0);
					return;
				}

				url = '$import' + url;

				if (preparator)
					response = preparator(response, output);

				var is = REGCOM.test(response);
				response = importscripts(importstyles(response, id)).trim();
				target = $(target);

				if (response) {
					caches.current.element = target[0];
					if (insert === false) {
						target.html(response);
					} else {
						target.append(response);
					}
					caches.current.element = null;
				}

				setTimeout(function() {
					// is && compile(response ? target : null);
					// because of paths
					is && compile();
					callback && langx.wait(function() {
						return C.is == false;
					}, function() {
						callback(1);
					});
					topic.emit('import', url, target);
				}, 10);
			};

			if (expire) {
				ajaxCache('GET ' + url, null, cb, expire);
			}else {
				ajax('GET ' + url, cb);
			}
		});

		return W;
	}

	function import2(url, target, callback, insert, preparator) { //W.IMPORT = M.import = 
		if (url instanceof Array) {

			if (langx.isFunction(target)) {
				preparator = insert;
				insert = callback;
				callback = target;
				target = null;
			}

			url.wait(function(url, next) {
				importCache(url, null, target, next, insert, preparator);
			}, function() {
				callback && callback();
			});
		} else {
			importCache(url, null, target, callback, insert, preparator);
		}

		return this;
	}

	function uptodate(period, url, callback, condition) { // W.UPTODATE = 

		if (langx.isFunction(url)) {
			condition = callback;
			callback = url;
			url = '';
		}

		var dt = new Date().add(period);
		topic.on('knockknock', function() {
			if (dt > langx.now()) //W.NOW)
				return;
			if (!condition || !condition())
				return;
			var id = setTimeout(function() {
				var l = window.location;
				if (url)
					l.href = url.$env();
				else
					l.reload(true);
			}, 5000);
			callback && callback(id);
		});
	}

	function ping(url, timeout, execute) { // W.PING = 

		if (navigator.onLine != null && !navigator.onLine)
			return;

		if (typeof(timeout) === 'boolean') {
			execute = timeout;
			timeout = 0;
		}

		url = url.$env();

		var index = url.indexOf(' ');
		var method = 'GET';

		if (index !== -1) {
			method = url.substring(0, index).toUpperCase();
			url = url.substring(index).trim();
		}

		var options = {};
		var data = $.param(defaults.pingdata);

		if (data) {
			index = url.lastIndexOf('?');
			if (index === -1)
				url += '?' + data;
			else
				url += '&' + data;
		}

		options.type = method;
		options.headers = { 'x-ping': location.pathname, 'x-cookies': navigator.cookieEnabled ? '1' : '0', 'x-referrer': document.referrer };

		options.success = function(r) {
			if (r) {
				try {
					(new Function(r))();
				} catch (e) {}
			}
		};

		execute && $.ajax(makeurl(url), options);

		return setInterval(function() {
			$.ajax(makeurl(url), options);
		}, timeout || 30000);
	}

	function parseQuery(value) { //M.parseQuery = W.READPARAMS = 

		if (!value)
			value = location.search;

		if (!value)
			return {};

		var index = value.indexOf('?');
		if (index !== -1)
			value = value.substring(index + 1);

		var arr = value.split('&');
		var obj = {};
		for (var i = 0, length = arr.length; i < length; i++) {
			var sub = arr[i].split('=');
			var key = sub[0];
			var val = decodeURIComponent((sub[1] || '').replace(/\+/g, '%20'));

			if (!obj[key]) {
				obj[key] = val;
				continue;
			}

			if (!(obj[key] instanceof Array))
				obj[key] = [obj[key]];
			obj[key].push(val);
		}
		return obj;
	}

	function configure(name, fn) {  // W.AJAXCONFIG = 
		ajaxconfig[name] = fn;  
		return this;
	}

	function ajax(url, data, callback, timeout) { // W.AJAX = 

		if (typeof(url) === TYPE_FN) {
			timeout = callback;
			callback = data;
			data = url;
			url = location.pathname;
		}

		var td = typeof(data);
		var arg = EMPTYARRAY;
		var tmp;

		if (!callback && (td === TYPE_FN || td === TYPE_S)) {
			timeout = callback;
			callback = data;
			data = undefined;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return W;

		var repeat = false;

		url = url.replace(/\srepeat/i, function() {
			repeat = true;
			return '';
		});

		if (repeat)
			arg = [url, data, callback, timeout];

		var method = url.substring(0, index).toUpperCase();
		var isCredentials = method.substring(0, 1) === '!';
		if (isCredentials)
			method = method.substring(1);

		var headers = {};
		tmp = url.match(/\{.*?\}/g);

		if (tmp) {
			url = url.replace(tmp, '').replace(/\s{2,}/g, ' ');
			tmp = (new Function('return ' + tmp))();
			if (typeof(tmp) === TYPE_O)
				headers = tmp;
		}

		url = url.substring(index).trim().$env();

		setTimeout(function() {

			if (method === 'GET' && data) {
				var qs = (typeof(data) === TYPE_S ? data : jQuery.param(data, true));
				if (qs)
					url += '?' + qs;
			}

			var options = {};
			options.method = method;
			options.converters = defaults.jsonconverter;

			if (method !== 'GET') {
				if (typeof(data) === TYPE_S) {
					options.data = data;
				} else {
					options.contentType = 'application/json; charset=utf-8';
					options.data = STRINGIFY(data);
				}
			}

			options.headers = $.extend(headers, defaults.headers);

			if (url.match(/http:\/\/|https:\/\//i)) {
				options.crossDomain = true;
				delete options.headers['X-Requested-With'];
				if (isCredentials)
					options.xhrFields = { withCredentials: true };
			} else
				url = url.ROOT();

			var custom = url.match(/\([a-z0-9\-.,]+\)/i);
			if (custom) {
				url = url.replace(custom, '').replace(/\s+/g, '');
				options.url = url;
				custom = custom.toString().replace(/\(|\)/g, '').split(',');
				for (var i = 0; i < custom.length; i++) {
					var opt = ajaxconfig[custom[i].trim()];
					opt && opt(options);
				}
			}

			if (!options.url)
				options.url = url;

			topic.emit('request', options);

			if (options.cancel)
				return;

			options.type = options.method;
			delete options.method;

			var output = {};
			output.url = options.url;
			output.process = true;
			output.error = false;
			output.upload = false;
			output.method = method;
			output.data = data;

			delete options.url;

			options.success = function(r, s, req) {
				output.response = r;
				output.status = req.status || 999;
				output.text = s;
				output.headers = parseHeaders(req.getAllResponseHeaders());
				topic.emit('response', output);
				if (output.process && !output.cancel) {
					if (typeof(callback) === TYPE_S)
						remap(callback, output.response);
					else
						callback && callback.call(output, output.response, undefined, output);
				}
			};

			options.error = function(req, s) {

				var code = req.status;

				if (repeat && (!code || code === 408 || code === 502 || code === 503 || code === 504 || code === 509)) {
					// internal error
					// internet doesn't work
					setTimeout(function() {
						arg[0] += ' REPEAT';
						W.AJAX.apply(M, arg);
					}, defaults.delayrepeat);
					return;
				}

				output.response = req.responseText;
				output.status = code || 999;
				output.text = s;
				output.error = true;
				output.headers = parseHeaders(req.getAllResponseHeaders());
				var ct = output.headers['content-type'];

				if (ct && ct.indexOf('/json') !== -1) {
					try {
						output.response = PARSE(output.response, defaults.jsondate);
					} catch (e) {}
				}

				topic.emit('response', output);

				if (output.cancel || !output.process)
					return;

				if (defaults.ajaxerrors) {
					if (typeof(callback) === TYPE_S)
						remap(callback, output.response);
					else
						callback && callback.call(output, output.response, output.status, output);
				} else {
					topic.emit('error', output);
					typeof(callback) === TYPE_FN && callback.call(output, output.response, output.status, output);
				}
			};

			$.ajax(makeurl(output.url), options);

		}, timeout || 0);

		return this;
	}

	function ajaxCacheReview(url, data, callback, expire, timeout, clear) { //W.AJAXCACHEREVIEW = 
		return ajaxCache(url, data, callback, expire, timeout, clear, true);
	}

	function ajaxCache(url, data, callback, expire, timeout, clear, review) { //W.AJAXCACHE = 

		var tdata = typeof(data);

		if (tdata === TYPE_FN || (tdata === TYPE_S && typeof(callback) === TYPE_S && typeof(expire) !== TYPE_S)) {
			clear = timeout;
			timeout = expire;
			expire = callback;
			callback = data;
			data = null;
		}

		if (typeof(timeout) === 'boolean') {
			clear = timeout === true;
			timeout = 0;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return W;

		var method = url.substring(0, index).toUpperCase();
		var uri = url.substring(index).trim().$env();

		setTimeout(function() {
			var value = clear ? undefined : cacherest(method, uri, data, undefined, expire);
			if (value !== undefined) {

				var diff = review ? STRINGIFY(value) : null;

				if (typeof(callback) === TYPE_S)
					remap(callback, value);
				else
					callback(value, true);

				if (!review)
					return;

				ajax(url, data, function(r, err) {
					if (err)
						r = err;
					// Is same?
					if (diff !== STRINGIFY(r)) {
						cacherest(method, uri, data, r, expire);
						if (typeof(callback) === TYPE_S)
							remap(callback, r);
						else
							callback(r, false, true);
					}
				});
				return;
			}

			ajax(url, data, function(r, err) {
				if (err)
					r = err;
				cacherest(method, uri, data, r, expire);
				if (typeof(callback) === TYPE_S)
					remap(callback, r);
				else
					callback(r, false);
			});
		}, timeout || 1);

		return this;
	}

	return jc.http = {
		defaults,
		ajax,
		ajaxCache,
		ajaxCacheReview,
		configure,
		import2,
		importCache,
		makeParams,
		ping,
		parseQuery,
		upload,
		uptodate
	};

});
define('skylark-totaljs-jcomponent/Usage',[
	"./jc",
	"./langx"
],function(jc,langx){
	// ===============================================================
	// Usage DECLARATION
	// ===============================================================

	function Usage() {
		var t = this;
		t.init = 0;
		t.manually = 0;
		t.input = 0;
		t.default = 0;
		t.custom = 0;
		t.dirty = 0;
		t.valid = 0;
	}

	Usage.prototype.compare = function(type, dt) {
		if (langx.isString(dt) && dt.substring(0, 1) !== '-')
			//dt = W.NOW.add('-' + dt);
			dt = langx.now().add('-' + dt);
		var val = this[type];
		return val === 0 ? true : val < dt.getTime();
	};

	Usage.prototype.convert = function(type) {

		var n = Date.now();
		var output = {};
		var num = 1;
		var t = this;

		switch (type.toLowerCase().substring(0, 3)) {
			case 'min':
			case 'mm':
			case 'm':
				num = 60000;
				break;

			case 'hou':
			case 'hh':
			case 'h':
				num = 360000;
				break;

			case 'sec':
			case 'ss':
			case 's':
				num = 1000;
				break;
		}

		output.init = t.init === 0 ? 0 : ((n - t.init) / num) >> 0;
		output.manually = t.manually === 0 ? 0 : ((n - t.manually) / num) >> 0;
		output.input = t.input === 0 ? 0 : ((n - t.input) / num) >> 0;
		output.default = t.default === 0 ? 0 : ((n - t.default) / num) >> 0;
		output.custom = t.custom === 0 ? 0 : ((n - t.custom) / num) >> 0;
		output.dirty = t.dirty === 0 ? 0 : ((n - t.dirty) / num) >> 0;
		output.valid = t.valid === 0 ? 0 : ((n - t.valid) / num) >> 0;
		return output;
	};
	
	return jc.Usage = Usage;
});
define('skylark-totaljs-jcomponent/Component',[
	"./jc",
	"./langx",
	"./caches",
	"./topic",
	"./Usage"
],function(jc,langx, caches,topic, Usage){
	var	configs =  [],
		extensions = {};

	var counter = 0;

	function com_validate2(com) {

		var valid = true;

		if (com.disabled) {
			return valid;
		}

		if (com.$valid_disabled) {
			return valid;
		}

		var arr = [];
		com.state && arr.push(com);
		com.$validate = true;

		if (com.validate) {
			com.$valid = com.validate(get(com.path));
			com.$interaction(102);
			if (!com.$valid)
				valid = false;
		}

		clear('valid');
		langx.state(arr, 1, 1);
		return valid;
	}

	// ===============================================================
	// COMPONENT DECLARATION
	// ===============================================================

	var Component = langx.Evented.inherit({
		_construct(name) {
			var self = this;
			self._id = self.ID = 'jc' + (counter++);
			self.usage = new Usage();
			self.$dirty = true;
			self.$valid = true;
			self.$validate = false;
			self.$parser = [];
			self.$formatter = [];
			self.$skip = false;
			self.$ready = false;
			self.$path;
			self.trim = true;
			self.$released = false;
			self.$bindreleased = true;
			self.$data = {};

			var version = name.lastIndexOf('@');

			self.name = name;
			self.$name = version === -1 ? name : name.substring(0, version);
			self.version = version === -1 ? '' : name.substring(version + 1);
			self.path;
			self.type;
			self.id;
			self.disabled = false;
			self.removed = false;

			self.make;
			self.done;
			self.prerender;
			self.destroy;
			self.state;
			self.validate;
			self.released;

			self.getter = function(value, realtime, nobind) {

				var self = this;

				value = self.parser(value);
				self.getter2 && self.getter2(value, realtime);

				if (realtime) {
					self.$skip = true;
				}

				// Binds a value
				if (nobind) {
					com_validate2(self);
				} else if (value !== self.get()) {
					self.set(value, 2);
				} else if (realtime === 3) {
					// A validation for same values, "realtime=3" is in "blur" event
					// Because we need to validate the input if the user leaves from the control
					com_validate2(self);
				}
			};

			self.stateX = function(type, what) {
				var key = type + 'x' + what;
				if (!self.$bindchanges || self.$state !== key) {
					self.$state = key;
					self.config.$state && EXEC.call(self, self.config.$state, type, what);
					self.state(type, what);
				}
			};

			self.setterX = function(value, path, type) {

				if (!self.setter || (self.$bindexact && self.path !== path && self.path.indexOf(path + '.') === -1 && type))
					return;

				var cache = self.$bindcache;
				if (arguments.length) {

					if (skips[self.path]) {
						var s = --skips[self.path];
						if (s <= 0) {
							delete skips[self.path];
							return;
						}
					}

					if (self.$format)
						value = self.$format(value, path, type);

					if (self.$bindreleased) {

						if (self.$bindchanges) {
							var hash = HASH(value);
							if (hash === self.$valuehash)
								return;
							self.$valuehash = hash;
						}

						// Binds value directly
						self.config.$setter && EXEC.call(self, self.config.$setter, value, path, type);
						self.data('', value);
						self.setter(value, path, type);
						self.setter2 && self.setter2(value, path, type);
					} else {
						if (self.$released) {
							cache.is = true;
							cache.value = value;
							cache.path = path;
							cache.type = type;
						} else {
							cache.value = value;
							cache.path = path;
							cache.type = type;
							if (!cache.bt) {
								cache.is = true;
								self.setterX();
							}
						}
					}

				} else if (!self.$released && cache && cache.is) {
					cache.is = false;
					cache.bt && clearTimeout(cache.bt);
					cache.bt = setTimeout(function(self) {
						var cache = self.$bindcache;
						cache.bt = 0; // reset timer id

						if (self.$bindchanges) {
							var hash = HASH(value);
							if (hash === self.$valuehash)
								return;
							self.$valuehash = hash;
						}

						self.config.$setter && EXEC.call(self, self.config.$setter, cache.value, cache.path, cache.type);
						self.data('', cache.value);
						self.setter(cache.value, cache.path, cache.type);
						self.setter2 && self.setter2(cache.value, cache.path, cache.type);
					}, self.$bindtimeout, self);
				}
			};

			self.setter = function(value, path, type) {

				var self = this;

				if (type === 2) {
					if (self.$skip) {
						self.$skip = false;
						return;
					}
				}

				var a = 'select-one';
				value = self.formatter(value);

				findcontrol(self.element[0], function(t) {

					if (t.$com !== self)
						t.$com = self;

					var path = t.$com.path;
					if (path && path.length && path !== self.path)
						return;

					if (t.type === 'checkbox') {
						var tmp = value != null ? value.toString().toLowerCase() : '';
						tmp = tmp === 'true' || tmp === '1' || tmp === 'on';
						tmp !== t.checked && (t.checked = tmp);
						return;
					}

					if (value == null)
						value = '';

					if (!type && t.type !== a && t.type !== 'range' && !self.$default && !value)
						autofill.push(t.$com);

					if (t.type === a || t.type === 'select') {
						var el = $(t);
						el.val() !== value && el.val(value);
					} else if (t.value !== value)
						t.value = value;
				});
			};
		}

	});


	var PPC = Component.prototype;

	PPC.data = function(key, value) {

		if (!key) {
			key = '@';
		}

		var self = this;
		var data = self.$data[key];

		if (arguments.length === 1) {
			return data ? data.value : null;
		}

		if (data) {
			data.value = value;
			for (var i = 0; i < data.items.length; i++) {
				var o = data.items[i];
				o.el[0].parentNode && o.exec(value, key);
			}
		} else {
			self.$data[key] = { value: value, items: [] };
		}

		if (self.$ppc) {
			var c = Component.components.all; //M.components;
			for (var i = 0; i < c.length; i++) {
				var com = c[i];
				if (com.owner === self && com.$pp && key === com.path)
					com.setterX(value, value, 2);
			}
		}

		return value;
	};

	PPC.$except = function(except) {
		var p = self.$path;
		for (var a = 0; a < except.length; a++) {
			for (var b = 0; b < p.length; b++) {
				if (except[a] === p[b]) {
					return true;
				}
			}
		}
		return false;
	};

	PPC.$compare = function(path, fix) {
		var self = this;

		if (fix)
			return self.path === path;

		if (path.length > self.path.length) {
			var index = path.lastIndexOf('.', self.path.length);
			return index === -1 ? false : self.path === path.substring(0, index);
		}

		for (var i = 0, length = self.$path.length; i < length; i++) {
			if (self.$path[i] === path) {
				return true;
			}
		}
	};

	function removewaiter(obj) {
		if (obj.$W) {
			var keys = Object.keys(obj.$W);
			for (var i = 0, length = keys.length; i < length; i++) {
				var v = obj.$W[keys[i]];
				if (v.id) {
					clearInterval(v.id);
				}
			}
		}
	}

	PPC.notmodified = function(fields) {
		var t = this;
		if (langx.isString(fields)) {
			fields = [fields];
		}
		return NOTMODIFIED(t._id, t.get(), fields);
	};

	PPC.$waiter = function(prop, callback) {

		var t = this;

		if (prop === true) {
			if (t.$W) {
				var keys = Object.keys(t.$W);
				for (var i = 0; i < keys.length; i++) {
					var k = keys[i];
					var o = t.$W[k];
					o.id = setInterval(function(t, prop) {
						var o = t.$W[prop];
						var v = t[prop]();
						if (v) {
							clearInterval(o.id);
							for (var i = 0; i < o.callback.length; i++)
								o.callback[i].call(t, v);
							delete t.$W[prop];
						}
					}, MD.delaywatcher, t, k);
				}
			}
			return;
		} else if (prop === false) {
			if (t.$W) {
				var keys = Object.keys(t.$W);
				for (var i = 0; i < keys.length; i++) {
					var a = t.$W[keys[i]];
					a && clearInterval(a.id);
				}
			}
			return;
		}

		!t.$W && (t.$W = {});

		if (t.$W[prop]) {
			// Checks if same callback exists
			for (var i = 0; i < t.$W[prop].length; i++) {
				if (t.$W[prop][i] === callback)
					return t;
			}
			t.$W[prop].callback.push(callback);
			return t;
		} else
			t.$W[prop] = { callback: [callback] };

		if (!t.$released) {
			t.$W[prop].id = setInterval(function(t, prop) {
				var o = t.$W[prop];
				var v = t[prop]();
				if (v) {
					clearInterval(o.id);
					for (var i = 0; i < o.callback.length; i++) {
						o.callback[i].call(t, v);
					}
					delete t.$W[prop];
				}
			}, MD.delaywatcher, t, prop);
		}
		return t;
	};

	PPC.hidden = function(callback) {
		var t = this;
		var v = t.element ? t.element[0].offsetParent : null;
		v = v === null;
		if (callback) {
			if (v)
				callback.call(t);
			else
				t.$waiter('hidden', callback);
		}
		return v;
	};

	PPC.visible = function(callback) {
		var t = this;
		var v = t.element ? t.element[0].offsetParent : null;
		v = v !== null;
		if (callback) {
			if (v) {
				callback.call(t);
			} else {
				t.$waiter('visible', callback);
			}
		}
		return v;
	};

	PPC.width = function(callback) {
		var t = this;
		var v = t.element ? t.element[0].offsetWidth : 0;
		if (callback) {
			if (v) {
				callback.call(t, v);
			} else {
				t.$waiter('width', callback);
			}
		}
		return v;
	};

	PPC.height = function(callback) {
		var t = this;
		var v = t.element ? t.element[0].offsetHeight : 0;
		if (callback) {
			if (v) {
				callback.call(t, v);
			} else {
				t.$waiter('height', callback);
			}
		}
		return v;
	};

	PPC.import = function(url, callback, insert, preparator) {
		var self = this;
		M.import(url, self.element, callback, insert, preparator);
		return self;
	};

	PPC.release = function(value, container) {

		var self = this;
		if (value === undefined || self.$removed) {
			return self.$released;
		}

		self.attrd('jc-released', value);

		(container || self.element).find(consts.ATTRCOM).each(function() {
			var el = $(this);
			el.attrd('jc-released', value ? 'true' : 'false');
			var com = el[0].$com;
			if (com instanceof Object) {
				if (com instanceof Array) {
					for (var i = 0, length = com.length; i < length; i++) {
						var o = com[i];
						if (!o.$removed && o.$released !== value) {
							o.$released = value;
							o.released && o.released(value, self);
							o.$waiter(!value);
							!value && o.setterX();
						}
					}
				} else if (!com.$removed && com.$released !== value) {
					com.$released = value;
					com.released && com.released(value, self);
					com.$waiter(!value);
					!value && com.setterX();
				}
			}
		});

		if (!container && self.$released !== value) {
			self.$released = value;
			self.released && self.released(value, self);
			self.$waiter(!value);
			!value && self.setterX();
		}

		return value;
	};

	PPC.validate2 = function() {
		return com_validate2(this);
	};

	PPC.exec = function(name, a, b, c, d, e) {
		var self = this;
		self.find(consts.ATTRCOM).each(function() {
			var t = this;
			if (t.$com) {
				t.$com.caller = self;
				t.$com[name] && this.$com[name](a, b, c, d, e);
			}
		});
		return self;
	};

	PPC.replace = function(el, remove) {
		var self = this;

		if (C.is) {
			C.recompile = true;
		}

		var n = 'jc-scope';
		var prev = self.element;
		var scope = prev.attrd(n);

		self.element.rattrd('jc');
		self.element[0].$com = null;
		scope && self.element.rattrd(n);

		if (remove) {
			prev.off().remove();
		} else {
			self.attrd('jc-replaced', 'true');
		}

		self.element = $(el);
		self.dom = self.element[0];
		self.dom.$com = self;
		self.attrd('jc', self.name);
		if (scope) {
			self.attrd(n, scope);
		}
		self.siblings = false;
		return self;
	};

	//PPC.compile 

	PPC.nested = function() {
		var arr = [];
		this.find(ATTRCOM).each(function() {
			var el = $(this);
			var com = el[0].$com;
			if (com && !el.attr(ATTRDEL)) {
				if (com instanceof Array)
					arr.push.apply(arr, com);
				else
					arr.push(com);
			}
		});
		return arr;
	};

	PPC.$interaction = function(type) {

		// type === 0 : init
		// type === 1 : manually
		// type === 2 : by input
		// type === 3 : by default
		// type === 100 : custom
		// type === 101 : dirty
		// type === 102 : valid

		var now = Date.now();
		var t = this;

		switch (type) {
			case 0:
				t.usage.init = now;
				t.$binded = true;
				break;
			case 1:
				t.usage.manually = now;
				t.$binded = true;
				break;
			case 2:
				t.usage.input = now;
				t.$binded = true;
				break;
			case 3:
				t.usage.default = now;
				t.$binded = true;
				break;
			case 100:
				t.usage.custom = now;
				break;
			case 101:
				t.usage.dirty = now;
				break;
			case 102:
				t.usage.valid = now;
				break;
		}

		return t;
	};

	PPC.notify = function() {
		NOTIFY(this.path);
		return this;
	};

	PPC.update = PPC.refresh = function(notify, type) {
		var self = this;
		if (self.$binded) {

			if (typeof(notify) === TYPE_S) {
				type = notify;
				notify = true;
			}

			if (notify)
				self.set(self.get(), type);
			else {
				self.setter && self.setterX(self.get(), self.path, 1);
				self.$interaction(1);
			}
		}
		return self;
	};

	PPC.tclass = function(cls, v) {
		var self = this;
		self.element.tclass(cls, v);
		return self;
	};

	PPC.aclass = function(cls, timeout) {
		var self = this;
		if (timeout)
			setTimeout(function() { self.element.aclass(cls); }, timeout);
		else
			self.element.aclass(cls);
		return self;
	};

	PPC.hclass = function(cls) {
		return this.element.hclass(cls);
	};

	PPC.rclass = function(cls, timeout) {
		var self = this;
		var e = self.element;
		if (timeout)
			setTimeout(function() { e.rclass(cls); }, timeout);
		else {
			if (cls)
				e.rclass(cls);
			else
				e.rclass();
		}
		return self;
	};

	PPC.rclass2 = function(search) {
		this.element.rclass2(search);
		return this;
	};

	PPC.classes = function(cls) {

		var key = 'cls.' + cls;
		var tmp = caches.temp[key];
		var t = this;
		var e = t.element;

		if (tmp) {
			tmp.add && e.aclass(tmp.add);
			tmp.rem && e.rclass(tmp.rem);
			return t;
		}

		var arr = cls instanceof Array ? cls : cls.split(' ');
		var add = '';
		var rem = '';

		for (var i = 0, length = arr.length; i < length; i++) {
			var c = arr[i].substring(0, 1);
			if (c === '-')
				rem += (rem ? ' ' : '') + arr[i].substring(1);
			else
				add += (add ? ' ' : '') + (c === '+' ? arr[i].substring(1) : arr[i]);
		}

		if (add) {
			e.aclass(add);
		}
		if (rem) {
			e.rclass(rem);
		}

		if (cls instanceof Array) {
			return t;
		}

		caches.temp[key] = { add: add, rem: rem };
		return t;
	};

	PPC.toggle = function(cls, visible, timeout) {

		var manual = false;
		var self = this;

		if (!langx.isString(cls)) {
			timeout = visible;
			visible = cls;
			cls = 'hidden';
			manual = true;
		}

		if (langx.isNumber(visible)) {
			timeout = visible;
			visible = undefined;
		} else if (manual && visible !== undefined) {
			visible = !visible;
		}

		var el = self.element;
		if (!timeout) {
			el.tclass(cls, visible);
			return self;
		}

		setTimeout(function() {
			el.tclass(cls, visible);
		}, timeout);
		return self;
	};

	PPC.noscope = PPC.noScope = function(value) {
		var self = this;
		self.$noscope = value === undefined ? true : value === true;
		return self;
	};

	PPC.nocompile = function() {
		var self = this;
		self.element.attrd('jc-compile', '0');
		return self;
	};

	PPC.singleton = function() {
		var self = this;
		statics['$ST_' + self.name] = true;
		return self;
	};

	PPC.blind = function() {
		var self = this;
		self.path = null;
		self.$path = null;
		self.$$path = null;
		return self;
	};

	PPC.bindchanges = PPC.bindChanges = function(enable) {
		this.$bindchanges = enable == null || enable === true;
		return this;
	};

	PPC.bindexact = PPC.bindExact = function(enable) {
		this.$bindexact = enable == null || enable === true;
		return this;
	};

	PPC.bindvisible = PPC.bindVisible = function(timeout) {
		var self = this;
		self.$bindreleased = false;
		self.$bindtimeout = timeout || MD.delaybinder;
		self.$bindcache = {};
		return self;
	};

	PPC.readonly = function() {
		var self = this;
		self.noDirty();
		self.noValid();
		self.getter = null;
		self.setter = null;
		self.$parser = null;
		self.$formatter = null;
		return self;
	};

	PPC.novalidate = PPC.noValid = PPC.noValidate = function(val) {
		if (val === undefined) {
			val = true;
		}
		var self = this;
		self.$valid_disabled = val;
		self.$valid = val;
		return self;
	};

	PPC.nodirty = PPC.noDirty = function(val) {
		if (val === undefined) {
			val = true;
		}
		var self = this;
		self.$dirty_disabled = val;
		self.$dirty = !val;
		return self;
	};

	PPC.datasource = function(path, callback, init) {
		var self = this;
		var ds = self.$datasource;

		ds && self.unwatch(ds.path, ds.fn);

		if (path) {
			self.$datasource = { path: path, fn: callback };
			self.watch(path, callback, init !== false);
		} else
			self.$datasource = null;

		return self;
	};

	PPC.setPath = function(path, type) {

		// type 1: init
		// type 2: scope

		var self = this;
		var tmp = findFormat(path);

		if (tmp) {
			path = tmp.path;
			self.$format = tmp.fn;
		} else if (!type)
			self.$format = null;

		var arr = [];

		if (path.substring(0, 1) === '@') {
			path = path.substring(1);
			self.$pp = true;
			self.owner.$ppc = true;
		} else {
			self.$pp = false;
		}

		// Temporary
		if (path.charCodeAt(0) === 37) { // %
			path = 'jctmp.' + path.substring(1);
		}

		path = path.env();

		// !path = fixed path
		if (path.charCodeAt(0) === 33) { // !
			path = path.substring(1);
			arr.push(path);
		} else {
			var p = path.split('.');
			var s = [];
			for (var j = 0; j < p.length; j++) {
				var b = p[j].lastIndexOf('[');
				if (b !== -1) {
					var c = s.join('.');
					arr.push(c + (c ? '.' : '') + p[j].substring(0, b));
				}
				s.push(p[j]);
				arr.push(s.join('.'));
			}
		}

		self.path = path;
		self.$path = arr;
		type !== 1 && C.ready && refresh();
		return self;
	};

//	PPC.attr = SCP.attr = function(name, value) {
	PPC.attr = function(name, value) {
		var el = this.element;
		if (value === undefined) {
			return el.attr(name);
		}
		el.attr(name, value);
		return this;
	};

//	PPC.attrd = SCP.attrd = function(name, value) {
	PPC.attrd = function(name, value) {
		name = 'data-' + name;
		var el = this.element;
		if (value === undefined) {
			return el.attr(name);
		}
		el.attr(name, value);
		return this;
	};

//	PPC.css = SCP.css = function(name, value) {
	PPC.css = function(name, value) {
		var el = this.element;
		if (value === undefined) {
			return el.css(name);
		}
		el.css(name, value);
		return this;
	};

//	PPC.main = SCP.main = function() {
	PPC.main = function() {
		var self = this;
		if (self.$main === undefined) {
			var tmp = self.parent().closest('[data-jc]')[0];
			self.$main = tmp ? tmp.$com : null;
		}
		return self.$main;
	};

	PPC.rcwatch = function(path, value) {
		return value ? this.reconfigure(value) : this;
	};

	PPC.reconfigure = function(value, callback, init) {
		var self = this;
		if (typeof(value) === TYPE_O) {
			Object.keys(value).forEach(function(k) {
				var prev = self.config[k];
				if (!init && self.config[k] !== value[k])
					self.config[k] = value[k];
				if (callback)
					callback(k, value[k], init, init ? undefined : prev);
				else if (self.configure)
					self.configure(k, value[k], init, init ? undefined : prev);
				self.data('config.' + k, value[k]);
			});
		} else if (value.substring(0, 1) === '=') {
			value = value.substring(1);
			if (self.watch) {
				self.$rcwatch && self.unwatch(self.$rcwatch, self.rcwatch);
				self.watch(value, self.rcwatch);
				self.$rcwatch = value;
			}
			self.reconfigure(get(value), callback, init);
		} else {
			value.$config(function(k, v) {
				var prev = self.config[k];
				if (!init && self.config[k] !== v)
					self.config[k] = v;
				self.data('config.' + k, v);
				if (callback)
					callback(k, v, init, init ? undefined : prev);
				else if (self.configure)
					self.configure(k, v, init, init ? undefined : prev);
			});
		}

		var cfg = self.config;

		self.data('config', cfg);

		if (cfg.$type) {
			self.type = cfg.$type;
		}

		if (cfg.$id) {
			self.id = cfg.$id;
		}

		if (cfg.$compile == false) {
			self.nocompile();
		}

		if (cfg.$init) {
			self.$init = cfg.$init;
		}

		cfg.$class && self.tclass(cfg.$class);
		cfg.$released && self.release(cfg.$released == true);
		cfg.$reconfigure && EXEC.call(cfg.$reconfigure, cfg);
		return self;
	};

//	PPC.closest = SCP.closest = function(sel) {
	PPC.closest = function(sel) {
		return this.element.closest(sel);
	};

//	PPC.parent = SCP.parent = function(sel) {
	PPC.parent = function(sel) {
		return this.element.parent(sel);
	};

	var TNB = { number: 1, boolean: 1 };

	PPC.html = function(value) {
		var el = this.element;
		if (value === undefined)
			return el.html();
		if (value instanceof Array)
			value = value.join('');
		var type = typeof(value);
		caches.current.element = el[0];
		var v = (value || TNB[type]) ? el.empty().append(value) : el.empty();
		caches.current.element = null;
		return v;
	};

	PPC.text = function(value) {
		var el = this.element;
		if (value === undefined) {
			return el.text();
		}
		if (value instanceof Array) {
			value = value.join('');
		}
		var type = typeof(value);
		return (value || TNB[type]) ? el.empty().text(value) : el.empty();
	};

	PPC.empty = function() {

		var self = this;

		if (self.$children) {
			for (var i = 0, length = all.length; i < length; i++) { // M.components.length
				var m = all[i]; //M.components[i];
				!m.$removed && m.owner === self && m.remove();
			}
			self.$children = 0;
		}

		var el = self.element;
		el.empty();
		return el;
	};

//	PPC.append = SCP.append = function(value) {
	PPC.append = function(value) {
		var el = this.element;
		if (value instanceof Array)
			value = value.join('');
		caches.current.element = el[0];
		var v = value ? el.append(value) : el;
		caches.current.element = null;
		return v;
	};

//	PPC.event = SCP.event = function() {
	PPC.event = function() {
		var self = this;
		if (self.element)
			self.element.on.apply(self.element, arguments);
		else {
			setTimeout(function(arg) {
				self.event(self, arg);
			}, 500, arguments);
		}
		return self;
	};

//	PPC.find = SCP.find = function(selector) {
	PPC.find =  function(selector) {
		return this.element.find(selector);
	};

	PPC.isInvalid = function() {
		var self = this;
		var is = !self.$valid;
		if (is && !self.$validate)
			is = !self.$dirty;
		return is;
	};

	PPC.unwatch = function(path, fn) {
		var self = this;
		OFF('com' + self._id + '#watch', path, fn);
		return self;
	};

	PPC.watch = function(path, fn, init) {

		var self = this;

		if (langx.isFunction(path)) {
			init = fn;
			fn = path;
			path = self.path;
		} else {
			path = pathmaker(path);
		}

		self.on('watch', path, fn, init);
		return self;
	};

	PPC.invalid = function() {
		return INVALID(this.path, this);
	};

	PPC.valid = function(value, noEmit) {

		var self = this;

		if (value === undefined) {
			return self.$valid;
		}

		if (self.$valid_disabled) {
			return self;
		}

		self.$valid = value;
		self.$validate = false;
		self.$interaction(102);
		clear('valid');
		!noEmit && self.state && self.stateX(1, 1);
		return self;
	};

	PPC.style = function(value) {
		STYLE(value, this._id);
		return this;
	};

	PPC.change = function(value) {
		var self = this;
		self.$dirty_disabled = false;
		self.$dirty = true;
		CHANGE(self.path, value === undefined ? true : value, self);
		return self;
	};

	PPC.used = function() {
		return this.$interaction(100);
	};

	PPC.dirty = function(value, noEmit) {

		var self = this;

		if (value === undefined) {
			return self.$dirty;
		}

		if (self.$dirty_disabled) {　
			return self;
		}

		self.$dirty = value;
		self.$interaction(101);
		clear('dirty');
		!noEmit && self.state && self.stateX(2, 2);
		return self;
	};

	PPC.reset = function() {
		var self = this;
		M.reset(self.path, 0, self);
		return self;
	};

	PPC.setDefault = function(value) {
		this.$default = function() {
			return value;
		};
		return this;
	};

	PPC.default = function(reset) {
		var self = this;
		M.default(self.path, 0, self, reset);
		return self;
	};

	PPC.remove = PPC.kill = function(noClear) {
		var self = this;
		var el = self.element;
		removewaiter(self);
		el.removeData(ATTRDATA);
		el.attr(ATTRDEL, 'true').find(ATTRCOM).attr(ATTRDEL, 'true');
		self.$removed = 1;
		self.removed = true;
		OFF('com' + self._id + '#');
		!noClear && setTimeout2('$cleaner', cleaner2, 100);
		return true;
	};

	PPC.on = function(name, path, fn, init) {
		if (langx.isFunction(path)) {
			init = fn;
			fn = path;
			path = '';
		} else
			path = path.replace('.*', '');

		var self = this;
		var push = '';

		if (name.substring(0, 1) === '^') {
			push = '^';
			name = name.substring(1);
		}

		topic.on(push + 'com' + self._id + '#' + name, path, fn, init, self); // ON
		return self;
	};

	PPC.formatter = function(value, prepend) {
		var self = this;

		if (langx.isFunction(value)) {
			!self.$formatter && (self.$formatter = []);
			if (prepend === true) {
				self.$formatter.unshift(value);
			} else {
				self.$formatter.push(value);
			}
			return self;
		}

		var a = self.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(self, self.path, value, self.type);
			}
		}

		a = M.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(self, self.path, value, self.type);
			}
		}

		return value;
	};

	PPC.parser = function(value, prepend) {

		var self = this;
		var type = typeof(value);

		if (type === 'function') {
			!self.$parser && (self.$parser = []);

			if (prepend === true)
				self.$parser.unshift(value);
			else
				self.$parser.push(value);

			return self;
		}

		if (self.trim && type === 'string') {
			value = value.trim();
		}

		var a = self.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(self, self.path, value, self.type);
			}
		}

		a = jc.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(self, self.path, value, self.type);
			}
		}

		return value;
	};

	PPC.emit = function() {
		topic.emit.apply(M, arguments); // W>EMIT
		return this;
	};

	PPC.evaluate = function(path, expression, nopath) {
		if (!expression) {
			expression = path;
			path = this.path;
		}
		return EVALUATE(path, expression, nopath);
	};

	PPC.get = function(path) {
		var self = this;
		if (!path)
			path = self.path;

		if (self.$pp)
			return self.owner.data(self.path);

		if (path) {
			return paths.get(path);
		}
	};

	PPC.skip = function(path) {
		var self = this;
		skip(path || self.path); // SKIP
		return self;
	};

	PPC.set = function(value, type) {

		var self = this;
		var arg = arguments;

		if (self.$pp) {
			self.owner.set(self.path, value);
			return self;
		}

		// Backwards compatibility
		if (arg.length === 3) {
			paths.immSetx(arg[0], arg[1], arg[2]);
		} else {
			paths.immSetx(self.path, value, type);
		}

		return self;
	};

	PPC.inc = function(value, type) {
		var self = this;
		paths.immInc(self.path, value, type);
		return self;
	};

	PPC.extend = function(value, type) {
		var self = this;
		paths.immExtend(self.path, value, type); // M.extend
		return self;
	};

	PPC.rewrite = function(value) {
		var self = this;
		REWRITE(self.path, value);
		return self;
	};

	PPC.push = function(value, type) {
		var self = this;
		paths.immPush(self.path, value, type);
		return self;
	};


	var $components = registry = {}; //	M.$components = {};

	function register(name, config, declaration, dependencies) { // W.COMPONENT =

		if (langx.isFunction(config)) {
			dependencies = declaration;
			declaration = config;
			config = null;
		}

		// Multiple versions
		if (name.indexOf(',') !== -1) {
			name.split(',').forEach(function(item, index) {
				item = item.trim();
				if (item) {
					register(item, config, declaration, index ? null : dependencies);	
				} 
			});
			return;
		}

		if ($components[name]){ // M.$components
			warn('Components: Overwriting component:', name);	
		} 
		var a = $components[name] = { //M.$components
			name: name, 
			config: config, 
			declaration: declaration, 
			shared: {}, 
			dependencies: dependencies instanceof Array ? dependencies : null 
		};
		topic.emit('component.compile', name, a);
	};

   /**
   * Extend a component by adding new features.
   * @param  {String} name 
   * @param  {String/Object} config A default configuration
   * @param  {Function} declaration 
   */
	function extend(name, config, declaration) { //W.COMPONENT_EXTEND = 

		if (typeof(config) === TYPE_FN) {
			var tmp = declaration;
			declaration = config;
			config = tmp;
		}

		if (extensions[name]) {
			extensions[name].push({ config: config, fn: declaration });
		} else {
			extensions[name] = [{ config: config, fn: declaration }];
		}

		for (var i = 0, length = all.length; i < length; i++) { // M.components.length
			var m = all[i]; // M.components[i];
			if (!m.$removed || name === m.name){
				config && m.reconfigure(config, undefined, true);
				declaration.call(m, m, m.config);
			}
		}

		RECOMPILE();
	};

   /**
   * Sets a default configuration for all components according to the selector
   * @param  {String} selector 
   * @param  {String/Object} config A default configuration
   */
	function configure(selector, config) { //W.COMPONENT_CONFIG = 

		if (langx.isString(selector)) {
			var fn = [];
			selector.split(' ').forEach(function(sel) {
				var prop = '';
				switch (sel.trim().substring(0, 1)) {
					case '*':
						fn.push('com.path.indexOf(\'{0}\')!==-1'.format(sel.substring(1)));
						return;
					case '.':
						// path
						prop = 'path';
						break;
					case '#':
						// id
						prop = 'id';
						break;
					default:
						// name
						prop = '$name';
						break;
				}
				fn.push('com.{0}==\'{1}\''.format(prop, prop === '$name' ? sel : sel.substring(1)));
			});
			selector = FN('com=>' + fn.join('&&'));
		}

		configs.push({ fn: selector, config: config });
	};

	var skips = {};

   /**
   * skips component.setter for future update. It's incremental.
   * @param  {String} pathA Absolute path according to the component "data-jc-path"  
   * @param  {String} pathB Absolute path according to the component "data-jc-path"  
   * @param  {String} pathN Absolute path according to the component "data-jc-path"  
   */
	function skip() { // W.SKIP = 
		for (var j = 0; j < arguments.length; j++) {
			var arr = arguments[j].split(',');
			for (var i = 0, length = arr.length; i < length; i++) {
				var p = arr[i].trim();
				if (skips[p])
					skips[p]++;
				else
					skips[p] = 1;
			}
		}
	};

	langx.mixin(Component,{
		extend : extend,
		configure : configure,
		registry : registry,
		register : register,
		extensions : extensions,
		skip : skip
	});

	return jc.Component = Component;
});
define('skylark-totaljs-jcomponent/paths',[
	"skylark-langx/langx",
	"./jc",
	"./caches",
	"./Component"
],function(langx, jc, caches, Component){

	//get... 

	function get(path, scope) {

		if (path == null) {
			return;
		}

		var code = path.charCodeAt(0);
		if (code === 37)　// % 
			path = 'jctmp.' + path.substring(1);

		var key = '=' + path;
		if (paths[key]) {
			return paths[key](scope || MD.scope);
		}

		if (path.indexOf('?') !== -1) {
			return;
		}

		var arr = parsepath(path);
		var builder = [];

		for (var i = 0, length = arr.length - 1; i < length; i++) {
			var item = arr[i];
			if (item.substring(0, 1) !== '[')
				item = '.' + item;
			builder.push('if(!w' + item + ')return');
		}

		var v = arr[arr.length - 1];
		if (v.substring(0, 1) !== '['){
			v = '.' + v;
		}

		var fn = (new Function('w', builder.join(';') + ';return w' + v));
		paths[key] = fn;
		return fn(scope || MD.scope);
	}

   /**
   * Evaluate String expression as JavaScript code.
   * @param  {String/Object} path Can be object if "path_is_real_value" is "true"
   * @param  {String} expression A condition.
   * @param  {Boolean} path_is_real_value Optional, default: false
   * @returns {Boolean}   
   */
	function evaluate(path, expression, nopath) { //W.EVALUATE = 

		var key = 'eval' + expression;
		var exp = caches.temp[key];
		var val = null;

		if (nopath) {
			val = path;
		} else {
			val = get(path);
		}

		if (exp) {
			return exp.call(val, val, path);
		}

		if (expression.indexOf('return') === -1) {
			expression = 'return ' + expression;
		}

		exp = new Function('value', 'path', expression);
		caches.temp[key] = exp;
		return exp.call(val, val, path);
	}


	var REGWILDCARD = /\.\*/;

	function pathmaker(path, clean) {

		if (!path) {
			return path;
		}

		var tmp = '';

		if (clean) {
			var index = path.indexOf(' ');
			if (index !== -1) {
				tmp = path.substring(index);
				path = path.substring(0, index);
			}
		}

		// temporary
		if (path.charCodeAt(0) === 37)  { // % 
			return 'jctmp.' + path.substring(1) + tmp;
		}
		
		if (path.charCodeAt(0) === 64) { // @
			// parent component.data()
			return path;
		}

		var index = path.indexOf('/');

		if (index === -1) {
			return path + tmp;
		}

		var p = path.substring(0, index);
		var rem = plugins.find(p); //W.PLUGINS[p];
		return ((rem ? ('PLUGINS.' + p) : (p + '_plugin_not_found')) + '.' + path.substring(index + 1)) + tmp;
	}

	function pathmakerw(path) {
		return pathmaker(path.replace(REGWILDCARD, ''));
	}
 
	function bind(path) { // W.BIND = 
		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++) {
				bind(path[i]);
			}
			return this; // 
		}
		path = pathmaker(path);
		if (!path) {
			return this;
		}
		var is = path.charCodeAt(0) === 33; // !
		if (is) {
			path = path.substring(1);
		}
		path = path.replace(REGWILDCARD, '');
		path && set(path, get(path), true);
	}

	
	// paths -> view model

	var REGPARAMS = /\{{1,2}[a-z0-9_.-\s]+\}{1,2}/gi;

	var skipproxy = ''
	var proxy = {};

	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================

	var MULTIPLE = ' + ';
	var REGISARR = /\[\d+\]$/;

	var paths = {}; // saved paths from get() and set()

	var binders = {};
	var bindersnew = [];

	function binderbind(path, absolutePath, ticks) {
		var arr = binders[path];
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if (item.ticks !== ticks) {
				item.ticks = ticks;
				item.exec(getx(item.path), absolutePath);  //GET
			}
		}
	}

	var $rebinder;

	function rebindbinder() {
		$rebinder && clearTimeout($rebinder);
		$rebinder = setTimeout(function() {
			var arr = bindersnew.splice(0);
			for (var i = 0; i < arr.length; i++) {
				var item = arr[i];
				if (!item.init) {
					if (item.com) {
						item.exec(item.com.data(item.path), item.path);
					} else {
						item.exec(getx(item.path), item.path);  // GET
					}
				}
			}
		}, 50);
	}

	var watches = [];

	function unwatch(path, fn) { //W.UNWATCH 

		if (path.indexOf(MULTIPLE) !== -1) {
			var arr = path.split(MULTIPLE).trim();
			for (var i = 0; i < arr.length; i++)
				unwatch(arr[i], fn);
			return this; //W;
		}

		return topic.off('watch', path, fn); //OFF
	};

	function watch(path, fn, init) { // W.WATCH

		if (path.indexOf(MULTIPLE) !== -1) {
			var arr = path.split(MULTIPLE).trim();
			for (var i = 0; i < arr.length; i++)
				watch(arr[i], fn, init);
			return this; //W;
		}

		if (langx.isFunction(path)) { //if (typeof(path) === TYPE_FN) {
			init = fn;
			fn = path;
			path = '*';
		}

		var push = '';

		if (path.substring(0, 1) === '^') {
			path = path.substring(1);
			push = '^';
		}

		path = pathmaker(path, true);
		topic.on(push + 'watch', path, fn, init);  // ON
		return this; //W;
	}

	function remap(path, value) {

		var index = path.replace('-->', '->').indexOf('->');

		if (index !== -1) {
			value = value[path.substring(0, index).trim()];
			path = path.substring(index + 3).trim();
		}

		immSetx(path, value);
	}

	function emitwatch(path, value, type) {
		for (var i = 0, length = watches.length; i < length; i++) {
			var self = watches[i];
			if (self.path === '*') {
				self.fn.call(self.context, path, self.format ? self.format(value, path, type) : value, type);
			} else if (path.length > self.path.length) {
				var index = path.lastIndexOf('.', self.path.length);
				if (index === -1 ? false : self.path === path.substring(0, index)) {
					var val = getx(self.path); // GET
					self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
				}
			} else {
				for (var j = 0, jl = self.$path.length; j < jl; j++) {
					if (self.$path[j] === path) {
						var val = get2(self.path);
						self.fn.call(self.context, path, self.format ? self.format(val, path, type) : val, type);
						break;
					}
				}
			}
		}
	}



	Array.prototype.findValue = function(cb, value, path, def, cache) {

		if (langx.isFunction(cb)) {
			def = path;
			path = value;
			value = undefined;
			cache = false;
		}

		var key, val = def;

		if (cache) {
			key = 'fv_' + cb + '=' + value;
			if (caches.temp[key]) {
				return caches.temp[key];
			}
		}

		var index = this.findIndex(cb, value);
		if (index !== -1) {
			var item = this[index];
			if (path.indexOf('.') === -1) {
				item = item[path];
			} else {
				item = get(path, item);
			}
			cache && (caches.temp[key] = val);
			val = item == null ? def : item;
		}

		return val;
	};

	String.prototype.params = String.prototype.arg = function(obj) {
		return this.replace(REGPARAMS, function(text) {
			// Is double?
			var l = text.charCodeAt(1) === 123 ? 2 : 1;
			var val = get(text.substring(l, text.length - l).trim(), obj);
			return val == null ? text : val;
		});
	};

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


	// set...
	function set(path, value, is) {

		if (path == null) {
			return;
		}

		var key = '+' + path;

		if (paths[key]) {
			return paths[key](MD.scope, value, path, binders, binderbind, is);
		}

		if (path.indexOf('?') !== -1) {
			path = '';
			return;
		}

		var arr = parsepath(path);
		var builder = [];
		var binder = [];

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			var type = arr[i + 1] ? (REGISARR.test(arr[i + 1]) ? '[]' : '{}') : '{}';
			var p = 'w' + (item.substring(0, 1) === '[' ? '' : '.') + item;
			builder.push('if(typeof(' + p + ')!==\'object\'||' + p + '==null)' + p + '=' + type);
		}

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			binder.push('binders[\'' + item + '\']&&binderbind(\'' + item + '\',\'' + path + '\',$ticks)');
		}

		var v = arr[arr.length - 1];
		binder.push('binders[\'' + v + '\']&&binderbind(\'' + v + '\',\'' + path + '\',$ticks)');
		binder.push('binders[\'!' + v + '\']&&binderbind(\'!' + v + '\',\'' + path + '\',$ticks)');

		if (v.substring(0, 1) !== '['){
			v = '.' + v;
		}

		var fn = (new Function('w', 'a', 'b', 'binders', 'binderbind', 'nobind', 'var $ticks=Math.random().toString().substring(2,8);if(!nobind){' + builder.join(';') + ';var v=typeof(a)==\'function\'?a(MAIN.compiler.get(b)):a;w' + v + '=v}' + binder.join(';') + ';return a'));
		paths[key] = fn;
		fn(MD.scope, value, path, binders, binderbind, is);
		return C;
	}

	function set2(scope, path, value) {

		if (path == null) {
			return;
		}

		var key = '++' + path;

		if (paths[key]) {
			return paths[key](scope, value, path);
		}

		var arr = parsepath(path);
		var builder = [];

		for (var i = 0; i < arr.length - 1; i++) {
			var item = arr[i];
			var type = arr[i + 1] ? (REGISARR.test(arr[i + 1]) ? '[]' : '{}') : '{}';
			var p = 'w' + (item.substring(0, 1) === '[' ? '' : '.') + item;
			builder.push('if(typeof(' + p + ')!==\'object\'||' + p + '==null)' + p + '=' + type);
		}

		var v = arr[arr.length - 1];

		if (v.substring(0, 1) !== '[')
			v = '.' + v;

		var fn = (new Function('w', 'a', 'b', builder.join(';') + ';w' + v + '=a;return a'));
		paths[key] = fn;
		fn(scope, value, path);
		return scope;
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

	//cache
	function cache(path, expire, rebind) { // W.CACHEPATH = 
		var key = '$jcpath';
		WATCH(path, function(p, value) {
			var obj = storages.get(key); // cachestorage(key);
			if (obj) {
				obj[path] = value;
			}else {
				obj = {};
				obj[path] = value;
			}
			storages.put(key, obj, expire); // cachestorage(key, obj, expire);
		});

		if (rebind === undefined || rebind) {
			var cache = storages.get(key); // cachestorage(key);
			if (cache && cache[path] !== undefined && cache[path] !== get(path)){
				immSetx(path, cache[path], true);	
			} 
		}
		return this; //W 
	};


	function parsepath(path) {

		var arr = path.split('.');
		var builder = [];
		var all = [];

		for (var i = 0; i < arr.length; i++) {
			var p = arr[i];
			var index = p.indexOf('[');
			if (index === -1) {
				if (p.indexOf('-') === -1) {
					all.push(p);
					builder.push(all.join('.'));
				} else {
					var a = all.splice(all.length - 1);
					all.push(a + '[\'' + p + '\']');
					builder.push(all.join('.'));
				}
			} else {
				if (p.indexOf('-') === -1) {
					all.push(p.substring(0, index));
					builder.push(all.join('.'));
					all.splice(all.length - 1);
					all.push(p);
					builder.push(all.join('.'));
				} else {
					all.push('[\'' + p.substring(0, index) + '\']');
					builder.push(all.join(''));
					all.push(p.substring(index));
					builder.push(all.join(''));
				}
			}
		}

		return builder;
	}
	
   /**
   * Creates a watcher for all changes.
   * @param  {String} path 
   */
	function create(path) { //W.CREATE

		var is = false;
		var callback;

		if (typeof(path) === TYPE_S) {
			if (proxy[path])
				return proxy[path];
			is = true;
			callback = function(key) {

				var p = path + (key ? '.' + key : '');
				if (M.skipproxy === p) {
					M.skipproxy = '';
					return;
				}
				setTimeout(function() {
					if (M.skipproxy === p)
						M.skipproxy = '';
					else {
						notify(p);  // NOTIFY
						reset(p);   // REEST
					}
				}, MD.delaybinder);
			};

		} else
			callback = path;

		var blocked = false;
		var obj = path ? (get2(path) || {}) : {};
		var handler = {
			get: function(target, property, receiver) {
				try {
					return new Proxy(target[property], handler);
				} catch (err) {
					return Reflect.get(target, property, receiver);
				}
			},
			defineProperty: function(target, property, descriptor) {
				!blocked && callback(property, descriptor);
				return Reflect.defineProperty(target, property, descriptor);
			},
			deleteProperty: function(target, property) {
				!blocked && callback(property);
				return Reflect.deleteProperty(target, property);
			},
			apply: function(target, thisArg, argumentsList) {
				if (BLACKLIST[target.name]) {
					blocked = true;
					var result = Reflect.apply(target, thisArg, argumentsList);
					callback('', argumentsList[0]);
					blocked = false;
					return result;
				}
				return Reflect.apply(target, thisArg, argumentsList);
			}
		};

		var o = new Proxy(obj, handler);

		if (is) {
			M.skipproxy = path;
			getx(path) == null && setx(path, obj, true);  // GET SET
			return proxy[path] = o;
		} else
			return o;
	};

   /**
   * Creates an object on the path and notifies all components
   * @param  {String} path 
   * @param  {Function} fn 
   * @param  {Boolean} update Optional Optional, default "true"
   */
	function make(obj, fn, update) { // W.MAKE

		switch (typeof(obj)) {
			case 'function':
				fn = obj;
				obj = {};
				break;
			case 'string':
				var p = obj;
				var is = true;
				obj = get(p);
				if (obj == null) {
					is = false;
					obj = {};
				}
				fn.call(obj, obj, p, function(path, value) {
					setx(obj, path, value);
				});
				if (is && (update === undefined || update === true))
					immUpdate(p, true);
				else {
					if (C.ready)
						$set(p, obj);
					else
						immSetx(p, obj, true);
				}
				return obj;
		}

		fn.call(obj, obj, '');
		return obj;
	};

  /**
   * Notifies a setter in all components on the path.
   * @param  {String} path 
   */
	function notify() { // W.NOTIFY

		var arg = arguments;
		var all = M.components.all;//M.components;

		var $ticks = Math.random().toString().substring(2, 8);
		for (var j = 0; j < arg.length; j++) {
			var p = arg[j];
			binders[p] && binderbind(p, p, $ticks);
		}

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path)
				continue;

			var is = 0;
			for (var j = 0; j < arg.length; j++) {
				if (com.path === arg[j]) {
					is = 1;
					break;
				}
			}

			if (is) {
				var val = com.get();
				com.setter && com.setterX(val, com.path, 1);
				com.state && com.stateX(1, 6);
				com.$interaction(1);
			}
		}

		for (var j = 0; j < arg.length; j++) {
			emitwatch(arg[j], getx(arg[j]), 1);  // GET
		}

		return this;  // W
	};

	function validate(path, except) { //W.VALIDATE =

		var arr = [];
		var valid = true;

		path = pathmakerw(path); //pathmaker(path.replace(REGWILDCARD, ''));

		var flags = null;
		if (except) {
			var is = false;
			flags = {};
			except = except.remove(function(item) {
				if (item.substring(0, 1) === '@') {
					flags[item.substring(1)] = true;
					is = true;
					return true;
				}
				return false;
			});
			!is && (flags = null);
			!except.length && (except = null);
		}

		var all = M.components.all;//M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];
			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			com.state && arr.push(com);

			if (com.$valid_disabled)
				continue;

			com.$validate = true;
			if (com.validate) {
				com.$valid = com.validate(get(com.path));
				com.$interaction(102);
				if (!com.$valid)
					valid = false;
			}
		}

		clear('valid');
		state(arr, 1, 1);
		return valid;
	}

   /**
   * Sets default values for all declared components listen on the path.
   * All components need to have declared data-jc-value="VALUE" attribute. 
   * @param  {String} path 
   * @param  {Number} delay Optional, default: 0 
   * @param  {Boolean} reset Optional, default: true
   */
	function defaultValue(path, timeout, reset) { //W.DEFAULT = 
		var arr = path.split(REGMETA);
		if (arr.length > 1) {
			var def = arr[1];
			path = arr[0];
			var index = path.indexOf('.*');
			if (index !== -1)　{
				path = path.substring(0, index);
			}
			SET(path, new Function('return ' + def)(), timeout > 10 ? timeout : 3, timeout > 10 ? 3 : null);
		}
		return M.default(arr[0], timeout, null, reset);
	}


	var nmCache = {};  // notmodified cache 

   /**
   * Checks whether the value has not been modified on the path.
   * @param  {String} path 
   * @param {Object} value  Optional
   * @param {Array<String>} fields  Optional, field names
   * @returns {Booean}   
   */
	function notmodified(path, value, fields) { // W.NOTMODIFIED = 

		if (value === undefined) {
			value = get(path);
		}

		if (value === undefined) {
			value = null;
		}

		if (fields) {
			path = path.concat('#', fields);
		}

		var s = langx.stringify(value, false, fields); // STRINGIFY
		var hash = langx.hashCode(s); // HASH
		var key =  path; // 'notmodified.' + path

		if (nmCache[key] === hash) { // cache
			return true;
		}

		nmCache[key] = hash; //cache 
		return false;
	};



	function rewrite(path, value, type) { // W.REWRITE = 
		path = pathmaker(path);
		if (path) {
			M.skipproxy = path;
			set(path, value);
			emitwatch(path, value, type);
		}
		return this; // W
	}


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

	// inc.. 
	function immInc(path, value, type) {  // M.inc

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++)
				immInc(path[i], value, type);
			return this; // M
		}

		path = pathmaker(path);

		if (!path)
			return this; // M

		var current = get(path);
		if (!current) {
			current = 0;
		} else if (typeof(current) !== TYPE_N) {
			current = parseFloat(current);
			if (isNaN(current))
				current = 0;
		}

		current += value;
		immSetx(path, current, type);
		return this; // M
	}

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
	};

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
	};

	// extend...
	function immExtend(path, value, type) { // M.extend
		path = pathmaker(path);
		if (path) {
			var val = get(path);
			if (val == null)
				val = {};
			immSetx(path, $.extend(val, value), type);
		}
		return this; // M
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
	};

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
	};

	function immPush(path, value, type) { // M.push

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++) {
				immPush(path[i], value, type);
			}
			return this; // M
		}

		var arr = get(path);
		var n = false;

		if (!(arr instanceof Array)) {
			arr = [];
			n = true;
		}

		var is = true;
		M.skipproxy = path;

		if (value instanceof Array) {
			if (value.length)
				arr.push.apply(arr, value);
			else {
				is = false;
			}
		} else {
			arr.push(value);
		}

		if (n) {
			immSetx(path, arr, type);
		} else if (is) {
			immUpdate(path, undefined, type);
		}

		return this; // M
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

	// 1 === manually
	// 2 === by input
	function immUpdate(path, reset, type, wasset) { // M.update = 

		if (path instanceof Array) {
			for (var i = 0; i < path.length; i++)
				immUpdate(path[i], reset, type);
			return M;
		}

		path = pathmaker(path);
		if (!path)
			return M;

		var is = path.charCodeAt(0) === 33;
		if (is)
			path = path.substring(1);

		path = path.replace(REGWILDCARD, '');
		if (!path)
			return M;

		!wasset && $set(path, $get(path), true);

		var state = [];

		if (type === undefined) {
			type = 1; // manually
		}

		M.skipproxy = path;

		var all = M.components.all;//M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.disabled || com.$removed || !com.$loaded || !com.path || !com.$compare(path))
				continue;

			var result = com.get();
			if (com.setter) {
				com.$skip = false;
				com.setterX(result, path, type);
				com.$interaction(type);
			}

			if (!com.$ready)
				com.$ready = true;

			if (reset === true) {

				if (!com.$dirty_disabled) {
					com.$dirty = true;
					com.$interaction(101);
				}

				if (!com.$valid_disabled) {
					com.$valid = true;
					com.$validate = false;
					if (com.validate) {
						com.$valid = com.validate(result);
						com.$interaction(102);
					}
				}

				findcontrol2(com);

			} else if (com.validate && !com.$valid_disabled)
				com.valid(com.validate(result), true);

			com.state && state.push(com);
		}

		reset && clear('dirty', 'valid');

		for (var i = 0, length = state.length; i < length; i++)
			state[i].stateX(1, 4);

		emitwatch(path, get(path), type);
		return M;
	}


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

	// ===============================================================
	// MAIN FUNCTIONS
	// ===============================================================

   /**
   * Evaluates a global parser.
   * @param  {String} path 
   * @param  {Object} value
   * @param  {String} type 
   * @returns {Boolean}   
   * OR
   * Registers a global parser.
   * @param  {Function} value 
   */
	function parser(value, path, type) { //W.PARSER = M.parser =  

		if (langx.isFunction(value)) {
			!jc.$parser && (jc.$parser = []);

			// Prepend
			if (path === true) {
				jc.$parser.unshift(value);
			} else {
				jc.$parser.push(value);
			}

			return this;
		}

		var a = jc.$parser;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				value = a[i].call(M, path, value, type);
			}
		}

		return value;
	};


	jc.$parser.push(function(path, value, type) {

		switch (type) {
			case 'number':
			case 'currency':
			case 'float':
				var v = +(langx.isString(value) ? value.replace(REGEMPTY, '').replace(REGCOMMA, '.') : value);
				return isNaN(v) ? null : v;

			case 'date':
			case 'datetime':

				if (!value) {
					return null;
				}

				if (value instanceof Date) {
					return value;
				}

				value = value.parseDate();
				return value && value.getTime() ? value : null;
		}

		return value;
	});


	setInterval(function() {
//		temp = {};
		paths = {};
//		cleaner();
	}, (1000 * 60) * 5);	

	return jc.paths = {
		Scope,
		unwatch : unwatch,
		watch : watch,

		get,
		getx,
		getr,

		set,
		set2,
		immSetx,
		setx,
		setx2,
		setr,

		toggle,
		toogle2,

		cache,

		immInc,
		inc,
		inc2,

		immExtend,
		extend,
		extend2,

		immPush,
		push,
		push2,

		immUpdate,
		update,
		update2,

		bind,
		create,
		defaultValue,
		errors,
		make,
		evaluate,
		make,
		modified,
//		notmodified,
		pathmaker,
		rewrite,
		validate
	};
});
define('skylark-totaljs-jcomponent/views',[
	"./jc",
	"./langx",
	"./Usage",
	"./caches",
	"./Component"
],function(jc,langx,Usage, caches,Component){
	var M = jc;

	var components = Component.components = [];
	var versions = {};

	var clear = caches.clear;

   /**
   * sets a version for specific components.
   */
	function version() { //W.VERSION = 
		for (var j = 0; j < arguments.length; j++) {
			var keys = arguments[j].split(',');
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i].trim();
				var tmp = key.indexOf('@');
				if (tmp === -1) {
					continue;
				}
				var version = key.substring(tmp + 1);
				key = key.substring(0, tmp);
				version && key && (versions[key] = version);
			}
		}
	};


	$.fn.FIND = function(selector, many, callback, timeout) {

		if (typeof(many) === TYPE_FN) {
			timeout = callback;
			callback = many;
			many = undefined;
		}

		var self = this;
		var output = findcomponent(self, selector);
		if (typeof(callback) === TYPE_FN) {

			if (output.length) {
				callback.call(output, output);
				return self;
			}

			WAIT(function() {
				var val = self.FIND(selector, many);
				return val instanceof Array ? val.length > 0 : !!val;
			}, function(err) {
				// timeout
				if (!err) {
					var val = self.FIND(selector, many);
					callback.call(val ? val : W, val);
				}
			}, 500, timeout);

			return self;
		}

		return many ? output : output[0];
	};

	$.fn.SETTER = function(selector, name) {

		var self = this;
		var arg = [];
		var beg = selector === true ? 3 : 2;

		for (var i = beg; i < arguments.length; i++)
			arg.push(arguments[i]);

		if (beg === 3) {
			selector = name;
			name = arguments[2];

			if (lazycom[selector] && lazycom[selector].state !== 3) {

				if (lazycom[selector].state === 1) {
					lazycom[selector].state = 2;
					EMIT('lazy', selector, true);
					warn('Lazy load: ' + selector);
					compile();
				}

				setTimeout(function(arg) {
					$.fn.SETTER.apply(self, arg);
				}, 555, arguments);

				return self;
			}

			self.FIND(selector, true, function(arr) {
				for (var i = 0, length = arr.length; i < length; i++) {
					var o = arr[i];
					if (typeof(o[name]) === TYPE_FN)
						o[name].apply(o, arg);
					else
						o[name] = arg[0];
				}
			});

		} else {

			if (lazycom[selector] && lazycom[selector].state !== 3) {

				if (lazycom[selector].state === 1) {
					lazycom[selector].state = 2;
					EMIT('lazy', selector, true);
					warn('Lazy load: ' + selector);
					compile();
				}

				setTimeout(function(arg) {
					$.fn.SETTER.apply(self, arg);
				}, 555, arguments);

				return self;
			}

			var arr = self.FIND(selector, true);
			for (var i = 0, length = arr.length; i < length; i++) {
				var o = arr[i];
				if (typeof(o[name]) === TYPE_FN)
					o[name].apply(o, arg);
				else
					o[name] = arg[0];
			}
		}

		return self;
	};

	$.fn.RECONFIGURE = function(selector, value) {
		return this.SETTER(selector, 'reconfigure', value);
	};


	M.$formatter = [];


   /**
   * Evaluates a global formatter.
   * @param  {String} path 
   * @param  {Object} value
   * @param  {String} type 
   * @returns {Boolean}   
   * OR
   * Registers a global formatter.
   * @param  {Function} value 
   * @param  {Boolean} path 
   */
	W.FORMATTER = M.formatter = function(value, path, type) {

		if (langx.isFunction(value)) {
			!M.$formatter && (M.$formatter = []);

			// Prepend
			if (path === true) {
				M.$formatter.unshift(value);
			} else {
				M.$formatter.push(value);
			}

			return M;
		}

		var a = M.$formatter;
		if (a && a.length) {
			for (var i = 0, length = a.length; i < length; i++) {
				var val = a[i].call(M, path, value, type);
				if (val !== undefined)
					value = val;
			}
		}

		return value;
	};


   /**
   * Reconfigures all components according to the selector.
   * @param  {String} selector 
   * @param  {String/Object} config A default configuration
   */
	W.RECONFIGURE = function(selector, value) {
		SETTER(true, selector, 'reconfigure', value);
		return RECONFIGURE;
	};

   /**
   * Set a new value to the specific method in components.
   * @param  {Boolean} wait Optional, can it wait for non-exist components? 
   * @param  {String} selector  
   * @param  {String} name Property or Method name (can't be nested) 
   * @param  {Object} argA Optional, additional argument
   * @param  {Object} argB Optional, additional argument
   * @param  {Object} argN Optional, additional argument
   */
	function setter(selector, name) { // W.SETTER

		var arg = [];
		var beg = selector === true ? 3 : 2;

		for (var i = beg; i < arguments.length; i++) {
			arg.push(arguments[i]);
		}

		if (beg === 3) {

			selector = name;

			if (lazycom[selector] && lazycom[selector].state !== 3) {

				if (lazycom[selector].state === 1) {
					lazycom[selector].state = 2;
					EMIT('lazy', selector, true);
					warn('Lazy load: ' + selector);
					compile();
				}

				setTimeout(function(arg) {
					arg[0] = true;
					W.SETTER.apply(W, arg);
				}, 555, arguments);

				return SETTER;
			}

			name = arguments[2];

			FIND(selector, true, function(arr) {
				for (var i = 0, length = arr.length; i < length; i++) {
					var o = arr[i];
					if (typeof(o[name]) === TYPE_FN)
						o[name].apply(o, arg);
					else
						o[name] = arg[0];
				}
			});
		} else {

			if (lazycom[selector] && lazycom[selector].state !== 3) {

				if (lazycom[selector].state === 1) {
					lazycom[selector].state = 2;
					EMIT('lazy', selector, true);
					warn('Lazy load: ' + selector);
					compile();
				}

				setTimeout(function(arg) {
					W.SETTER.apply(W, arg);
				}, 555, arguments);

				return SETTER;
			}

			var arr = FIND(selector, true);
			for (var i = 0, length = arr.length; i < length; i++) {
				var o = arr[i];
				if (typeof(o[name]) === TYPE_FN)
					o[name].apply(o, arg);
				else
					o[name] = arg[0];
			}
		}

		return SETTER;
	};




//	var components = {};

//	M.$components = {};
//	M.components = [];


	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================

	var ATTRCOM = '[data-jc]';

	function exechelper(ctx, path, arg) {
		setTimeout(function() {
			EXEC.call(ctx, true, path, arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6]);
		}, 200);
	}

	function com_dirty(path, value, onlyComponent, skipEmitState) {

		var isExcept = value instanceof Array;
		var key = 'dirty' + path + (isExcept ? '>' + value.join('|') : '');
		var except = null;

		if (isExcept) {
			except = value;
			value = undefined;
		}

		if (typeof(value) !== 'boolean' && cache[key] !== undefined)
			return cache[key];

		var dirty = true;
		var arr = value !== undefined ? [] : null;
		var flags = null;

		if (isExcept) {
			var is = false;
			flags = {};
			except = except.remove(function(item) {
				if (item.substring(0, 1) === '@') {
					flags[item.substring(1)] = true;
					is = true;
					return true;
				}
				return false;
			});
			!is && (flags = null);
			isExcept = except.length > 0;
		}

		var index = path.lastIndexOf('.*');
		var wildcard = index !== -1;
		if (index !== -1)
			path = path.substring(0, index);

		path = pathmaker(path);

		var all = components;//M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.$removed || !com.$loaded || !com.path || !com.$compare(path) || (isExcept && com.$except(except)))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			if (com.disabled || com.$dirty_disabled) {
				arr && com.state && arr.push(com);
				continue;
			}

			if (value === undefined) {
				if (com.$dirty === false)
					dirty = false;
				continue;
			}

			com.state && arr.push(com);

			if (!onlyComponent) {
				if (wildcard || com.path === path) {
					com.$dirty = value;
					com.$interaction(101);
				}
			} else if (onlyComponent._id === com._id) {
				com.$dirty = value;
				com.$interaction(101);
			}
			if (com.$dirty === false)
				dirty = false;
		}

		clear('dirty');
		cache[key] = dirty;

		// For double hitting component.state() --> look into COM.invalid()
		!skipEmitState && state(arr, 1, 2);
		return dirty;
	}

   /**
   * Reads a state, it works with dirty state.
   * @param  {String} path 
   * @return {Boolean} 
   */
	function changed(path) {
		return !com_dirty(path);
	};


   /**
   * Set a change for the path or can read the state, it works with dirty state.
   * @param  {String} path 
   * @param  {Boolean} value Optional
   * @return {Boolean} 
   */
	function change(path, value) {
		if (value == null)
			value = true;
		return !com_dirty(path, !value);
	};


	/*
	 * This method is same like EXEC() method but it returns a function.
	 * It must be used as a callback. All callback arguments will be used for the targeted method.
	 */
	function exec2(path, tmp) { //W.EXEC2 = 
		var is = path === true;
		return function(a, b, c, d) {
			if (is)
				EXEC(tmp, path, a, b, c, d);
			else
				EXEC(path, a, b, c, d);
		};
	};

  /**
   * Executes a method according to the path. It wont't throw any exception if the method not exist.
   * @param  {Boolean} wait Optional enables a waiter for the method instance (if method doesn't exist) 
   * @param  {String} path 
   * @param  {Object} a - Optional, additional argument
   * @param  {Object} b - Optional, additional argument
   * @param  {Object} c - Optional, additional argument
   */
	function exec(path) {   // W.EXEC = 

		var arg = [];
		var f = 1;
		var wait = false;
		var p;
		var ctx = this;

		if (path === true) {
			wait = true;
			path = arguments[1];
			f = 2;
		}

		path = path.env();

		for (var i = f; i < arguments.length; i++) {
			arg.push(arguments[i]);
		}

		var c = path.charCodeAt(0);

		// Event
		if (c === 35) { // # , ex: EXEC('#submit', true); --> EMIT('submit', true);
			p = path.substring(1);
			if (wait) {
				!events[p] && exechelper(ctx, path, arg);
			} else {
				EMIT.call(ctx, p, arg[0], arg[1], arg[2], arg[3], arg[4]);
			}
			return EXEC;
		}

		var ok = 0;

		// PLUGINS
		if (c === 64) { // @ , ex: EXEC('@PLUGIN.method_name');
			var index = path.indexOf('.');
			p = path.substring(1, index);
			var ctrl = plugins.find(p); //W.PLUGINS[p];
			if (ctrl) {
				var fn = ctrl[path.substring(index + 1)];
				if (langx.isFunction(fn) ) { // if (typeof(fn) === TYPE_FN) {
					fn.apply(ctx === Window ? ctrl : ctx, arg);
					ok = 1;
				}
			}

			if (wait && !ok) {
			 exechelper(ctx, path, arg);
			}
			return EXEC;
		}

		// PLUGINS
		var index = path.indexOf('/'); // ex : EXEC('PLUGIN/method_name');
		if (index !== -1) {
			p = path.substring(0, index);
			var ctrl = plugins.find(p); //W.PLUGINS[p];
			var fn = path.substring(index + 1);
			if (ctrl && typeof(ctrl[fn]) === TYPE_FN) {
				ctrl[fn].apply(ctx === W ? ctrl : ctx, arg);
				ok = 1;
			}

			if (wait && !ok) {
			 exechelper(ctx, path, arg);
			}
			return EXEC;
		}

		var fn = paths.get(path);

		if (langx.isFunction(fn)) {
			fn.apply(ctx, arg);
			ok = 1;
		}

		wait && !ok && exechelper(ctx, path, arg);
		return EXEC;
	};


	function findinstance(t, type) {

		if (!t.length) {
			return null;
		}

		for (var i = 0; i < t.length; i++) {
			if (t[i][type]) {
				return t[i][type];
			}
		}

		var el = t[0].parentElement;
		while (el !== null) {
			if (el[type]) {
				return el[type];
			}
			el = el.parentElement;
		}

		return null;
	}

	function findcomponent(container, selector, callback) {

		var s = (selector ? selector.split(' ') : EMPTYARRAY);
		var path = '';
		var name = '';
		var id = '';
		var version = '';
		var index;

		for (var i = 0, length = s.length; i < length; i++) {
			switch (s[i].substring(0, 1)) {
				case '*':
					break;
				case '.':
					// path
					path = s[i].substring(1);
					break;
				case '#':
					// id;
					id = s[i].substring(1);
					index = id.indexOf('[');
					if (index !== -1) {
						path = id.substring(index + 1, id.length - 1).trim();
						id = id.substring(0, index);
					}
					break;
				default:
					// name
					name = s[i];
					index = name.indexOf('[');

					if (index !== -1) {
						path = name.substring(index + 1, name.length - 1).trim();
						name = name.substring(0, index);
					}

					index = name.lastIndexOf('@');

					if (index !== -1) {
						version = name.substring(index + 1);
						name = name.substring(0, index);
					}

					break;
			}
		}

		var arr = callback ? undefined : [];
		if (container) {
			var stop = false;
			container.find('[data-jc]').each(function() {
				var com = this.$com;

				if (stop || !com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.$version !== version) || (path && (com.$pp || (com.path !== path && (!com.pathscope || ((com.pathscope + '.' + path) !== com.path))))))
					return;

				if (callback) {
					if (callback(com) === false)
						stop = true;
				} else
					arr.push(com);
			});
		} else {
			for (var i = 0, length = components.length; i < length; i++) { // M.components.length
				var com = components[i]; // M.components[i]
				if (!com || !com.$loaded || com.$removed || (id && com.id !== id) || (name && com.$name !== name) || (version && com.$version !== version) || ((path && (com.$pp || (com.path !== path && (!com.pathscope || ((com.pathscope + '.' + path) !== com.path)))))))
					continue;

				if (callback) {
					if (callback(com) === false) {
						break;
					}
				} else {
					arr.push(com);
				}
			}
		}

		return arr;
	}

	function findcontrol2(com, input) {

		if (com.$inputcontrol) {
			if (com.$inputcontrol % 2 !== 0) {
				com.$inputcontrol++;
				return;
			}
		}

		var target = input ? input : com.element;
		findcontrol(target[0], function(el) {
			if (!el.$com || el.$com !== com) {
				el.$com = com;
				com.$inputcontrol = 1;
			}
		});
	}

	function findcontrol(container, onElement, level) {

		var arr = container.childNodes;
		var sub = [];

		ACTRLS[container.tagName] && onElement(container);

		if (level == null) {
			level = 0;
		} else {
			level++;
		}

		for (var i = 0, length = arr.length; i < length; i++) {
			var el = arr[i];
			if (el && el.tagName) {
				el.childNodes.length && el.tagName !== 'SCRIPT' && el.getAttribute('data-jc') == null && sub.push(el);
				if (ACTRLS[el.tagName] && el.getAttribute('data-jc-bind') != null && onElement(el) === false)
					return;
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			if (el && findcontrol(el, onElement, level) === false)
				return;
		}
	}

	function com_valid(path, value, onlyComponent) {

		var isExcept = value instanceof Array;
		var key = 'valid' + path + (isExcept ? '>' + value.join('|') : '');
		var except = null;

		if (isExcept) {
			except = value;
			value = undefined;
		}

		if (typeof(value) !== 'boolean' && cache[key] !== undefined)
			return cache[key];

		var flags = null;

		if (isExcept) {
			var is = false;
			flags = {};
			except = except.remove(function(item) {
				if (item.substring(0, 1) === '@') {
					flags[item.substring(1)] = true;
					is = true;
					return true;
				}
				return false;
			});
			!is && (flags = null);
			isExcept = except.length > 0;
		}

		var valid = true;
		var arr = value !== undefined ? [] : null;

		var index = path.lastIndexOf('.*');
		var wildcard = index !== -1;
		if (index !== -1) {
			path = path.substring(0, index);
		}

		path = pathmaker(path);

		var all = components;//M.components;
		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.$removed || !com.$loaded || !com.path || !com.$compare(path) || (isExcept && com.$except(except)))
				continue;

			if (flags && ((flags.visible && !com.visible()) || (flags.hidden && !com.hidden()) || (flags.enabled && com.find(SELINPUT).is(':disabled')) || (flags.disabled && com.find(SELINPUT).is(':enabled'))))
				continue;

			if (com.disabled || com.$valid_disabled) {
				arr && com.state && arr.push(com);
				continue;
			}

			if (value === undefined) {
				if (com.$valid === false)
					valid = false;
				continue;
			}

			com.state && arr.push(com);

			if (!onlyComponent) {
				if (wildcard || com.path === path) {
					com.$valid = value;
					com.$interaction(102);
				}
			} else if (onlyComponent._id === com._id) {
				com.$valid = value;
				com.$interaction(102);
			}
			if (com.$valid === false)
				valid = false;
		}

		caches.clear('valid');
		caches.put(key, valid);  // cache[key] = valid
		langx.state(arr, 1, 1);
		return valid;
	}


   /**
   * Checks dirty and valid paths for all declared components on the path. 
   * If the method return true then the components are validated and 
   * some component has been changed by user (otherwise: false).
   * @param  {String} path 
   * @param  {String|Array} except  With absolute paths for skipping
   * @returns {Boolean}   
   */
	function can(path, except) { // W.CAN = 
		path = pathmaker(path);
		return !com_dirty(path, except) && com_valid(path, except);
	}

   /**
   * Checks dirty and valid paths for all declared components on the path. 
   * If the method return false then the components are validated and 
   * some component has been changed by user (otherwise: true).
   * @param  {String} path 
   * @param  {String|Array} except  With absolute paths for skipping
   * @returns {Boolean}   
   */
	function disabled(path, except) { // W.DISABLED = 
		path = pathmaker(path);
		return com_dirty(path, except) || !com_valid(path, except);
	}

   /**
   * Highlights all components on the path as invalid. 
   * @param  {String} path 
   * @param  {String|Array} except  With absolute paths for skipping
   * @returns {Boolean}   
   */
	function invalid(path, onlyComponent) {  // W.INVALID = 
		path = pathmaker(path);
		if (path) {
			com_dirty(path, false, onlyComponent, true);
			com_valid(path, false, onlyComponent);
		}
		return W;
	};


	// ===============================================================
	// Query Extendtion
	// ===============================================================

	$.fn.vbind = function() {
		return findinstance(this, '$vbind');
	};

	$.fn.vbindarray = function() {
		return findinstance(this, '$vbindarray');
	};

	$.fn.component = function() {
		return findinstance(this, '$com');
	};

	$.fn.components = function(fn) {
		var all = this.find(ATTRCOM);
		var output = null;
		all.each(function(index) {
			var com = this.$com;
			if (com) {
				var isarr = com instanceof Array;
				if (isarr) {
					com.forEach(function(o) {
						if (o && o.$ready && !o.$removed) {
							if (fn)
								return fn.call(o, index);
							if (!output)
								output = [];
							output.push(o);
						}
					});
				} else if (com && com.$ready && !com.$removed) {
					if (fn)
						return fn.call(com, index);
					if (!output)
						output = [];
					output.push(com);
				}
			}
		});
		return fn ? all : output;
	};


   /**
   * Create new components dynamically.
   * @param  {String|Array<String>} declaration 
   * @param  {jQuery Element/Component/Scope/Plugin} element optional,a parent element (default: "document.body")
   */
	function add(value, element) { // W.ADD =
		if (element instanceof COM || element instanceof Scope || element instanceof Plugin) {
			element = element.element;
		}
		if (value instanceof Array) {
			for (var i = 0; i < value.length; i++)
				ADD(value[i], element);
		} else {
			$(element || document.body).append('<div data-jc="{0}"></div>'.format(value));
			setTimeout2('ADD', COMPILE, 10);
		}
	};

	langx.mixin(components,{
		add,

		attrcom, // 
		exec,
		exec2,
	});

	var cache = {}; // lwf

	/*
	 * Finds all component according to the selector.
	 */
	function find(value, many, noCache, callback) { //W.FIND = 

		var isWaiting = false;

		if (langx.isFunction(many)) {
			isWaiting = true;
			callback = many;
			many = undefined;
			// noCache = undefined;
			// noCache can be timeout
		} else if (langx.isFunction(noCache)) {
			var tmp = callback;
			isWaiting = true;
			callback = noCache;
			noCache = tmp;
			// noCache can be timeout
		}

		if (isWaiting) {
			langx.isWaiting(function() {  // WAIT
				var val = FIND(value, many, noCache);
				if (lazycom[value] && lazycom[value].state === 1) {
					lazycom[value].state = 2;
					topic.emit('lazy', value, true); // EMIT
					warn('Lazy load: ' + value);
					compile();
				}
				return val instanceof Array ? val.length > 0 : !!val;
			}, function(err) {
				// timeout
				if (!err) {
					var val = FIND(value, many);
					callback.call(val ? val : W, val);
				}
			}, 500, noCache);
			return;
		}

		// Element
		if (typeof(value) === 'object') {
			if (!(value instanceof jQuery)) {
				value = $(value);
			}
			var output = findcomponent(value, '');
			return many ? output : output[0];
		}

		var key, output;

		if (!noCache) {
			key = 'find.' + value + '.' + (many ? 0 : 1);
			output = cache[key];
			if (output) {
				return output;
			}
		}

		var r = findcomponent(null, value);
		if (!many) {
			r = r[0];
		}
		output = r;
		if (!noCache) {
			cache[key] = output;
		}
		return output;
	};

	function usage(name, expire, path, callback) { //W.LASTMODIFICATION = W.USAGE = M.usage = 

		var type = typeof(expire);
		if (type === TYPE_S) {
			//var dt = W.NOW = W.DATETIME = new Date();
			var dt = langx.now(true);
			expire = dt.add('-' + expire.env()).getTime();
		} else if (type === TYPE_N)
			expire = Date.now() - expire;

		if (typeof(path) === TYPE_FN) {
			callback = path;
			path = undefined;
		}

		var arr = [];
		var a = null;

		if (path) {
			a = FIND('.' + path, true);
		} else {
			a = components;//M.components;
		}

		for (var i = 0; i < a.length; i++) {
			var c = a[i];
			if (c.usage[name] >= expire) {
				if (callback)
					callback(c);
				else
					arr.push(c);
			}
		}

		return callback ? M : arr;
	}

	function default2(path, timeout, onlyComponent, reset) { //M.default = 

		if (timeout > 0) {
			setTimeout(function() {
				default2(path, 0, onlyComponent, reset);
			}, timeout);
			return this;
		}

		if (typeof(onlyComponent) === 'boolean') {
			reset = onlyComponent;
			onlyComponent = null;
		}

		if (reset === undefined) {
			reset = true;
		}

		path = pathmakerw(path); //pathmaker(path.replace(REGWILDCARD, ''));

		// Reset scope
		var key = path.replace(/\.\*$/, '');
		var fn = defaults['#' + HASH(key)];
		var tmp;

		if (fn) {
			tmp = fn();
			set(key, tmp);
		}

		var arr = [];
		var all = components;//M.components;

		for (var i = 0, length = all.length; i < length; i++) {
			var com = all[i];

			if (!com || com.$removed || com.disabled || !com.$loaded || !com.path || !com.$compare(path)) {
				continue;
			}

			if (com.state) {
				arr.push(com);
			}

			if (onlyComponent && onlyComponent._id !== com._id) {
				continue;
			}

			if (com.$default) {
			 com.set(com.$default(), 3);
			}

			if (!reset) {
				return;
			}

			findcontrol2(com);

			if (!com.$dirty_disabled) {
				com.$dirty = true;
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

		if (reset) {
			caches.clear('valid', 'dirty');
			langx.state(arr, 3, 3);
		}

		return this;
	}


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

		path = parsers.pathmaker(path).replace(REGWILDCARD, '');

		var arr = [];
		var all = components;//M.components;

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

	return jc.views = {
		components,
		changed : changed,
		change : change,
		cleaner,
		cleaner2,
		default2,
		each,
		find,
		refresh,
		reset,
		setter,
		usage,
		version
	};

});
define('skylark-totaljs-jcomponent/compiler',[
	"./jc",
	"./defaults",
	"./langx",
	"./caches",
	"./http",
	"./plugins",
	"./Component",
	"./paths",
	"./views"
],function(jc, defaults, langx, caches, http,plugins,Component,paths,views){
	var M = jc,
		MD = defaults;
		extensions = Component.extensions,
		components = views.components,

		C = jc.compiler = {}; // var C = {}; // COMPILER

	var toggles = [];
    
	C.is = false;
	C.recompile = false;
	C.importing = 0;
	C.pending = [];
	C.init = [];
	C.imports = {};
	C.ready = [];

	C.get = get; // paths

	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================
	var blocked = {};
	var fallback = { $: 0 }; // $ === count of new items in fallback
	var fallbackpending = [];
	var $ready = setTimeout(load, 2);
	var $loaded = false;


   /**
   * Lock some code for a specific time. 
   * This method will paths info about blocking in localStorage if the expiration is longer than 10 seconds.
   * @param  {String} name   
   * @param  {Number} timeout 
   * @param  {Function} callback  
   */
	function block(name, timeout, callback) { //W.BLOCKED = 
		var key = name;
		var item = blocked[key];
		var now = Date.now();

		if (item > now) {
			return true;
		}

		if (langx.isString(timeout)) {
			timeout = timeout.env().parseExpire();
		}

		var local = MD.localstorage && timeout > 10000;
		blocked[key] = now + timeout;
		if (!M.isPRIVATEMODE && local) { // W.isPRIVATEMODE
		  localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));
		}
		callback && callback();
		return false;
	};

	function downloadfallback() {
		if (C.importing) {
			setTimeout(downloadfallback, 1000);
		} else {
			langx.setTimeout2('$fallback', function() {
				fallbackpending.splice(0).wait(function(item, next) {
					if (Component.registry[item]) // M.$components
						next();
					else {
						warn('Downloading: ' + item);
						http.importCache(MD.fallback.format(item), MD.fallbackcache, next);
					}
				}, 3);
			}, 100);
		}
	}

	function initialize() {
		var item = C.init.pop();
		if (item === undefined)
			!C.ready && compile();
		else {
			!item.$removed && prepare(item);
			initialize();
		}
	}

	function nextpending() {

		var next = C.pending.shift();
		if (next)
			next();
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

	function prepare(obj) {

		if (!obj)
			return;

		var el = obj.element;

		extensions[obj.name] && extensions[obj.name].forEach(function(item) {
			item.config && obj.reconfigure(item.config, NOOP);
			item.fn.call(obj, obj, obj.config);
		});

		var value = obj.get();
		var tmp;

		obj.configure && obj.reconfigure(obj.config, undefined, true);
		obj.$loaded = true;

		if (obj.setter) {
			if (!obj.$prepared) {

				obj.$prepared = true;
				obj.$ready = true;

				tmp = attrcom(obj, 'value');

				if (tmp) {
					if (!defaults[tmp])
						defaults[tmp] = new Function('return ' + tmp);
					obj.$default = defaults[tmp];
					if (value === undefined) {
						value = obj.$default();
						set(obj.path, value);
						emitwatch(obj.path, value, 0);
					}
				}

				if (obj.$binded)
					obj.$interaction(0);
				else {
					obj.$binded = true;
					obj.setterX(value, obj.path, 0);
					obj.$interaction(0);
				}
			}
		} else
			obj.$binded = true;

		if (obj.validate && !obj.$valid_disabled)
			obj.$valid = obj.validate(obj.get(), true);

		obj.done && setTimeout(obj.done, 20);
		obj.state && obj.stateX(0, 3);

		obj.$init && setTimeout(function() {
			var fn = get(obj.$init);
			if (langx.isFunction(fn)) {
				fn.call(obj, obj);	
			} 
			obj.$init = undefined;
		}, 5);

		var n = 'component';
		el.trigger(n);
		el.off(n);

		var cls = attrcom(el, 'class');
		cls && (function(cls) {
			setTimeout(function() {
				cls = cls.split(' ');
				var tmp = el[0].$jclass || {};
				for (var i = 0, length = cls.length; i < length; i++) {
					if (!tmp[cls[i]]) {
						el.tclass(cls[i]);
						tmp[cls[i]] = true;
					}
				}
				el[0].$jclass = tmp;
			}, 5);
		})(cls);

		obj.id && EMIT('#' + obj.id, obj);
		EMIT('@' + obj.name, obj);
		EMIT(n, obj);
		clear('find.');
		if (obj.$lazy) {
			obj.$lazy.state = 3;
			delete obj.$lazy;
			EMIT('lazy', obj.$name, false);
		}
	}


	function ready() {

		langx.setTimeout2('$ready', function() {

			mediaquery();
			components.refresh();
			initialize();

			var count = components.length; // M.components
			$(document).trigger('components', [count]);

			if (!$loaded) {
				$loaded = true;
				caches.clear('valid', 'dirty', 'find');
				topic.emit('init');
				topic('ready');
			}

			langx.setTimeout2('$initcleaner', function() {
				components.cleaner();
				var arr = autofill.splice(0);
				for (var i = 0; i < arr.length; i++) {
					var com = arr[i];
					!com.$default && findcontrol(com.element[0], function(el) {
						var val = $(el).val();
						if (val) {
							var tmp = com.parser(val);
							if (tmp && com.get() !== tmp) {
								com.dirty(false, true);
								com.set(tmp, 0);
							}
						}
						return true;
					});
				}
			}, 1000);

			C.is = false;

			if (C.recompile) {
				C.recompile = false;
				compile();
			}

			if (C.ready) {
				var arr = C.ready;
				for (var i = 0, length = arr.length; i < length; i++)
					arr[i](count);
				C.ready = undefined;
				compile();
				setTimeout(compile, 3000);
				setTimeout(compile, 6000);
				setTimeout(compile, 9000);
			}
		}, 100);
	}


	var lazycom = {};


	function dependencies(declaration, callback, obj, el) {

		if (declaration.importing) {
			WAIT(function() {
				return declaration.importing !== true;
			}, function() {
				callback(obj, el);
			});
			return;
		}

		if (!declaration.dependencies || !declaration.dependencies.length) {
			setTimeout(function(callback, obj, el) {
				callback(obj, el);
			}, 5, callback, obj, el);
			return;
		}

		declaration.importing = true;
		declaration.dependencies.wait(function(item, next) {
			if (langx.isFunction(item)) {
				item(next);
			} else {
				IMPORT((item.indexOf('<') === -1 ? 'once ' : '') + item, next);
			}
		}, function() {
			declaration.importing = false;
			callback(obj, el);
		}, 3);
	}
	

	function download() {

		var arr = [];
		var count = 0;

		$(ATTRURL).each(function() {

			var t = this;
			var el = $(t);

			if (t.$downloaded)
				return;

			t.$downloaded = 1;
			var url = attrcom(el, 'url');

			// Unique
			var once = url.substring(0, 5).toLowerCase() === 'once ';
			if (url.substring(0, 1) === '!' || once) {
				if (once) {
					url = url.substring(5);
				} else {
					url = url.substring(1);
				}
				if (statics[url]) {
					return;
				}
				statics[url] = 2;
			}

			var item = {};
			item.url = url;
			item.element = el;
			item.callback = attrcom(el, 'init');
			item.path = attrcom(el, 'path');
			item.toggle = (attrcom(el, 'class') || '').split(' ');
			item.expire = attrcom(el, 'cache') || MD.importcache;
			arr.push(item);
		});

		if (!arr.length) {
			return;
		}

		var canCompile = false;
		C.importing++;

		async(arr, function(item, next) {

			var key = makeurl(item.url);
			var can = false;

			AJAXCACHE('GET ' + item.url, null, function(response) {

				key = '$import' + key;

				caches.current.element = item.element[0];

				if (statics[key]) {
					response = removescripts(response);
				} else {
					response = importscripts(importstyles(response));
				}

				can = response && REGCOM.test(response);

				if (can) {
					canCompile = true;
				}

				item.element.html(response);
				statics[key] = true;
				item.toggle.length && item.toggle[0] && toggles.push(item);

				if (item.callback && !attrcom(item.element)) {
					var callback = get(item.callback);
					typeof(callback) === TYPE_FN && callback(item.element);
				}

				caches.current.element = null;
				count++;
				next();

			}, item.expire);

		}, function() {
			C.importing--;
			clear('valid', 'dirty', 'find');
			count && canCompile && compile();
		});
	}


	function compile(container,immediate) {

		if (C.is) {
			C.recompile = true;
			return;
		}

		var arr = [];

		W.READY instanceof Array && arr.push.apply(arr, W.READY);
		W.jComponent instanceof Array && arr.push.apply(arr, W.jComponent);
		W.components instanceof Array && arr.push.apply(arr, W.components);

		if (arr.length) {
			while (true) {
				var fn = arr.shift();
				if (!fn){
					break;
				}
				fn();
			}
		}

		C.is = true;
		download();

		if (C.pending.length) {
			(function(container) {
				C.pending.push(function() {
					compile(container);
				});
			})(container);
			return;
		}

		var has = false;

		crawler(container, function(name, dom, level, scope) {

			var el = $(dom);
			var meta = name.split(REGMETA);
			if (meta.length) {
				meta = meta.trim(true);
				name = meta[0];
			} else
				meta = null;

			has = true;

			// Check singleton instance
			if (statics['$ST_' + name]) {
				remove(el);
				return;
			}

			var instances = [];
			var all = name.split(',');

			for (var y = 0; y < all.length; y++) {

				var name = all[y].trim();
				var is = false;

				if (name.indexOf('|') !== -1) {

					// Multiple versions
					var keys = name.split('|');
					for (var i = 0; i < keys.length; i++) {
						var key = keys[i].trim();
						if (key && M.$components[key]) {
							name = key;
							is = true;
							break;
						}
					}

					if (!is)
						name = keys[0].trim();
				}

				var lazy = false;

				if (name.substring(0, 5).toLowerCase() === 'lazy ') {
					name = name.substring(5);
					lazy = true;
				}

				if (!is && name.lastIndexOf('@') === -1) {
					if (versions[name])
						name += '@' + versions[name];
					else if (MD.version)
						name += '@' + MD.version;
				}

				var com = M.$components[name];
				var lo = null;

				if (lazy && name) {
					var namea = name.substring(0, name.indexOf('@'));
					lo = lazycom[name];
					if (!lo) {
						if (namea && name !== namea)
							lazycom[name] = lazycom[namea] = { state: 1 };
						else
							lazycom[name] = { state: 1 };
						continue;
					}
					if (lo.state === 1)
						continue;
				}

				if (!com) {

					if (!fallback[name]) {
						fallback[name] = 1;
						fallback.$++;
					}

					var x = attrcom(el, 'import');
					if (!x) {
						!statics['$NE_' + name] && (statics['$NE_' + name] = true);
						continue;
					}

					if (C.imports[x] === 1)
						continue;

					if (C.imports[x] === 2) {
						!statics['$NE_' + name] && (statics['$NE_' + name] = true);
						continue;
					}

					C.imports[x] = 1;
					C.importing++;

					M.import(x, function() {
						C.importing--;
						C.imports[x] = 2;
					});

					continue;
				}

				if (fallback[name] === 1) {
					fallback.$--;
					delete fallback[name];
				}

				var obj = new COM(com.name);
				var parent = dom.parentNode;

				while (true) {
					if (parent.$com) {
						var pc = parent.$com;
						obj.owner = pc;
						if (pc.$children)
							pc.$children++;
						else
							pc.$children = 1;
						break;
					} else if (parent.nodeName === 'BODY')
						break;
					parent = parent.parentNode;
					if (parent == null)
						break;
				}

				obj.global = com.shared;
				obj.element = el;
				obj.dom = dom;

				var p = attrcom(el, 'path') || (meta ? meta[1] === 'null' ? '' : meta[1] : '') || obj._id;

				if (p.substring(0, 1) === '%')
					obj.$noscope = true;

				obj.setPath(pathmaker(p, true), 1);
				obj.config = {};

				// Default config
				com.config && obj.reconfigure(com.config, NOOP);

				var tmp = attrcom(el, 'config') || (meta ? meta[2] === 'null' ? '' : meta[2] : '');
				tmp && obj.reconfigure(tmp, NOOP);

				if (!obj.$init)
					obj.$init = attrcom(el, 'init') || null;

				if (!obj.type)
					obj.type = attrcom(el, 'type') || '';

				if (!obj.id)
					obj.id = attrcom(el, 'id') || obj._id;

				obj.siblings = all.length > 1;
				obj.$lazy = lo;

				for (var i = 0; i < configs.length; i++) {
					var con = configs[i];
					con.fn(obj) && obj.reconfigure(con.config, NOOP);
				}

				caches.current.com = obj;
				com.declaration.call(obj, obj, obj.config);
				caches.current.com = null;

				meta[3] && el.attrd('jc-value', meta[3]);

				if (obj.init && !statics[name]) {
					statics[name] = true;
					obj.init();
				}

				dom.$com = obj;

				if (!obj.$noscope)
					obj.$noscope = attrcom(el, 'noscope') === 'true';

				var code = obj.path ? obj.path.charCodeAt(0) : 0;
				if (!obj.$noscope && scope.length && !obj.$pp) {

					var output = initscopes(scope);

					if (obj.path && code !== 33 && code !== 35) {
						obj.setPath(obj.path === '?' ? output.path : (obj.path.indexOf('?') === -1 ? output.path + '.' + obj.path : obj.path.replace(/\?/g, output.path)), 2);
					} else {
						obj.$$path = EMPTYARRAY;
						obj.path = '';
					}

					obj.scope = output;
					obj.pathscope = output.path;
				}

				instances.push(obj);

				var template = attrcom(el, 'template') || obj.template;
				if (template)
					obj.template = template;

				if (attrcom(el, 'released') === 'true')
					obj.$released = true;

				if (attrcom(el, 'url')) {
					warn('Components: You have to use "data-jc-template" attribute instead of "data-jc-url" for the component: {0}[{1}].'.format(obj.name, obj.path));
					continue;
				}

				if (langx.isString(template)) {
					var fn = function(data) {
						if (obj.prerender)
							data = obj.prerender(data);
						dependencies(com, function(obj, el) {
							if (langx.isFunction(obj.make)) {
								var parent = caches.current.com;
								caches.current.com = obj;
								obj.make(data);
								caches.current.com = parent;
							}
							init(el, obj);
						}, obj, el);
					};

					var c = template.substring(0, 1);
					if (c === '.' || c === '#' || c === '[') {
						fn($(template).html());
						continue;
					}

					var k = 'TE' + HASH(template);
					var a = statics[k];
					if (a) {
						fn(a);
						continue;
					}

					$.get(makeurl(template), function(response) {
						statics[k] = response;
						fn(response);
					});

					continue;
				}

				if (langx.isString(obj.make)) {

					if (obj.make.indexOf('<') !== -1) {
						dependencies(com, function(obj, el) {
							if (obj.prerender)
								obj.make = obj.prerender(obj.make);
							el.html(obj.make);
							init(el, obj);
						}, obj, el);
						continue;
					}

					$.get(makeurl(obj.make), function(data) {
						dependencies(com, function(obj, el) {
							if (obj.prerender)
								data = obj.prerender(data);
							el.html(data);
							init(el, obj);
						}, obj, el);
					});

					continue;
				}

				if (com.dependencies) {
					dependencies(com, function(obj, el) {

						if (obj.make) {
							var parent = caches.current.com;
							caches.current.com = obj;
							obj.make();
							caches.current.com = parent;
						}

						init(el, obj);
					}, obj, el);
				} else {

					// Because sometimes make doesn't contain the content of the element
					setTimeout(function(init, el, obj) {

						if (obj.make) {
							var parent = caches.current.com;
							caches.current.com = obj;
							obj.make();
							caches.current.com = parent;
						}

						init(el, obj);
					}, 5, init, el, obj);
				}
			}

			// A reference to instances
			if (instances.length > 0) {
				el.$com = instances.length > 1 ? instances : instances[0];
			}

		}, undefined);

		// perform binder
		rebindbinder();

		if (!has || !C.pending.length) {
			C.is = false;
		}

		if (container !== undefined || !toggles.length) {
			return nextpending();
		}

		async(toggles, function(item, next) {
			for (var i = 0, length = item.toggle.length; i < length; i++)
				item.element.tclass(item.toggle[i]);
			next();
		}, nextpending);
	}

	function crawler(container, onComponent, level, paths) {

		if (container) {
			container = $(container)[0];
		} else {
			container = document.body;
		}

		if (!container) {
			return;
		}

		var comp = container ? attrcom(container, 'compile') : '1';
		if (comp === '0' || comp === 'false') {
			return;
		}

		if (level == null || level === 0) {
			paths = [];
			if (container !== document.body) {
				var scope = $(container).closest('[' + ATTRSCOPE + ']');
				scope && scope.length && paths.push(scope[0]);
			}
		}

		var b = null;
		var released = container ? attrcom(container, 'released') === 'true' : false;
		var tmp = attrcom(container, 'scope');
		var binders = null;

		tmp && paths.push(container);

		if (!container.$jcbind) {
			b = container.getAttribute('data-bind') || container.getAttribute('bind');
			if (b) {
				!binders && (binders = []);
				binders.push({ el: container, b: b });
			}
		}

		var name = attrcom(container);
		!container.$com && name != null && onComponent(name, container, 0, paths);

		var arr = container.childNodes;
		var sub = [];

		if (level === undefined) {
			level = 0;
		} else {
			level++;
		}

		for (var i = 0, length = arr.length; i < length; i++) {
			var el = arr[i];
			if (el) {

				if (!el.tagName) {
					continue;
				}

				comp = el.getAttribute('data-jc-compile');
				if (comp === '0' || comp === 'false') {
					continue;
				}

				if (el.$com === undefined) {
					name = attrcom(el);
					if (name != null) {
						released && el.setAttribute(ATTRREL, 'true');
						onComponent(name || '', el, level, paths);
					}
				}

				if (!el.$jcbind) {
					b = el.getAttribute('data-bind') || el.getAttribute('bind');
					if (b) {
						el.$jcbind = 1;
						!binders && (binders = []);
						binders.push({ el: el, b: b });
					}
				}

				comp = el.getAttribute('data-jc-compile');
				if (comp !== '0' && comp !== 'false')
					el.childNodes.length && el.tagName !== 'SCRIPT' && REGCOM.test(el.innerHTML) && sub.indexOf(el) === -1 && sub.push(el);
			}
		}

		for (var i = 0, length = sub.length; i < length; i++) {
			el = sub[i];
			el && crawler(el, onComponent, level, paths && paths.length ? paths : []);
		}

		if (binders) {
			for (var i = 0; i < binders.length; i++) {
				var a = binders[i];
				a.el.$jcbind = parsebinder(a.el, a.b, paths);
			}
		}
	}

	function init(el, obj) {

		var dom = el[0];
		var type = dom.tagName;
		var collection;

		// autobind
		if (ACTRLS[type]) {
			obj.$input = true;
			collection = obj.element;
		} else {
			collection = el;
		}

		findcontrol2(obj, collection);

		obj.released && obj.released(obj.$released);
		components.push(obj); // M.components.push(obj)
		C.init.push(obj);
		type !== 'BODY' && REGCOM.test(el[0].innerHTML) && compile(el);
		ready();
	}


	$(document).ready(function() {

		if ($ready) {
			clearTimeout($ready);
			load();
		}

		$(Window).on('orientationchange', mediaquery);

		$(document).on('input', 'input[data-jc-bind],textarea[data-jc-bind]', function() {

			// realtime binding
			var self = this;
			var com = self.$com;

			if (!com || com.$removed || !com.getter || self.$jckeypress === false) {
				return;
			}

			self.$jcevent = 2;

			if (self.$jckeypress === undefined) {
				var tmp = attrcom(self, 'keypress');
				if (tmp)
					self.$jckeypress = tmp === 'true';
				else if (com.config.$realtime != null)
					self.$jckeypress = com.config.$realtime === true;
				else if (com.config.$binding)
					self.$jckeypress = com.config.$binding === 1;
				else
					self.$jckeypress = MD.keypress;
				if (self.$jckeypress === false)
					return;
			}

			if (self.$jcdelay === undefined) {
				self.$jcdelay = +(attrcom(self, 'keypress-delay') || com.config.$delay || MD.delay);
			}

			if (self.$jconly === undefined) {
				self.$jconly = attrcom(self, 'keypress-only') === 'true' || com.config.$keypress === true || com.config.$binding === 2;
			}

			if (self.$jctimeout) {
				clearTimeout(self.$jctimeout);	
			} 
			self.$jctimeout = setTimeout(keypressdelay, self.$jcdelay, self);
		});

		$(document).on('focus blur', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function(e) {

			var self = this;
			var com = self.$com;

			if (!com || com.$removed || !com.getter)
				return;

			if (e.type === 'focusin')
				self.$jcevent = 1;
			else if (self.$jcevent === 1) {
				com.dirty(false, true);
				com.getter(self.value, 3);
			} else if (self.$jcskip) {
				self.$jcskip = false;
			} else {
				// formatter
				var tmp = com.$skip;
				if (tmp)
					com.$skip = false;
				com.setter(com.get(), com.path, 2);
				if (tmp) {
					com.$skip = tmp;
				}
			}
		});

		$(document).on('change', 'input[data-jc-bind],textarea[data-jc-bind],select[data-jc-bind]', function() {

			var self = this;
			var com = self.$com;

			if (self.$jconly || !com || com.$removed || !com.getter)
				return;

			if (self.$jckeypress === false) {
				// bind + validate
				self.$jcskip = true;
				com.getter(self.value, false);
				return;
			}

			switch (self.tagName) {
				case 'SELECT':
					var sel = self[self.selectedIndex];
					self.$jcevent = 2;
					com.dirty(false, true);
					com.getter(sel.value, false);
					return;
				case 'INPUT':
					if (self.type === 'checkbox' || self.type === 'radio') {
						self.$jcevent = 2;
						com.dirty(false, true);
						com.getter(self.checked, false);
						return;
					}
					break;
			}

			if (self.$jctimeout) {
				com.dirty(false, true);
				com.getter(self.value, true);
				clearTimeout(self.$jctimeout);
				self.$jctimeout = 0;
			} else {
				self.$jcskip = true;
				com.setter && com.setterX(com.get(), self.path, 2);
			}
		});

		setTimeout(compile, 2);
		$domready = true;
	});


	// Component
	Component.prototype.compile = function(container) {
		var self = this;
		!container && self.attrd('jc-compile') && self.attrd('jc-compile', '1');
		compile(container || self.element);
		return self;
	};


	function cleaner2() {
		clear();
		cleaner();
	}


	function cleaner() {

		var keys = Object.keys(events);
		var is = false;
		var length = keys.length;
		var index;
		var arr;

		for (var i = 0; i < length; i++) {
			var key = keys[i];
			index = 0;
			arr = events[key];
			while (true) {

				var item = arr[index++];
				if (item === undefined)
					break;

				if (item.context == null || (item.context.element && inDOM(item.context.element[0])))
					continue;

				item.context && item.context.element && item.context.element.remove();
				item.context.$removed = true;
				item.context = null;
				arr.splice(index - 1, 1);

				if (!arr.length)
					delete events[key];

				index -= 2;
				is = true;
			}
		}

		index = 0;
		while (true) {
			var item = watches[index++];
			if (item === undefined)
				break;
			if (item.context == null || (item.context.element && inDOM(item.context.element[0])))
				continue;
			item.context && item.context.element && item.context.element.remove();
			item.context.$removed = true;
			item.context = null;
			watches.splice(index - 1, 1);
			index -= 2;
			is = true;
		}

		//var all =  M.components;
 		index = 0;
		length = all.length;

		while (index < length) {

			var component = all[index++];

			if (!component) {
				index--;
				all.splice(index, 1);
				length = all.length;
				continue;
			}

			var c = component.element;
			if (!component.$removed && c && inDOM(c[0])) {
				if (!component.attr(ATTRDEL)) {
					if (component.$parser && !component.$parser.length)
						component.$parser = undefined;
					if (component.$formatter && !component.$formatter.length)
						component.$formatter = undefined;
					continue;
				}
			}

			topic.emit('destroy', component.name, component);
			topic.emit('component.destroy', component.name, component);

			delete statics['$ST_' + component.name];
			component.destroy && component.destroy();
			$('#css' + component.ID).remove();

			if (c[0].nodeName !== 'BODY') {
				c.off();
				c.find('*').off();
				c.remove();
			}

			component.$main = undefined;
			component.$data = null;
			component.dom = null;
			component.$removed = 2;
			component.path = null;
			component.setter = null;
			component.setter2 = null;
			component.getter = null;
			component.getter2 = null;
			component.make = null;

			index--;
			all.splice(index, 1);
			length = all.length; // M.components.length
			is = true;
		}

		keys = Object.keys(binders);
		for (var i = 0; i < keys.length; i++) {
			arr = binders[keys[i]];
			var j = 0;
			while (true) {
				var o = arr[j++];
				if (!o)
					break;
				if (inDOM(o.el[0]))
					continue;
				var e = o.el;
				if (!e[0].$br) {
					e.off();
					e.find('*').off();
					e[0].$br = 1;
				}
				j--;
				arr.splice(j, 1);
			}
			if (!arr.length)
				delete binders[keys[i]];
		}

		clear('find');

		// Checks PLUGINS
		var R = plugins.registry; //W.PLUGINS;
		Object.keys(R).forEach(function(key) {
			var a = R[key];
			if (!inDOM(a.element[0]) || !a.element[0].innerHTML) {
				a.$remove();
				delete R[key];
			}
		});

		W.DATETIME = W.NOW = new Date();
		var now = W.NOW.getTime();
		var is2 = false;
		var is3 = false;

		for (var key in blocked) {
			if (blocked[key] <= now) {
				delete blocked[key];
				is2 = true;
			}
		}

		if (MD.localstorage && is2 && !M.isPRIVATEMODE)  // W.isPRIVATEMODE
			localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));

		for (var key in storage) {
			var item = storage[key];
			if (!item.expire || item.expire <= now) {
				delete storage[key];
				is3 = true;
			}
		}

		is3 && save();

		if (is) {
			refresh();
			setTimeout(compile, 2000);
		}
	}


	function refresh() {
		setTimeout2('$refresh', function() {
			all.sort(function(a, b) {  // M.components.sort
				if (a.$removed || !a.path)
					return 1;
				if (b.$removed || !b.path)
					return -1;
				var al = a.path.length;
				var bl = b.path.length;
				return al > bl ? - 1 : al === bl ? LCOMPARER(a.path, b.path) : 1;
			});
		}, 200);
	}

	setInterval(function() {
//		temp = {};
//		paths = {};
		cleaner();
	}, (1000 * 60) * 5);

	return jc.compiler = {
		block,
		compile,
	};

});
define('skylark-totaljs-jcomponent/cookies',[
	"./langx"
],function(langx){

	function get (name) {
		name = name.env();
		var arr = document.cookie.split(';');
		for (var i = 0; i < arr.length; i++) {
			var c = arr[i];
			if (c.charAt(0) === ' ')
				c = c.substring(1);
			var v = c.split('=');
			if (v.length > 1 && v[0] === name)
				return v[1];
		}
		return '';
	}
	
	function set(name, value, expire) {
		var type = typeof(expire);
		if (type === 'number') {
			var date = langx.now();//W.NOW;
			date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
			expire = date;
		} else if (type === 'string') {
			expire = new Date(Date.now() + expire.parseExpire());
		}
		document.cookie = name.env() + '=' + value + '; expires=' + expire.toGMTString() + '; path=/';
	}

	function rem(name) {
		set(name.env(), '', -1);
	}

	return { // W.COOKIES = 
		get,
		set,
		rem
	};


});
define('skylark-totaljs-jcomponent/domx',[
	"skylark-utils-dom/query",
	"./jc",
	"./langx",
	"./caches"
],function(query,jc,langx,caches){
	MD.devices = { xs: { max: 768 }, sm: { min: 768, max: 992 }, md: { min: 992, max: 1200 }, lg: { min: 1200 }};

	var REGCSS = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGSCRIPT = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var mediaqueriescounter = 0;
	var knockknockcounter = 0;

 	var mediaqueries = [];
	var $domready = false;
	
	function mediaquery() {

		if (!mediaqueries || !mediaqueries.length)
			return;

		var orientation = W.orientation ? Math.abs(W.orientation) === 90 ? 'landscape' : 'portrait' : '';

		var $w = $(W);
		var w = $w.width();
		var h = $w.height();
		var d = MD.devices;

		for (var i = 0, length = mediaqueries.length; i < length; i++) {
			var mq = mediaqueries[i];
			var cw = w;
			var ch = h;

			if (mq.element) {
				cw = mq.element.width();
				ch = mq.element.height();
			}

			if (mq.orientation) {
				if (!orientation && mq.orientation !== 'portrait')
					continue;
				else if (orientation !== mq.orientation)
					continue;
			}

			if (mq.minW && mq.minW >= cw)
				continue;
			if (mq.maxW && mq.maxW <= cw)
				continue;
			if (mq.minH && mq.minH >= ch)
				continue;
			if (mq.maxH && mq.maxH <= ch)
				continue;

			if (mq.oldW === cw && mq.oldH !== ch) {
				// changed height
				if (!mq.maxH && !mq.minH)
					continue;
			}

			if (mq.oldH === ch && mq.oldW !== cw) {
				// changed width
				if (!mq.maxW && !mq.minW)
					continue;
			}

			if (mq.oldW === cw && mq.oldH === ch)
				continue;

			var type = null;

			if (cw >= d.md.min && cw <= d.md.max)
				type = 'md';
			else if (cw >= d.sm.min && cw <= d.sm.max)
				type = 'sm';
			else if (cw > d.lg.min)
				type = 'lg';
			else if (cw <= d.xs.max)
				type = 'xs';

			mq.oldW = cw;
			mq.oldH = ch;
			mq.fn(cw, ch, type, mq.id);
		}
	}

	function inDOM(el) {
		if (!el)
			return;
		if (el.nodeName === 'BODY')
			return true;
		var parent = el.parentNode;
		while (parent) {
			if (parent.nodeName === 'BODY')
				return true;
			parent = parent.parentNode;
		}
	}

	function remove(el) {
		var dom = el[0];
		dom.$com = null;
		el.attr(ATTRDEL, true);
		el.remove();
	}

	function removescripts(str) {
		return str.replace(REGSCRIPT, function(text) {
			var index = text.indexOf('>');
			var scr = text.substring(0, index + 1);
			return scr.substring(0, 6) === '<style' || (scr.substring(0, 7) === '<script' && scr.indexOf('type="') === -1) || scr.indexOf('/javascript"') !== -1 ? '' : text;
		});
	}

	function importscripts(str) {

		var beg = -1;
		var output = str;
		var external = [];
		var scr;

		while (true) {

			beg = str.indexOf('<script', beg);
			if (beg === -1) {
				break;
			}
			var end = str.indexOf('</script>', beg + 8);
			var code = str.substring(beg, end + 9);
			beg = end + 9;
			end = code.indexOf('>');
			scr = code.substring(0, end);

			if (scr.indexOf('type=') !== -1 && scr.lastIndexOf('javascript') === -1) {
				continue;
			}

			var tmp = code.substring(end + 1, code.length - 9).trim();
			if (!tmp) {
				output = output.replace(code, '').trim();
				var eid = 'external' + langx.hashCode(code);
				if (!statics[eid]) {
					external.push(code);
					statics[eid] = true;
				}
			}
		}

		if (external.length) {
			$('head').append(external.join('\n'));
		}
		return output;
	}

	function importstyles(str, id) {
		var builder = [];

		str = str.replace(REGCSS, function(text) {
			text = text.replace('<style>', '<style type="text/css">');
			builder.push(text.substring(23, text.length - 8).trim());
			return '';
		});

		var key = 'css' + (id || '');

		if (id) {
			if (statics[key])
				$('#' + key).remove();
			else
				statics[key] = true;
		}

		builder.length && $('<style' + (id ? ' id="' + key + '"' : '') + '>{0}</style>'.format(builder.join('\n'))).appendTo('head');
		return str;
	}

	function scrollbarWidth() { //W.SCROLLBARWIDTH = 
		var id = 'jcscrollbarwidth';
			w = caches.get(id);
		if (w !== undefined) {
			return w;
		}
		var b = document.body;
		$(b).append('<div id="{0}" style="width{1}height{1}overflow:scroll;position:absolute;top{2}left{2}"></div>'.format(id, ':100px;', ':9999px;'));
		var el = document.getElementById(id);
		w = el.offsetWidth - el.clientWidth;
		b.removeChild(el);
		caches.set(id,w);
		return w;
	}

   /**
   * Returns a current display size of the element. Display size can be:
   * <ul>
   *   <li>xs extra small display (mobile device)</li>
   *   <li>sm small display (tablet)</li>
   *   <li>md medium display (small laptop)</li>
   *   <li>lg large display (desktop computer, laptop)</li>
   * </ul>
   * execute CSS() twice then the previous styles will be removed.
   * @param  {String} value 
   * @param  {String} id 
   */
	function width(el) { //W.WIDTH = 
		if (!el) {
			el = $(Window);
		}
		var w = el.width();
		var d = MD.devices;
		return w >= d.md.min && w <= d.md.max ? 'md' : w >= d.sm.min && w <= d.sm.max ? 'sm' : w > d.lg.min ? 'lg' : w <= d.xs.max ? 'xs' : '';
	}

   /**
   * Registers a listener for specific size of the browser window or element.
   * @param  {String} query media CSS query string 
   * @param  {jQuery Element} id 
   * @param  {Function(w, h, type, id)} fn 
   * @return {Number } an idetificator of MediaQuery
   */
	function watchMedia(query, element, fn) { //W.MEDIAQUERY = 

		if (typeof(query) === TYPE_N) {
			mediaqueries.remove('id', query);
			return true;
		}

		if (typeof(element) === TYPE_FN) {
			fn = element;
			element = null;
		}

		query = query.toLowerCase();
		if (query.indexOf(',') !== -1) {
			var ids = [];
			query.split(',').forEach(function(q) {
				q = q.trim();
				q && ids.push(MEDIAQUERY(q, element, fn));
			});
			return ids;
		}

		var d = MD.devices;

		if (query === 'md')
			query = 'min-width:{0}px and max-width:{1}px'.format(d.md.min, d.md.max);
		else if (query === 'lg')
			query = 'min-width:{0}px'.format(d.lg.min);
		else if (query === 'xs')
			query = 'max-width:{0}px'.format(d.xs.max);
		else if (query === 'sm')
			query = 'min-width:{0}px and max-width:{1}px'.format(d.sm.min, d.sm.max);

		var arr = query.match(/(max-width|min-width|max-device-width|min-device-width|max-height|min-height|max-device-height|height|width):(\s)\d+(px|em|in)?/gi);
		var obj = {};

		var num = function(val) {
			var n = parseInt(val.match(/\d+/), 10);
			return val.match(/\d+(em)/) ? n * 16 : val.match(/\d+(in)/) ? (n * 0.010416667) >> 0 : n;
		};

		if (arr) {
			for (var i = 0, length = arr.length; i < length; i++) {
				var item = arr[i];
				var index = item.indexOf(':');
				switch (item.substring(0, index).toLowerCase().trim()) {
					case 'min-width':
					case 'min-device-width':
					case 'width':
						obj.minW = num(item);
						break;
					case 'max-width':
					case 'max-device-width':
						obj.maxW = num(item);
						break;
					case 'min-height':
					case 'min-device-height':
					case 'height':
						obj.minH = num(item);
						break;
					case 'max-height':
					case 'max-device-height':
						obj.maxH = num(item);
						break;
				}
			}
		}

		arr = query.match(/orientation:(\s)(landscape|portrait)/gi);
		if (arr) {
			for (var i = 0, length = arr.length; i < length; i++) {
				var item = arr[i];
				if (item.toLowerCase().indexOf('portrait') !== -1) {
					obj.orientation = 'portrait';
				} else {
					obj.orientation = 'landscape';
				}
			}
		}

		obj.id = mediaqueriescounter++;
		obj.fn = fn;

		if (element) {
			obj.element = element;
		}

		mediaqueries.push(obj);
		return obj.id;
	};

   /**
   * creates inline CSS registered in the head tag. If you use id and 
   * execute CSS() twice then the previous styles will be removed.
   * @param  {String} value 
   * @param  {String} id 
   */
	function style(value, id) { //W.CSS = W.STYLE = 
		if (id) {
		 $('#css' + id).remove();
		}
		$('<style type="text/css"' + (id ? ' id="css' + id + '"' : '') + '>' + (value instanceof Array ? value.join('') : value) + '</style>').appendTo('head');
	};


	W.KEYPRESS = function(fn, timeout, key) {
		if (!timeout) {
			timeout = 300;
		}
		var str = fn.toString();
		var beg = str.length - 20;
		if (beg < 0) {
			beg = 0;
		}
		var tkey = key ? key : langx.hashCode(str.substring(0, 20) + 'X' + str.substring(beg)) + '_keypress';
		langx.setTimeout2(tkey, fn, timeout);
	};

	function keypressdelay(self) {
		var com = self.$com;
		// Reset timeout
		self.$jctimeout = 0;
		// It's not dirty
		com.dirty(false, true);
		// Binds a value
		com.getter(self.value, true);
	}

	
	//-- Waits for jQuery
	//WAIT(function() {
	//	return !!W.jQuery;
	//}, function() {

	//	setInterval(function() {
	//		temp = {};
	//		paths = {};
	//		cleaner();
	//	}, (1000 * 60) * 5);

		// scheduler



		$.fn.aclass = function(a) {
			return this.addClass(a);
		};

		$.fn.rclass = function(a) {
			return a == null ? this.removeClass() : this.removeClass(a);
		};

		$.fn.rattr = function(a) {
			return this.removeAttr(a);
		};

		$.fn.rattrd = function(a) {
			return this.removeAttr('data-' + a);
		};

		$.fn.rclass2 = function(a) {

			var self = this;
			var arr = (self.attr('class') || '').split(' ');
			var isReg = typeof(a) === TYPE_O;

			for (var i = 0, length = arr.length; i < length; i++) {
				var cls = arr[i];
				if (cls) {
					if (isReg) {
						a.test(cls) && self.rclass(cls);
					} else {
						cls.indexOf(a) !== -1 && self.rclass(cls);
					}
				}
			}

			return self;
		};

		$.fn.hclass = function(a) {
			return this.hasClass(a);
		};

		$.fn.tclass = function(a, v) {
			return this.toggleClass(a, v);
		};

		$.fn.attrd = function(a, v) {
			a = 'data-' + a;
			return v == null ? this.attr(a) : this.attr(a, v);
		};

		// Appends an SVG element
		$.fn.asvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				this.append(el);
				return $(el);
			}

			var d = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = document.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.append(f);
			return f;
		};

		$.fn.psvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				this.prepend(el);
				return $(el);
			}

			var d = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = document.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.prepend(f);
			return f;
		};

		$.fn.rescroll = function(offset, bottom) {
			var t = this;
			t.each(function() {
				var e = this;
				var el = e;
				el.scrollIntoView(true);
				if (offset) {
					var count = 0;
					while (el && el.scrollTop == 0 && count++ < 25) {
						el = el.parentNode;
						if (el && el.scrollTop) {

							var off = el.scrollTop + offset;

							if (bottom != false) {
								if (el.scrollTop + el.getBoundingClientRect().height >= el.scrollHeight) {
									el.scrollTop = el.scrollHeight;
									return;
								}
							}

							el.scrollTop = off;
							return;
						}
					}
				}
			});
			return t;
		};

		$.components = M;

		setInterval(function() {
			//W.DATETIME = W.NOW = new Date();
			langx.now(true);
			var c = M.components;
			for (var i = 0, length = c.length; i < length; i++)
				c[i].knockknock && c[i].knockknock(knockknockcounter);
			EMIT('knockknock', knockknockcounter++);
		}, 60000);

		function resize() {
			var w = $(window);
			W.WW = w.width();
			W.WH = w.height();
			mediaquery();
		}

		resize();

		$(window).on('resize', resize);
	//}, 100);

	return jc.domx = {
		mediaquery,
		importscripts,
	}

});
define('skylark-totaljs-jcomponent/env',[
	"./jc",
	"./topic",
	"./defaults"
],function(jc,topic, defaults){
	var MD = defaults;

	var environment = MD.environment = {};

	function env (name, value) { // W.ENV

		if (langx.isObject(name)) {
			name && Object.keys(name).forEach(function(key) {
				environment[key] = name[key];
				EMIT(KEY_ENV, key, name[key]);
			});
			return name;
		}

		if (value !== undefined) {
			EMIT(KEY_ENV, name, value);
			ENV[name] = value;
			return value;
		}

		return environment[name];
	};

	return jc.env = env;
});
define('skylark-totaljs-jcomponent/logs',[],function(){

	function warn() { // W.WARN
		Window.console && Window.console.warn.apply(W.console, arguments);
	};
	
	return {
		warn
	}

});
define('skylark-totaljs-jcomponent/transforms',[
	"./jc"
],function(jc){
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
			if (typeof(callback) === TYPE_S)
				SET(callback, value);
			else
				callback(value);
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
		} else
			cb();

		return this;
	};

	return jc.transforms = {
		register,
		transform
	}
});
define('skylark-totaljs-jcomponent/validators',[
	"./jc"
],function(jc){
	var MV = jc.validators = {};
	MV.url = /^(https?:\/\/(?:www\.|(?!www))[^\s.#!:?+=&@!$'~*,;/()[\]]+\.[^\s#!?+=&@!$'~*,;()[\]\\]{2,}\/?|www\.[^\s#!:.?+=&@!$'~*,;/()[\]]+\.[^\s#!?+=&@!$'~*,;()[\]\\]{2,}\/?)/i;
	MV.phone = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
	MV.email = /^[a-zA-Z0-9-_.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;	

	return MV;
});
define('skylark-totaljs-jcomponent/globals',[
	"./jc",
	"./defaults",
	"./env",
	"./langx",
	"./logs",
	"./topic",
	"./cookies",
	"./caches",
	"./storages",
	"./transforms",
	"./plugins",
	"./Component",
	"./binders",
	"./views",
	"./compiler",
	"./schedulers",
	"./paths"
],function(jc, defaults, env,langx,logs,topic,cookies,caches,storages,transforms,plugins,Component,binders,views,compiler,schedulers,paths){

	var M = jc,
		W = Window;

	//jc
	langx.each({
		"isPRIVATEMODE" : "isPRIVATEMODE",
		"isMOBILE" : "isMOBILE",
		"isROBOT" : "isROBOT",
		"isSTANDALONE" : "isSTANDALONE",
		"isTOUCH" : "isTOUCH",
		"MONTHS" : "months",
		"DAYS" : "days"
	},function(name1,name2){
		Object.defineProperty(this, name1, {
		    get() {
		      return jc[name2];
		    },
		    set(value) {
		    	jc[name2] = value;
		    }
		});	
	});


    // defaults
	W.DEF = defaults;

	// env 
	W.ENV = env;

	// langx
	langx.mixin(W,{
		clearTimeout2: langx.clearTimeout2,
		setTimeout2 : langx.setTimeout2,
		WAIT : langx.wait,

		COPY : langx.copy,
		CLONE: langx.clone,
		EMPTYARRAY : langx.empties.array,
		EMPTYOBJECT : langx.empties.object,
		NOOP : langx.empties.fn,

		STRINGIFY: langx.stringify,
		PARSE: langx.parse,
		HASH: langx.hashCode,
		GUID: langx.guid,
		SINGLETON: langx.singleton,

		WARN : longs.warn,

		ADD : components.add,
		

		FN : langx.arrowFn
	});

	//domx
	langx.mixin(W,{
		MEDIAQUERY : domx.watchMedia,
		SCROLLBARWIDTH : domx.scrollbarWidth,
		WIDTH : domx.width,
		CSS : domx.style,
		STYLE: domx.style
	});

	// topic
	langx.mixin(W,{
		EMIT: topic.emit,
		OFF: topic.off,
		ON: topic.on
	});


	// http
	langx.mixin(W,{
		MAKEPARAMS: http.makeParams,
		UPLOAD: http.upload,
		IMPORTCACHE: http.importCache,
		IMPORT: http.import,
		UPTODATE: http.uptodate,
		PING: http.ping,
		READPARAMS: http.parseQuery,
		AJAXCONFIG: http.configure,
		AJAX: http.ajax,
		AJAXCACHE: http.ajaxCache,
		AJAXCACHEREVIEW: http.ajaxCacheReview
	});

	// schedulers
	langx.mixin(W,{
		CLEARSCHEDULE : schedulers.clear,
		SCHEDULE : schedulers.schedule		

	});

	// cookies
	W.COOKIES = cookies;

	// storages
	langx.mixin(W,{
		CACHE : storages.put,
		CLEARCACHE : storages.clearCache,
		REMOVECACHE : storages.remove
	});


	//W.SCHEMA = function(name, declaration) {
	//	return M.schema(name, declaration);
	//};

	// plugins
	langx.mixin(W,{
		PLUGIN : plugins.register,
		PLUGINS : plugins.registry
	});

	// Component
	langx.mixin(W,{
		COMPONENT: Component.register,
		COMPONENT_EXTEND : Component.extend,
		COMPONENT_CONFIG : Component.configure,
		SKIP : Component.skip
	});

	// views
	langx.mixin(W,{
		FIND: views.find,
		RESET: views.reset,
		LASTMODIFICATION: views.usage,
		USAGE : views.usage,
		VERSION: Component.version,
	});

	//paths
	langx.mixin(W,{
		UNWATCH : paths.unwatch,
		WATCH : paths.watch,

		GET: paths.getx,
		GETR: paths.getr,

		SET: paths.setx,
		SET2: paths.setx2,
		SETR: paths.setr,

		TOGGLE: paths.toggle,
		TOGGLE2: paths.toggle2,

		INC: paths.inc,
		INC2: paths.inc2,

		EXTEND: paths.extend,
		EXTEND2: paths.extend2,

		MODIFY: paths.modify,
		MODIFIED : paths.modified,

		PUSH : paths.push,
		PUSH2 : paths.push2,

		UPDATE : paths.update,
		UPDATE2 : paths.update2,

		BIND: paths.bind,
		CACHEPATH : paths.cache,
		CREATE: paths.create,
		DEFAULT : paths.defaultValue,
		ERRORS : paths.errors,
		EVALUATE : parsers.evaluate,
		MAKE: paths.make,
		REWRITE : paths.rewrite,
		VALIDATE : paths.validate
	});



	// views
	langx.mixin(W,{
		FIND: views.find,
		RESET: views.reset,
		LASTMODIFICATION: views.usage,
		USAGE : views.usage,
	});

	// compiler
	langx.mixin(W,{
		BLOCKED : compiler.block
	});

	W.COMPILE = function(container) {
		clearTimeout($recompile);
		return compiler.compile(container);
	};

	var $recompile;

	W.RECOMPILE = function () { 
		$recompile && clearTimeout($recompile);
		$recompile = setTimeout(function() {
			COMPILE();
			$recompile = null;
		}, 700);
	};

	W.FREE = function(timeout) {
		langx.setTimeout2('$clean', cleaner, timeout || 10);
		return this;
	};


   /**
    * creates an object with more readable properties.
    * @param  {String} obj  
    * @param  {Function} fn A maker
    */
	W.OPT = function(obj, fn) {
		if (langx.isFunction(obj)) {
			fn = obj;
			obj = {};
		}
		fn.call(obj, function(path, value) {
			return $set2(obj, path, value);
		});
		return obj;
	};

	//- binders

	langx.mixin(W,{
		VBIND : binders.vbind,
		VBINDARRAY: binders.vbindArray
	});

//-----------------
	//plugins

	langx.mixin(W,{
		PLUGINS : plugins.registry
	});

	return W;
});
define('skylark-totaljs-jcomponent/main',[
	"./jc",
	"./binders",
	"./caches",
	"./compiler",
	"./Component",
	"./constants",
	"./cookies",
	"./defaults",
	"./domx",
	"./env",
	"./http",
	"./langx",
	"./logs",
	"./plugins",
	"./schedulers",
	"./paths",
	"./topic",
	"./transforms",
	"./Usage",
	"./validators",
	"./views",
	"./globals"
],function(jc){
	return jc;
});
define('skylark-totaljs-jcomponent', ['skylark-totaljs-jcomponent/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-totaljs-jcomponent.js.map