define([
	"./jc",
	"./langx",
	"./caches"
],function(jc,langx,caches){
	var schedulers = [];
	var schedulercounter = 0;


	function clearAll(ownerId) {
		schedulers.remove('owner', ownerId);
		return this;
	}	

	// scheduler
	schedulercounter = 0;
	setInterval(function() {

		if (!schedulers.length)
			return;

		schedulercounter++;
		//var now = new Date();
		//W.DATETIME = W.NOW = now;
		var now = langx.now(true);
		for (var i = 0, length = schedulers.length; i < length; i++) {
			var item = schedulers[i];
			if (item.type === 'm') {
				if (schedulercounter % 30 !== 0)
					continue;
			} else if (item.type === 'h') {
				// 1800 seconds --> 30 minutes
				// 1800 / 2 (seconds) --> 900
				if (schedulercounter % 900 !== 0)
					continue;
			}

			var dt = now.add(item.expire);
			var arr = FIND(item.selector, true);
			for (var j = 0; j < arr.length; j++) {
				var a = arr[j];
				a && a.usage.compare(item.name, dt) && item.callback(a);
			}
		}
	}, 3500);


	function schedule(selector, name, expire, callback) { //W.SCHEDULE = 
		if (expire.substring(0, 1) !== '-')
			expire = '-' + expire;
		var arr = expire.split(' ');
		var type = arr[1].toLowerCase().substring(0, 1);
		var id = GUID(10);
		schedulers.push({ 
			id: id, 
			name: name, 
			expire: expire, 
			selector: selector, callback: callback, type: type === 'y' || type === 'd' ? 'h' : type, owner: current_owner });
		return id;
	};

	function clear(id) {  //W.CLEARSCHEDULE
		schedulers = schedulers.remove('id', id);
		return this;
	};


	return jc.schedulers = {
		clear,
		clearAll,
		schedule
	}
});