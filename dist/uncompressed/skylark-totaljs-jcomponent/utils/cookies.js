define([
	"../langx"
],function(langx){

	function get (name) {
		name = name.env();
		var arr = document.cookie.split(';');
		for (var i = 0; i < arr.length; i++) {
			var c = arr[i];
			if (c.charAt(0) === ' ')
				c = c.substring(1);
			var v = c.split('=');
			if (v.length > 1 && v[0] === name)
				return v[1];
		}
		return '';
	}
	
	function set(name, value, expire) {
		var type = typeof(expire);
		if (type === 'number') {
			var date = langx.now();//W.NOW;
			date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
			expire = date;
		} else if (type === 'string') {
			expire = new Date(Date.now() + expire.parseExpire());
		}
		document.cookie = name.env() + '=' + value + '; expires=' + expire.toGMTString() + '; path=/';
	}

	function rem(name) {
		set(name.env(), '', -1);
	}

	return { // W.COOKIES = 
		get,
		set,
		rem
	};


});