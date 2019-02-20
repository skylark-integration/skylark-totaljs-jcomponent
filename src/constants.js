define([
	"./jc"
],function(jc){
	// Constants
	return jc.constants = {
		REGCOM : /(data-jc|data-jc-url|data-jc-import|data-bind|bind):|COMPONENT\(/,
		REGENV : /(\[.*?\])/gi,
		ATTRURL : '[data-jc-url]',
		ATTRDATA : 'jc',
		ATTRDEL : 'data-jc-removed',
		ATTRREL : 'data-jc-released',
		ATTRSCOPE : 'data-jc-scope',
		SELINPUT : 'input,textarea,select',
		ACTRLS : { INPUT: true, TEXTAREA: true, SELECT: true },
		DEFMODEL : { value: null },
		OK : Object.keys,
		TYPE_FN : 'function',
		TYPE_S : 'string',
		TYPE_N : 'number',
		TYPE_O : 'object',
		KEY_ENV : 'environment'
	};
});