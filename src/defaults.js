define([
	"./jc"
],function(jc){
	var defaults =  {
		delay : 555,
		delaywatcher : 555,
		delaybinder : 200,
		localstorage : true,
		version : '',
		importcache : 'session',
		root : '' , // String or Function
		keypress : true,
		jsoncompress : false,
		dateformat : null

	};

	return jc.defaults = defaults;
});