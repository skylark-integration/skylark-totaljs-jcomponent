define([
	"./jc"
],function(jc){
	var defaults =  {
		scope : Window,
		delay : 555,
		delaywatcher : 555,
		delaybinder : 200,
		fallback : 'https://cdn.componentator.com/j-{0}.html',
		fallbackcache : '',
		localstorage : true,
		version : '',
		importcache : 'session',
		root : '' , // String or Function
		keypress : true,
		jsoncompress : false,
		thousandsseparator : ' ',
		decimalseparator : '.',
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