define([
	"../stores",
	"./pathmaker",
],function(stores,pathmaker){

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
		path = path.replaceWildcard();
		if(path){
			stores.set(path, stores.get(path), true);	
		} 
	}

	return bind;
});
