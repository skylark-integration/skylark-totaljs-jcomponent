define([
	"./jc",
	"./langx",
	"./utils/domx",
	"./utils/query",
	"./components/Component",
	"./components/configs",
	"./components/configure",
	"./components/extensions",
	"./components/extend",
	"./components/registry",
	"./components/register",
	"./components/Usage",
	"./components/versions"
],function(jc, langx, domx, $, Component,configs,configure,extensions,extend,registry,register,Usage,versions){


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
		"Component" : Component,
		"configs" : configs,
		"configure" : configure,
		"extensions" : extensions,
		"extend" : extend,
		"registry" : registry,
		"register" : register,
		"Usage" : Usage,
		"versions" : versions

	};

});