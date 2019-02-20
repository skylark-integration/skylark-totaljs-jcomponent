define([],function(){
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