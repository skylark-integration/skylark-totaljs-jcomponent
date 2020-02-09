define([
	"../langx",
	"./localStorage"
],function(langx,localStorage){
	var blocked = {},
		blocks = {};

   /**
   * Lock some code for a specific time. 
   * This method will paths info about blocks in localStorage if the expiration is longer than 10 seconds.
   * @param  {String} name   
   * @param  {Number} timeout 
   * @param  {Function} callback  
   */
	blocks.blocked = function (name, timeout, callback) { //W.BLOCKED = 
		var key = name;
		var item = blocked[key];
		var now = Date.now();

		if (item > now) {
			return true;
		}

		if (langx.isString(timeout)) {
			timeout = timeout.env().parseExpire();
		}

		var local = timeout > 10000; // MD.localstorage && timeout > 10000;
		blocked[key] = now + timeout;
		//if (!M.isPRIVATEMODE && local) { // W.isPRIVATEMODE
		  //localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));
		localStorage.set('blocked', blocked);
		//}
		callback && callback();
		return false;
	};

	blocks.load = function() {
		//clearTimeout($ready);
		//if (MD.localstorage) {
		blocked = localStorage.get('blocked');

		//M.loaded = true;  //TODO
	}

	blocks.clean = function() {
		for (var key in blocked) {
			if (blocked[key] <= now) {
				delete blocked[key];
				is2 = true;
			}
		}

		if (MD.localstorage && is2 && !M.isPRIVATEMODE)  // W.isPRIVATEMODE
			localStorage.setItem(M.$localstorage + '.blocked', JSON.stringify(blocked));
		
	}

	return blocks;

});