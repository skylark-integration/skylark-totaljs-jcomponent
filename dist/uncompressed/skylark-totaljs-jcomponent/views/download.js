define([
	"../langx",
	"../utils/query",
	"../utils/http"
],function(langx, $, http){
	function download(view) {

		var arr = [];
		var count = 0;

		$(ATTRURL).each(function() {

			var t = this;
			var el = $(t);

			if (t.$downloaded) {
				return;
			}

			t.$downloaded = 1;
			var url = view.attrcom(el, 'url');

			// Unique
			var once = url.substring(0, 5).toLowerCase() === 'once ';
			if (url.substring(0, 1) === '!' || once) {
				if (once) {
					url = url.substring(5);
				} else {
					url = url.substring(1);
				}
				if (statics[url]) {
					return;
				}
				statics[url] = 2;
			}

			var item = {};
			item.url = url;
			item.element = el;
			item.callback = attrcom(el, 'init');
			item.path = attrcom(el, 'path');
			item.toggle = (attrcom(el, 'class') || '').split(' ');
			item.expire = attrcom(el, 'cache') || MD.importcache;
			arr.push(item);
		});

		if (!arr.length) {
			return;
		}

		var canCompile = false;
		view.importing++;

		langx.async(arr, function(item, next) {

			var key = makeurl(item.url);
			var can = false;

			http.ajaxCache('GET ' + item.url, null, function(response) {

				key = '$import' + key;

				caches.current.element = item.element[0];

				if (statics[key]) {
					response = removescripts(response);
				} else {
					response = importscripts(importstyles(response));
				}

				can = response && REGCOM.test(response);

				if (can) {
					canCompile = true;
				}

				item.element.html(response);
				statics[key] = true;
				item.toggle.length && item.toggle[0] && toggles.push(item);

				if (item.callback && !attrcom(item.element)) {
					var callback = get(item.callback);
					typeof(callback) === TYPE_FN && callback(item.element);
				}

				caches.current.element = null;
				count++;
				next();

			}, item.expire);

		}, function() {
			view.importing--;
			clear('valid', 'dirty', 'find');
			if (count && canCompile){
				view.compile();
			}
		});
	}

	
});