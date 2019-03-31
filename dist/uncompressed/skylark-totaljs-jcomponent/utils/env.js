define([
	"../jc",
	"../topic",
	"../defaults"
],function(jc,topic, defaults){
	var MD = defaults,
		KEY_ENV = 'environment',
		REGENV = /(\[.*?\])/gi;



	var environment = MD.environment = {};

	function env (name, value) { // W.ENV

		if (langx.isObject(name)) {
			name && Object.keys(name).forEach(function(key) {
				environment[key] = name[key];
				EMIT(KEY_ENV, key, name[key]);
			});
			return name;
		}

		if (value !== undefined) {
			EMIT(KEY_ENV, name, value);
			ENV[name] = value;
			return value;
		}

		return environment[name];
	};

	SP.env = function() {
		var self = this;
		return self.replace(REGENV, function(val) {
			return ENV[val.substring(1, val.length - 1)] || val;
		});
	};

	SP.$env = function() {
		var self = this;
		var index = this.indexOf('?');
		return index === -1 ? self.env() : self.substring(0, index).env() + self.substring(index);
	};


	return jc.env = env;
});