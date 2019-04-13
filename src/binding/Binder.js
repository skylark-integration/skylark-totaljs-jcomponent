define([
	"../utils/query",
	"../utils/http",
	"../langx"
],function($, langx){

	var DEFMODEL = { value: null };
	/*
	 * A binder declaration:
	 * <div data-bind="path.to.property__command1:exp__command2:exp__commandN:exp"></div>
	 */
	function jBinder() {
		//this.path = null;
		//this.format = null;
		//this.virtual = null;
		//this.com = null; 
		//this.child = null;

	}

	var JBP = jBinder.prototype;

	JBP.exec = function(value, path, index, wakeup, can) {

		var item = this;
		var el = item.el;
		if (index != null) {
			if (item.child == null)
				return;
			item = item.child[index];
			if (item == null) {
				return;
			}
		}

		if (item.notnull && value == null) {
			return;
		}

		if (item.selector) {
			if (item.cache) {
				el = item.cache;
			} else {
				el = el.find(item.selector);
				if (el.length) {
					item.cache = el;
				}
			}
		}

		if (!el.length) {
			return;
		}

		if (!wakeup && item.delay) {
			item.$delay && clearTimeout(item.$delay);
			item.$delay = setTimeout(function(obj, value, path, index, can) {
				obj.$delay = null;
				obj.exec(value, path, index, true, can);
			}, item.delay, item, value, path, index, can);
			return;
		}

		if (item.init) {
			if (item.strict && item.path !== path)
				return;
			if (item.track && item.path !== path) {
				var can = false;
				for (var i = 0; i < item.track.length; i++) {
					if (item.track[i] === path) {
						can = true;
						break;
					}
				}
				if (!can) {
					return;
				}
			}
		} else {
			item.init = 1;
		}

		if (item.def && value == null) {
			value = item.def;
		}

		if (item.format) {
			value = item.format(value, path);
		}

		var tmp = null;

		can = can !== false;

		if (item.show && (value != null || !item.show.$nn)) {
			tmp = item.show.call(item.el, value, path, item.el);
			el.tclass('hidden', !tmp);
			if (!tmp) {
				can = false;
			}
		}

		if (item.hide && (value != null || !item.hide.$nn)) {
			tmp = item.hide.call(el, value, path, el);
			el.tclass('hidden', tmp);
			if (tmp) {
				can = false;
			}
		}

		if (item.invisible && (value != null || !item.invisible.$nn)) {
			tmp = item.invisible.call(item.el, value, path, item.el);
			el.tclass('invisible', tmp);
			if (!tmp) {
				can = false;
			}
		}

		if (item.visible && (value != null || !item.visible.$nn)) {
			tmp = item.visible.call(item.el, value, path, item.el);
			el.tclass('invisible', !tmp);
			if (!tmp) {
				can = false;
			}
		}

		if (item.classes) {
			for (var i = 0; i < item.classes.length; i++) {
				var cls = item.classes[i];
				if (!cls.fn.$nn || value != null)
					el.tclass(cls.name, !!cls.fn.call(el, value, path, el));
			}
		}

		if (can && item.import) {
			if (langx.isFunction(item.import)) {
				if (value) {
					!item.$ic && (item.$ic = {});
					!item.$ic[value] && http.import('ONCE ' + value, el); //IMPORT
					item.$ic[value] = 1;
				}
			} else {
				http.import(item.import, el); //IMPORT
				delete item.import;
			}
		}

		if (item.config && (can || item.config.$nv)) {
			if (value != null || !item.config.$nn) {
				tmp = item.config.call(el, value, path, el);
				if (tmp) {
					for (var i = 0; i < el.length; i++) {
						var c = el[i].$com;
						c && c.$ready && c.reconfigure(tmp);
					}
				}
			}
		}

		if (item.html && (can || item.html.$nv)) {
			if (value != null || !item.html.$nn) {
				tmp = item.html.call(el, value, path, el);
				el.html(tmp == null ? (item.htmlbk || '') : tmp);
			} else
				el.html(item.htmlbk || '');
		}

		if (item.text && (can || item.text.$nv)) {
			if (value != null || !item.text.$nn) {
				tmp = item.text.call(el, value, path, el);
				el.text(tmp == null ? (item.htmlbk || '') : tmp);
			} else
				el.html(item.htmlbk || '');
		}

		if (item.val && (can || item.val.$nv)) {
			if (value != null || !item.val.$nn) {
				tmp = item.val.call(el, value, path, el);
				el.val(tmp == null ? (item.valbk || '') : tmp);
			} else
				el.val(item.valbk || '');
		}

		if (item.template && (can || item.template.$nv) && (value != null || !item.template.$nn)) {
			DEFMODEL.value = value;
			DEFMODEL.path = path;
			el.html(item.template(DEFMODEL));
		}

		if (item.disabled && (can || item.disabled.$nv)) {
			if (value != null || !item.disabled.$nn) {
				tmp = item.disabled.call(el, value, path, el);
				el.prop('disabled', tmp == true);
			} else
				el.prop('disabled', item.disabledbk == true);
		}

		if (item.enabled && (can || item.enabled.$nv)) {
			if (value != null || !item.enabled.$nn) {
				tmp = item.enabled.call(el, value, path, el);
				el.prop('disabled', !tmp);
			} else {
				el.prop('disabled', item.enabledbk == false);
			}
		}

		if (item.checked && (can || item.checked.$nv)) {
			if (value != null || !item.checked.$nn) {
				tmp = item.checked.call(el, value, path, el);
				el.prop('checked', tmp == true);
			} else {
				el.prop('checked', item.checkedbk == true);
			}
		}

		if (item.title && (can || item.title.$nv)) {
			if (value != null || !item.title.$nn) {
				tmp = item.title.call(el, value, path, el);
				el.attr('title', tmp == null ? (item.titlebk || '') : tmp);
			} else {
				el.attr('title', item.titlebk || '');
			}
		}

		if (item.href && (can || item.href.$nv)) {
			if (value != null || !item.href.$nn) {
				tmp = item.href.call(el, value, path, el);
				el.attr('href', tmp == null ? (item.hrefbk || '') : tmp);
			} else {
				el.attr(item.hrefbk || '');
			}
		}

		if (item.src && (can || item.src.$nv)) {
			if (value != null || !item.src.$nn) {
				tmp = item.src.call(el, value, path, el);
				el.attr('src', tmp == null ? (item.srcbk || '') : tmp);
			} else {
				el.attr('src', item.srcbk || '');
			}
		}

		if (item.setter && (can || item.setter.$nv) && (value != null || !item.setter.$nn))
			item.setter.call(el, value, path, el);

		if (item.change && (value != null || !item.change.$nn)) {
			item.change.call(el, value, path, el);
		}

		if (can && index == null && item.child) {
			for (var i = 0; i < item.child.length; i++)
				item.exec(value, path, i, undefined, can);
		}

		if (item.tclass) {
			el.tclass(item.tclass);
			delete item.tclass;
		}
	};

	return jBinder;
});