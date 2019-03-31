define([
	"../utils/domx",
	"../utils/query",
	"../components/Component",
	"./vbind"
],function(domx,$,Component,vbind){
	function vbindArray(html, el) { //W.VBINDARRAY = 
		var obj = {};
		obj.html = html;
		obj.items = [];
		obj.element = el instanceof Component ? el.element : $(el);
		obj.element[0].$vbindarray = obj;
		obj.remove = function() {
			for (var i = 0; i < obj.items.length; i++) {
				obj.items[i].remove();
			}
			obj.checksum = null;
			obj.items = null;
			obj.html = null;
			obj.element = null;
		};

		var serialize = function(val) {
			switch (typeof(val)) {
				case 'number':
					return val + '';
				case 'boolean':
					return val ? '1' : '0';
				case 'string':
					return val;
				default:
					return val == null ? '' : val instanceof Date ? val.getTime() : JSON.stringify(val);
			}
		};

		var checksum = function(item) {
			var sum = 0;
			var binder = obj.items[0];
			if (binder) {
				for (var j = 0; j < binder.binders.length; j++) {
					var b = binder.binders[j];
					var p = b.path;
					if (b.track) {
						for (var i = 0; i < b.track.length; i++)
							sum += serialize($get((p ? (p + '.') : '') + b.track[i].substring(1), item));
					} else
						sum += serialize(p ? $get(p, item) : item);
				}
			}
			return HASH(sum);
		};

		obj.set = function(index, value) {

			var sum = null;

			if (!(index instanceof Array)) {
				var item = obj.items[index];
				if (item) {
					sum = checksum(value);
					var el = item.element[0];
					if (el.$bchecksum !== sum) {
						el.$bchecksum = sum;
						item.set(value);
					}
				}
				return obj;
			}

			value = index;

			if (obj.items.length > value.length) {
				var rem = obj.items.splice(value.length);
				for (var i = 0; i < rem.length; i++)
					rem[i].remove();
			}

			for (var i = 0; i < value.length; i++) {
				var val = value[i];
				var item = obj.items[i];

				if (!item) {
					item = vbind(obj.html); //VBIND
					obj.items.push(item);
					item.element.attrd('index', i);
					item.element[0].$vbind = item;
					item.index = i;
					obj.element.append(item.element);
				}

				var el = item.element[0];
				sum = checksum(val);

				if (el.$bchecksum !== sum) {
					el.$bchecksum = sum;
					item.set(val);
				}
			}
		};

		return obj;
	};

	$.fn.vbindarray = function() {
		return domx.findinstance(this, '$vbindarray');
	};


	return vbindArray;
});
