define([
	"../langx",
	"../utils/query",
	"./parse"
],function(langx, $, parsebinder){
	var ATTRBIND = '[data-bind],[bind],[data-vbind]';
	
	function VBinder(html) {
		var t = this;
		var e = t.element = $(html);
		t.binders = [];
		var fn = function() {
			var dom = this;
			var el = $(dom);
			var b = el.attrd('bind') || el.attr('bind') || el.attrd('vbind');
			dom.$jcbind = parsebinder(dom, b, langx.empties.array); //EMPTYARRAY);
			if(dom.$jcbind) {
			   t.binders.push(dom.$jcbind);
			}
		};
		e.filter(ATTRBIND).each(fn);
		e.find(ATTRBIND).each(fn);
	}

	var VBP = VBinder.prototype;

	VBP.on = function() {
		var t = this;
		t.element.on.apply(t.element, arguments);
		return t;
	};

	VBP.remove = function() {
		var t = this;
		var e = t.element;
		e.find('*').off();
		e.off().remove();
		t.element = null;
		t.binders = null;
		t = null;
		return t;
	};

	VBP.set = function(path, model) {

		var t = this;

		if (model == null) {
			model = path;
			path = '';
		}

		for (var i = 0; i < t.binders.length; i++) {
			var b = t.binders[i];
			if (!path || path === b.path) {
				var val = path || !b.path ? model : $get(b.path, model);
				t.binders[i].exec(val, b.path);
			}
		}

		return t;
	};

	return VBinder;

});

