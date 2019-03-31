define([
	"./func",
	"./pathmaker"
],function(func, pathmaker){

	/**
	 * A inline helper example:
	 * 1. Direct assignment
	 *  <div data-bind="form.name --> (value || '').toUpperCase()__html:value"></div>
	 * 2. With arrow function
	 *  <div data-bind="form.name --> n => (n || '').toUpperCase()__html:value"></div>
	 * 3. Plugins
	 *  <div data-bind="form.name --> plugin/method(value)__html:value"></div>
	 */
	function findFormat(val) {
		var a = val.indexOf('-->');
		var s = 3;

		if (a === -1) {
			a = val.indexOf('->');
			s = 2;
		}

		if (a !== -1) {
			if (val.indexOf('/') !== -1 && val.indexOf('(') === -1) {
				//plugin/method --> plugin/method(value)
				val += '(value)';
			}
		}

		if (a === -1) {
			return null;
		} else {
			return  { 
				path: val.substring(0, a).trim(), 
				fn: func(val.substring(a + s).trim()) 
			};			
		}
	}

	return findFormat;
});