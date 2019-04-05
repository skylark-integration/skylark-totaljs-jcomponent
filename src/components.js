define([
	"./jc",
	"./langx",
	"./utils/domx",
	"./utils/query",
	"./utils/cache",
	"./components/Component",
	"./components/configs",
	"./components/configure",
	"./components/extensions",
	"./components/extend",
	"./components/registry",
	"./components/register",
	"./components/Usage"
],function(jc, langx, domx, $, cache, Component,configs,configure,extensions,extend,registry,register,Usage){
	var M = jc;

	var components = Component.components = [];
	var versions = {};

//	var components = {};

//	M.$components = {};
//	M.components = [];


	// ===============================================================
	// PRIVATE FUNCTIONS
	// ===============================================================


    function exechelper(ctx, path, arg) {
		setTimeout(function() {
			EXEC.call(ctx, true, path, arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6]);
		}, 200);
	}


	// ===============================================================
	// Query Extendtion
	// ===============================================================


	$.fn.component = function() {
		return domx.findInstance(this, '$com');
	};

	$.fn.components = function(fn) {
		//var all = this.find(ATTRCOM);
		var all = helper.nested(this);
		var output = null;
		//all.each(function(index) {
		all.forEach(function(com){
			//var com = this.$com;
			//if (com) {
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
			//}
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


    function get(name) {
        return types[name];
    }

    /**
     * Returns true/false if the specified type exists or not.
     *
     * @method has
     * @param {String} type Type to look for.
     * @return {Boolean} true/false if the control by name exists.
     */
     function has(name) {
        return !!types[name.toLowerCase()];
    }




	return jc.components = {
		cleaner,
		cleaner2,
		each,
		find,
		refresh,
		reset,
		setter,
		usage,
		version

	};

});