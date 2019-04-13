define([],function(){
	var localeCompare = window.Intl ? window.Intl.Collator().compare : function(a, b) {  // LCOMPARER
		return a.localeCompare(b);
	};

	return localeCompare;
});