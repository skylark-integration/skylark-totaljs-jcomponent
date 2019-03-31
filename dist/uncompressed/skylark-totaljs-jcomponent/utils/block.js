define([
	"../stores/localStorage"
],function(localStorage){
	var blocked = {};

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
		  //localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));
		  localStorage.set('blocked', blocked);
		}
		callback && callback();
		return false;
	};

	function load() {
		clearTimeout($ready);
		if (MD.localstorage) {
			var cache;
			try {
				cache = localStorage.getItem(M.$localstorage + '.blocked');
				if (cache && langx.isString(cache)) {
					blocked = langx.parse(cache);  // PARSE
				}
			} catch (e) {}
		}

		M.loaded = true;
	}


});