define([
	"../utils/domx",
	"../binding/parse",
	"../binding/pathmaker"
],function(domx, parsebinder,pathmaker){
	function binding(view) {
		var binders = [];
		var bindersnew = [];

 		//function parsebinder(el, b, scopes,

		function parse(el,b,scopes) {
			return parsebinder(el,b,scopes,{
				"binders" : binders,
				"bindersnew" : bindersnew
			});
		}

		function binder(el) {
			return el.$jcbind; 
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
							item.exec(view.storing.get(item.path), item.path);  // GET
						}
					}
				}
			}, 50);
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
			"pathmaker" : pathmaker,
			"binder" : binder,
			"rebindbinder" : rebindbinder,
			"clean" : clean
		}

	}

	return binding;
});