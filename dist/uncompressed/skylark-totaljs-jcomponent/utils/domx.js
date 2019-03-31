define([
	"../langx",
	"skylark-utils-dom/query",
	"../jc",
],function(langx, $, jc){
	var $devices = { 
		xs: { max: 768 }, 
		sm: { min: 768, max: 992 }, 
		md: { min: 992, max: 1200 }, 
		lg: { min: 1200 }
	};

	var REGCSS = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var REGSCRIPT = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
	var mediaqueriescounter = 0;
	var knockknockcounter = 0;

 	var mediaqueries = [];
	var $domready = false;

	var ACTRLS = { INPUT: true, TEXTAREA: true, SELECT: true };

	function inputable(el) {
		var tag = el.tagName || el;

		return ACTRLS[tag];
	}
	

	function findInstance(t, type) {

		if (!t.length) {
			return null;
		}

		for (var i = 0; i < t.length; i++) {
			if (t[i][type]) {
				return t[i][type];
			}
		}

		var el = t[0].parentElement;
		while (el !== null) {
			if (el[type]) {
				return el[type];
			}
			el = el.parentElement;
		}

		return null;
	}
	
	function mediaquery() {
		var W = window;

		if (!mediaqueries || !mediaqueries.length) {
			return;
		}

		var orientation = W.orientation ? Math.abs(W.orientation) === 90 ? 'landscape' : 'portrait' : '';

		var $w = $(W);
		var w = $w.width();
		var h = $w.height();
		var d = $devices;

		for (var i = 0, length = mediaqueries.length; i < length; i++) {
			var mq = mediaqueries[i];
			var cw = w;
			var ch = h;

			if (mq.element) {
				cw = mq.element.width();
				ch = mq.element.height();
			}

			if (mq.orientation) {
				if (!orientation && mq.orientation !== 'portrait')
					continue;
				else if (orientation !== mq.orientation)
					continue;
			}

			if (mq.minW && mq.minW >= cw) {
				continue;
			}
			if (mq.maxW && mq.maxW <= cw) {
				continue;
			}
			if (mq.minH && mq.minH >= ch) {
				continue;
			}
			if (mq.maxH && mq.maxH <= ch) {
				continue;
			}

			if (mq.oldW === cw && mq.oldH !== ch) {
				// changed height
				if (!mq.maxH && !mq.minH)
					continue;
			}

			if (mq.oldH === ch && mq.oldW !== cw) {
				// changed width
				if (!mq.maxW && !mq.minW)
					continue;
			}

			if (mq.oldW === cw && mq.oldH === ch) {
				continue;
			}

			var type = null;

			if (cw >= d.md.min && cw <= d.md.max) {
				type = 'md';
			} else if (cw >= d.sm.min && cw <= d.sm.max) {
				type = 'sm';
			} else if (cw > d.lg.min) {
				type = 'lg';
			} else if (cw <= d.xs.max) {
				type = 'xs';
			}

			mq.oldW = cw;
			mq.oldH = ch;
			mq.fn(cw, ch, type, mq.id);
		}
	}

	function inDOM(el) {
		if (!el)
			return;
		if (el.nodeName === 'BODY') {
			return true;
		}
		var parent = el.parentNode;
		while (parent) {
			if (parent.nodeName === 'BODY')
				return true;
			parent = parent.parentNode;
		}
	}

	function remove(el) {
		var dom = el[0];
		dom.$com = null;
		el.attr(ATTRDEL, true);
		el.remove();
	}

	function removescripts(str) {
		return str.replace(REGSCRIPT, function(text) {
			var index = text.indexOf('>');
			var scr = text.substring(0, index + 1);
			return scr.substring(0, 6) === '<style' || (scr.substring(0, 7) === '<script' && scr.indexOf('type="') === -1) || scr.indexOf('/javascript"') !== -1 ? '' : text;
		});
	}

	function importscripts(str) {

		var beg = -1;
		var output = str;
		var external = [];
		var scr;

		while (true) {

			beg = str.indexOf('<script', beg);
			if (beg === -1) {
				break;
			}
			var end = str.indexOf('</script>', beg + 8);
			var code = str.substring(beg, end + 9);
			beg = end + 9;
			end = code.indexOf('>');
			scr = code.substring(0, end);

			if (scr.indexOf('type=') !== -1 && scr.lastIndexOf('javascript') === -1) {
				continue;
			}

			var tmp = code.substring(end + 1, code.length - 9).trim();
			if (!tmp) {
				output = output.replace(code, '').trim();
				var eid = 'external' + langx.hashCode(code);
				if (!statics[eid]) {
					external.push(code);
					statics[eid] = true;
				}
			}
		}

		if (external.length) {
			$('head').append(external.join('\n'));
		}
		return output;
	}

	function importstyles(str, id) {
		var builder = [];

		str = str.replace(REGCSS, function(text) {
			text = text.replace('<style>', '<style type="text/css">');
			builder.push(text.substring(23, text.length - 8).trim());
			return '';
		});

		var key = 'css' + (id || '');

		if (id) {
			if (statics[key])
				$('#' + key).remove();
			else
				statics[key] = true;
		}

		builder.length && $('<style' + (id ? ' id="' + key + '"' : '') + '>{0}</style>'.format(builder.join('\n'))).appendTo('head');
		return str;
	}

	var $scrollbarWidth;
	function scrollbarWidth() { //W.SCROLLBARWIDTH = 
		var id = 'jcscrollbarwidth';
		if ($scrollbarWidth !== undefined) {
			return $scrollbarWidth;
		}
		var b = document.body;
		$(b).append('<div id="{0}" style="width{1}height{1}overflow:scroll;position:absolute;top{2}left{2}"></div>'.format(id, ':100px;', ':9999px;'));
		var el = document.getElementById(id);
		$scrollbarWidth = el.offsetWidth - el.clientWidth;
		b.removeChild(el);
		return $scrollbarWidth;
	}

   /**
   * Returns a current display size of the element. Display size can be:
   * <ul>
   *   <li>xs extra small display (mobile device)</li>
   *   <li>sm small display (tablet)</li>
   *   <li>md medium display (small laptop)</li>
   *   <li>lg large display (desktop computer, laptop)</li>
   * </ul>
   * execute CSS() twice then the previous styles will be removed.
   * @param  {String} value 
   * @param  {String} id 
   */
	function mediaWidth(el) { //W.WIDTH = 
		if (!el) {
			el = $(Window);
		}
		var w = el.width();
		var d = $devices;
		return w >= d.md.min && w <= d.md.max ? 'md' : w >= d.sm.min && w <= d.sm.max ? 'sm' : w > d.lg.min ? 'lg' : w <= d.xs.max ? 'xs' : '';
	}

   /**
   * Registers a listener for specific size of the browser window or element.
   * @param  {String} query media CSS query string 
   * @param  {jQuery Element} id 
   * @param  {Function(w, h, type, id)} fn 
   * @return {Number } an idetificator of MediaQuery
   */
	function watchMedia(query, element, fn) { //W.MEDIAQUERY = 

		if (langx.isNumber(query)) {
			mediaqueries.remove('id', query);
			return true;
		}

		if (langx.isFunction(element)) {
			fn = element;
			element = null;
		}

		query = query.toLowerCase();
		if (query.indexOf(',') !== -1) {
			var ids = [];
			query.split(',').forEach(function(q) {
				q = q.trim();
				q && ids.push(watchMedia(q, element, fn));
			});
			return ids;
		}

		var d = $devices;

		if (query === 'md') {
			query = 'min-width:{0}px and max-width:{1}px'.format(d.md.min, d.md.max);
		} else if (query === 'lg') {
			query = 'min-width:{0}px'.format(d.lg.min);
		} else if (query === 'xs') {
			query = 'max-width:{0}px'.format(d.xs.max);
		} else if (query === 'sm') {
			query = 'min-width:{0}px and max-width:{1}px'.format(d.sm.min, d.sm.max);
		}

		var arr = query.match(/(max-width|min-width|max-device-width|min-device-width|max-height|min-height|max-device-height|height|width):(\s)\d+(px|em|in)?/gi);
		var obj = {};

		var num = function(val) {
			var n = parseInt(val.match(/\d+/), 10);
			return val.match(/\d+(em)/) ? n * 16 : val.match(/\d+(in)/) ? (n * 0.010416667) >> 0 : n;
		};

		if (arr) {
			for (var i = 0, length = arr.length; i < length; i++) {
				var item = arr[i];
				var index = item.indexOf(':');
				switch (item.substring(0, index).toLowerCase().trim()) {
					case 'min-width':
					case 'min-device-width':
					case 'width':
						obj.minW = num(item);
						break;
					case 'max-width':
					case 'max-device-width':
						obj.maxW = num(item);
						break;
					case 'min-height':
					case 'min-device-height':
					case 'height':
						obj.minH = num(item);
						break;
					case 'max-height':
					case 'max-device-height':
						obj.maxH = num(item);
						break;
				}
			}
		}

		arr = query.match(/orientation:(\s)(landscape|portrait)/gi);
		if (arr) {
			for (var i = 0, length = arr.length; i < length; i++) {
				var item = arr[i];
				if (item.toLowerCase().indexOf('portrait') !== -1) {
					obj.orientation = 'portrait';
				} else {
					obj.orientation = 'landscape';
				}
			}
		}

		obj.id = mediaqueriescounter++;
		obj.fn = fn;

		if (element) {
			obj.element = element;
		}

		mediaqueries.push(obj);
		return obj.id;
	};

   /**
   * creates inline CSS registered in the head tag. If you use id and 
   * execute CSS() twice then the previous styles will be removed.
   * @param  {String} value 
   * @param  {String} id 
   */
	function style(value, id) { //W.CSS = W.STYLE = 
		if (id) {
		 $('#css' + id).remove();
		}
		$('<style type="text/css"' + (id ? ' id="css' + id + '"' : '') + '>' + (value instanceof Array ? value.join('') : value) + '</style>').appendTo('head');
	};


	function keyPress(fn, timeout, key) { // W.KEYPRESS = 
		if (!timeout) {
			timeout = 300;
		}
		var str = fn.toString();
		var beg = str.length - 20;
		if (beg < 0) {
			beg = 0;
		}
		var tkey = key ? key : langx.hashCode(str.substring(0, 20) + 'X' + str.substring(beg)) + '_keypress';
		langx.setTimeout2(tkey, fn, timeout);
	};


	//-- Waits for jQuery
	//WAIT(function() {
	//	return !!W.jQuery;
	//}, function() {

	//	setInterval(function() {
	//		temp = {};
	//		paths = {};
	//		cleaner();
	//	}, (1000 * 60) * 5);

		// scheduler



		$.fn.aclass = function(a) {
			return this.addClass(a);
		};

		$.fn.rclass = function(a) {
			return a == null ? this.removeClass() : this.removeClass(a);
		};

		$.fn.rattr = function(a) {
			return this.removeAttr(a);
		};

		$.fn.rattrd = function(a) {
			return this.removeAttr('data-' + a);
		};

		$.fn.rclass2 = function(a) {

			var self = this;
			var arr = (self.attr('class') || '').split(' ');
			var isReg = typeof(a) === TYPE_O;

			for (var i = 0, length = arr.length; i < length; i++) {
				var cls = arr[i];
				if (cls) {
					if (isReg) {
						a.test(cls) && self.rclass(cls);
					} else {
						cls.indexOf(a) !== -1 && self.rclass(cls);
					}
				}
			}

			return self;
		};

		$.fn.hclass = function(a) {
			return this.hasClass(a);
		};

		$.fn.tclass = function(a, v) {
			return this.toggleClass(a, v);
		};

		$.fn.attrd = function(a, v) {
			a = 'data-' + a;
			return v == null ? this.attr(a) : this.attr(a, v);
		};

		// Appends an SVG element
		$.fn.asvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				this.append(el);
				return $(el);
			}

			var d = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = document.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.append(f);
			return f;
		};

		$.fn.psvg = function(tag) {

			if (tag.indexOf('<') === -1) {
				var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
				this.prepend(el);
				return $(el);
			}

			var d = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + tag + '</svg>';
			var f = document.createDocumentFragment();
			while (d.firstChild.firstChild)
				f.appendChild(d.firstChild.firstChild);
			f = $(f);
			this.prepend(f);
			return f;
		};

		$.fn.rescroll = function(offset, bottom) {
			var t = this;
			t.each(function() {
				var e = this;
				var el = e;
				el.scrollIntoView(true);
				if (offset) {
					var count = 0;
					while (el && el.scrollTop == 0 && count++ < 25) {
						el = el.parentNode;
						if (el && el.scrollTop) {

							var off = el.scrollTop + offset;

							if (bottom != false) {
								if (el.scrollTop + el.getBoundingClientRect().height >= el.scrollHeight) {
									el.scrollTop = el.scrollHeight;
									return;
								}
							}

							el.scrollTop = off;
							return;
						}
					}
				}
			});
			return t;
		};

		$.components = M;

		setInterval(function() {
			//W.DATETIME = W.NOW = new Date();
			langx.now(true);
			var c = M.components;
			for (var i = 0, length = c.length; i < length; i++)
				c[i].knockknock && c[i].knockknock(knockknockcounter);
			EMIT('knockknock', knockknockcounter++);
		}, 60000);

		function resize() {
			var w = $(window);
			W.WW = w.width();
			W.WH = w.height();
			mediaquery();
		}

		resize();

		$(window).on('resize', resize);
	//}, 100);

	return jc.domx = {
		"devices" : $devices,
		"findInstance" : findInstance,
		"inDOM" : inDOM,
		"importscripts" : importscripts,
		"importstyles" : importstyles,
		"inputable" : inputable,
		"keyPress" : keyPress,
		"mediaquery" : mediaquery,
		"mediaWidth" : mediaWidth,
		"removescripts" : removescripts,
		"scrollbarWidth" : scrollbarWidth,
		"style" : style,
		"watchMedia" : watchMedia
	}

});