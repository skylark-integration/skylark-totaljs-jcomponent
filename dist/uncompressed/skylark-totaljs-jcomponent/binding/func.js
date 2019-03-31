define([
	"./pathmaker",
],function(pathmaker){

	//'PLUGIN/method_name' or '@PLUGIN.method_name'
	var REGFNPLUGIN = /[a-z0-9_-]+\/[a-z0-9_]+\(|(^|(?=[^a-z0-9]))@[a-z0-9-_]+\./i;


	var regfnplugin = function(v) {
		var l = v.length;
		return pathmaker(v.substring(0, l - 1)) + v.substring(l - 1);
	};

	function rebinddecode(val) {
		return val.replace(/&#39;/g, '\'');
	}

	function isValue(val) {
		var index = val.indexOf('value');
		return index !== -1 ? (((/\W/).test(val)) || val === 'value') : false;
	}


   /**
   * Generates Function from expression of arrow function.
   * @example var fn = func('n => n.toUpperCase()');
   *          console.log(fn('peter')); //Output: PETER
   * @param  {String} exp 
   * @return {Function} 
   */
	function func(exp, notrim) {  // W.FN = 

		exp = exp.replace(REGFNPLUGIN, regfnplugin);

		var index = exp.indexOf('=>');
		if (index === -1) {
			if (isValue(exp))  {
				// func("value.toUpperCase()") --> func("value=>value.toUpperCase()")
				// func("plugin/method(value)") --> func("value=>plugin/method(value)")
			  	return func('value=>' + rebinddecode(exp), true) 
			} else {
				// func("plugin/method(value)")
		      	return new Function('return ' + (exp.indexOf('(') === -1 ? 'typeof({0})==\'function\'?{0}.apply(this,arguments):{0}'.format(exp) : exp));
			}
		}

		var arg = exp.substring(0, index).trim();
		var val = exp.substring(index + 2).trim();
		var is = false;

		arg = arg.replace(/\(|\)|\s/g, '').trim();
		if (arg) {
			arg = arg.split(',');
		}

		if (val.charCodeAt(0) === 123 && !notrim) {  // "{"
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

	func.rebinddecode = rebinddecode;
	func.isValue = isValue;

	return func;
});