define([
	"../langx",
	"../jc",
],function(langx, jc){
	var topic = langx.topic;

	var KEY_ENV = 'skylark.vmm.env',
		REGENV = /(\[.*?\])/gi;

	// The follow code is not used?
	//M.environment = function(name, version, language, env) {
	//	M.$localstorage = name;
	//	M.$version = version || '';
	//	M.$language = language || '';
	//	env && ENV(env);
	//	return M;
	//};



	//var environment = MD.environment = {};
	var vars = {};

	function env (name, value) { // W.ENV

		if (langx.isObject(name)) {
			name && Object.keys(name).forEach(function(key) {
				vars[key] = name[key];
				topic.publish(KEY_ENV, key, name[key]);  // EMIT
			});
			return name;
		}

		if (value !== undefined) {
			topic.publish(KEY_ENV, name, value); // EMIT
			//ENV[name] = value;
			return value;
		}

		return vars[name];
	};


	/*
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
	*/

	return jc.env = env;
});