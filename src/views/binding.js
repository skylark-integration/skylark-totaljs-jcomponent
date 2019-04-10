define([
	"../utils/domx",
	"../binding/parse"
],function(domx, parsebinder){
	function binding(view) {
		var binders = [];
 		//function parsebinder(el, b, scopes,

		function parse(el,b,scopes) {
			return parsebinder(el,b,scopes,{
				"binders" : binders
			});
		}

		function binder(el) {
			return el.$jcbind; 
		}

		function clean() {
			keys = Object.keys(binders);
			for (var i = 0; i < keys.length; i++) {
				arr = binders[keys[i]];
				var j = 0;
				while (true) {
					var o = arr[j++];
					if (!o)
						break;
					if (domx.inDOM(o.el[0])) {
						continue;
					}
					var e = o.el;
					if (!e[0].$br) {
						e.off();
						e.find('*').off();
						e[0].$br = 1;
					}
					j--;
					arr.splice(j, 1);
				}
				if (!arr.length) {
					delete binders[keys[i]];
				}
			}

		}

		return {
			"parse" : parse,
			"binder" : binder,
			"clean" : clean
		}

	}

	return binding;
});