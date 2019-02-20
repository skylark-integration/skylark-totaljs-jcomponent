define([
	"./jc",
	"./topic",
	"./defaults"
],function(jc,topic, defaults){
	var MD = defaults;

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

	return jc.env = env;
});