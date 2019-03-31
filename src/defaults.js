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

	try {
		var pmk = 'jc.test';
		Window.localStorage.setItem(pmk, '1');
		defaults.isPRIVATEMODE = Window.localStorage.getItem(pmk) !== '1'; //W.isPRIVATEMODE
		Window.localStorage.removeItem(pmk);
	} catch (e) {
		defaults.isPRIVATEMODE = true; //W.isPRIVATEMODE
	}
	
	return jc.defaults = defaults;
});