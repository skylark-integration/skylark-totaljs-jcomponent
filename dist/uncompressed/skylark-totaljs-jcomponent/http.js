define([
	"./jc",
	"./langx",
	"./topic",
	"./caches",
	"./storages"
],function(jc,langx,topic,caches,storages){
	var ajaxconfig = {};
	var defaults = {

	};
	defaults.ajaxerrors = false;
	defaults.pingdata = {};
	defaults.baseurl = ''; // String or Function
	defaults.makeurl = null; // Function
	defaults.delayrepeat = 2000;
	defaults.jsondate = true;
	defaults.jsonconverter = {
		'text json': function(text) {
			return PARSE(text);
		}
	};
	defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' };

	function parseHeaders(val) {
		var h = {};
		val.split('\n').forEach(function(line) {
			var index = line.indexOf(':');
			if (index !== -1) {
				h[line.substring(0, index).toLowerCase()] = line.substring(index + 1).trim();
			}
		});
		return h;
	}

	function cacherest(method, url, params, value, expire) {

		if (params && !params.version && M.$version)
			params.version = M.$version;

		if (params && !params.language && M.$language)
			params.language = M.$language;

		params = langx.stringify(params);
		var key = langx.hashCode(method + '#' + url.replace(/\//g, '') + params).toString();
		return storages.set(key, value, expire);
	}
	
	function makeurl(url, make) {

		defaults.makeurl && (url = defaults.makeurl(url));

		if (make)
			return url;

		var builder = [];
		var en = encodeURIComponent;

		M.$version && builder.push('version=' + en(M.$version));
		M.$language && builder.push('language=' + en(M.$language));

		if (!builder.length)
			return url;

		var index = url.indexOf('?');
		if (index == -1)
			url += '?';
		else
			url += '&';

		return url + builder.join('&');
	}

	function makeParams(url, values, type) { //W.MAKEPARAMS = 

		var l = location;

		if (typeof(url) === TYPE_O) {
			type = values;
			values = url;
			url = l.pathname + l.search;
		}

		var query;
		var index = url.indexOf('?');
		if (index !== -1) {
			query = M.parseQuery(url.substring(index + 1));
			url = url.substring(0, index);
		} else
			query = {};

		var keys = Object.keys(values);

		for (var i = 0, length = keys.length; i < length; i++) {
			var key = keys[i];
			query[key] = values[key];
		}

		var val = $.param(query, type == null || type === true);
		return url + (val ? '?' + val : '');
	}

	function upload(url, data, callback, timeout, progress) { //W.UPLOAD = 

		if (!langx.isNumber(timeout) && progress == null) {
			progress = timeout;
			timeout = null;
		}

		if (!url)
			url = location.pathname;

		var method = 'POST';
		var index = url.indexOf(' ');
		var tmp = null;

		if (index !== -1)
			method = url.substring(0, index).toUpperCase();

		var isCredentials = method.substring(0, 1) === '!';
		if (isCredentials)
			method = method.substring(1);

		var headers = {};
		tmp = url.match(/\{.*?\}/g);

		if (tmp) {
			url = url.replace(tmp, '').replace(/\s{2,}/g, ' ');
			tmp = (new Function('return ' + tmp))();
			if (typeof(tmp) === TYPE_O)
				headers = tmp;
		}

		url = url.substring(index).trim().$env();

		if (typeof(callback) === TYPE_N) {
			timeout = callback;
			callback = undefined;
		}

		var output = {};
		output.url = url;
		output.process = true;
		output.error = false;
		output.upload = true;
		output.method = method;
		output.data = data;

		topic.emit('request', output);

		if (output.cancel)
			return;

		setTimeout(function() {

			var xhr = new XMLHttpRequest();

			if (isCredentials) {
				xhr.withCredentials = true;
			}

			xhr.addEventListener('load', function() {

				var self = this;
				var r = self.responseText;
				try {
					r = PARSE(r, defaults.jsondate);
				} catch (e) {}

				if (progress) {
					if (typeof(progress) === TYPE_S)
						remap(progress, 100);
					else
						progress(100);
				}

				output.response = r;
				output.status = self.status;
				output.text = self.statusText;
				output.error = self.status > 399;
				output.headers = parseHeaders(self.getAllResponseHeaders());

				topic.emit('response', output);

				if (!output.process || output.cancel)
					return;

				if (!r && output.error)
					r = output.response = self.status + ': ' + self.statusText;

				if (!output.error || defaults.ajaxerrors) {
					typeof(callback) === TYPE_S ? remap(callback.env(), r) : (callback && callback(r, null, output));
				} else {
					topic.emit('error', output);
					output.process && typeof(callback) === TYPE_FN && callback({}, r, output);
				}

			}, false);

			xhr.upload.onprogress = function(evt) {
				if (!progress)
					return;
				var percentage = 0;
				if (evt.lengthComputable)
					percentage = Math.round(evt.loaded * 100 / evt.total);
				if (langx.isString(progress)) {
					remap(progress.env(), percentage);
				} else {
					progress(percentage, evt.transferSpeed, evt.timeRemaining);
				}
			};

			xhr.open(method, makeurl(output.url));

			var keys = Object.keys(defaults.headers);
			for (var i = 0; i < keys.length; i++) {
				xhr.setRequestHeader(keys[i].env(), defaults.headers[keys[i]].env());
			}

			if (headers) {
				var keys = Object.keys(headers);
				for (var i = 0; i < keys.length; i++) {
					xhr.setRequestHeader(keys[i], headers[keys[i]]);
				}
			}

			xhr.send(data);

		}, timeout || 0);

		return W;
	}


	function importCache(url, expire, target, callback, insert, preparator) { // W.IMPORTCACHE = 

		var w;

		url = url.$env().replace(/<.*?>/, function(text) {
			w = text.substring(1, text.length - 1).trim();
			return '';
		}).trim();

		// unique
		var first = url.substring(0, 1);
		var once = url.substring(0, 5).toLowerCase() === 'once ';

		if (langx.isFunction(target)) {

			if (langx.isFunction(callback)) {
				preparator = callback;
				insert = true;
			} else if (typeof(insert) === TYPE_FN) {
				preparator = insert;
				insert = true;
			}

			callback = target;
			target = 'body';
		} else if (langx.isFunction(insert)) {
			preparator = insert;
			insert = true;
		}

		if (w) {

			var wf = w.substring(w.length - 2) === '()';
			if (wf) {
				w = w.substring(0, w.length - 2);
			}

			var wo = GET(w);
			if (wf && langx.isFunction(wo)) {
				if (wo()) {
					callback && callback(0);
					return;
				}
			} else if (wo) {
				callback && callback(0);
				return;
			}
		}

		if (url.substring(0, 2) === '//')
			url = location.protocol + url;

		var index = url.lastIndexOf(' .');
		var ext = '';

		if (index !== -1) {
			ext = url.substring(index).trim().toLowerCase();
			url = url.substring(0, index).trim();
		}

		if (first === '!' || once) {

			if (once) {
				url = url.substring(5);
			} else {
				url = url.substring(1);
			}

			if (statics[url]) {
				if (callback) {
					if (statics[url] === 2)
						callback(0);
					else {
						langx.wait(function() {
							return statics[url] === 2;
						}, function() {
							callback(0);
						});
					}
				}
				return W;
			}

			statics[url] = 1;
		}

		if (target && target.setPath)
			target = target.element;

		if (!target)
			target = 'body';

		if (!ext) {
			index = url.lastIndexOf('?');
			if (index !== -1) {
				var index2 = url.lastIndexOf('.', index);
				if (index2 !== -1) {
					ext = url.substring(index2, index).toLowerCase();
				}
			} else {
				index = url.lastIndexOf('.');
				if (index !== -1) {
					ext = url.substring(index).toLowerCase();
				}
			}
		}

		var d = document;
		if (ext === '.js') {
			var scr = d.createElement('script');
			scr.type = 'text/javascript';
			scr.async = false;
			scr.onload = function() {
				statics[url] = 2;
				callback && callback(1);
				setTimeout(compile, 300);//W.jQuery && 
			};
			scr.src = makeurl(url, true);
			d.getElementsByTagName('head')[0].appendChild(scr);
			topic.emit('import', url, $(scr));
			return this;
		}

		if (ext === '.css') {
			var stl = d.createElement('link');
			stl.type = 'text/css';
			stl.rel = 'stylesheet';
			stl.href = makeurl(url, true);
			d.getElementsByTagName('head')[0].appendChild(stl);
			statics[url] = 2;
			callback && setTimeout(callback, 200, 1);
			topic.emit('import', url, $(stl));
			return this;
		}

		langx.wait(function() {
			return !!W.jQuery;
		}, function() {

			statics[url] = 2;
			var id = 'import' + HASH(url);

			var cb = function(response, code, output) {

				if (!response) {
					callback && callback(0);
					return;
				}

				url = '$import' + url;

				if (preparator)
					response = preparator(response, output);

				var is = REGCOM.test(response);
				response = importscripts(importstyles(response, id)).trim();
				target = $(target);

				if (response) {
					caches.current.element = target[0];
					if (insert === false) {
						target.html(response);
					} else {
						target.append(response);
					}
					caches.current.element = null;
				}

				setTimeout(function() {
					// is && compile(response ? target : null);
					// because of paths
					is && compile();
					callback && langx.wait(function() {
						return C.is == false;
					}, function() {
						callback(1);
					});
					topic.emit('import', url, target);
				}, 10);
			};

			if (expire) {
				ajaxCache('GET ' + url, null, cb, expire);
			}else {
				ajax('GET ' + url, cb);
			}
		});

		return W;
	}

	function import2(url, target, callback, insert, preparator) { //W.IMPORT = M.import = 
		if (url instanceof Array) {

			if (langx.isFunction(target)) {
				preparator = insert;
				insert = callback;
				callback = target;
				target = null;
			}

			url.wait(function(url, next) {
				importCache(url, null, target, next, insert, preparator);
			}, function() {
				callback && callback();
			});
		} else {
			importCache(url, null, target, callback, insert, preparator);
		}

		return this;
	}

	function uptodate(period, url, callback, condition) { // W.UPTODATE = 

		if (langx.isFunction(url)) {
			condition = callback;
			callback = url;
			url = '';
		}

		var dt = new Date().add(period);
		topic.on('knockknock', function() {
			if (dt > langx.now()) //W.NOW)
				return;
			if (!condition || !condition())
				return;
			var id = setTimeout(function() {
				var l = window.location;
				if (url)
					l.href = url.$env();
				else
					l.reload(true);
			}, 5000);
			callback && callback(id);
		});
	}

	function ping(url, timeout, execute) { // W.PING = 

		if (navigator.onLine != null && !navigator.onLine)
			return;

		if (typeof(timeout) === 'boolean') {
			execute = timeout;
			timeout = 0;
		}

		url = url.$env();

		var index = url.indexOf(' ');
		var method = 'GET';

		if (index !== -1) {
			method = url.substring(0, index).toUpperCase();
			url = url.substring(index).trim();
		}

		var options = {};
		var data = $.param(defaults.pingdata);

		if (data) {
			index = url.lastIndexOf('?');
			if (index === -1)
				url += '?' + data;
			else
				url += '&' + data;
		}

		options.type = method;
		options.headers = { 'x-ping': location.pathname, 'x-cookies': navigator.cookieEnabled ? '1' : '0', 'x-referrer': document.referrer };

		options.success = function(r) {
			if (r) {
				try {
					(new Function(r))();
				} catch (e) {}
			}
		};

		execute && $.ajax(makeurl(url), options);

		return setInterval(function() {
			$.ajax(makeurl(url), options);
		}, timeout || 30000);
	}

	function parseQuery(value) { //M.parseQuery = W.READPARAMS = 

		if (!value)
			value = location.search;

		if (!value)
			return {};

		var index = value.indexOf('?');
		if (index !== -1)
			value = value.substring(index + 1);

		var arr = value.split('&');
		var obj = {};
		for (var i = 0, length = arr.length; i < length; i++) {
			var sub = arr[i].split('=');
			var key = sub[0];
			var val = decodeURIComponent((sub[1] || '').replace(/\+/g, '%20'));

			if (!obj[key]) {
				obj[key] = val;
				continue;
			}

			if (!(obj[key] instanceof Array))
				obj[key] = [obj[key]];
			obj[key].push(val);
		}
		return obj;
	}

	function configure(name, fn) {  // W.AJAXCONFIG = 
		ajaxconfig[name] = fn;  
		return this;
	}

	function ajax(url, data, callback, timeout) { // W.AJAX = 

		if (typeof(url) === TYPE_FN) {
			timeout = callback;
			callback = data;
			data = url;
			url = location.pathname;
		}

		var td = typeof(data);
		var arg = EMPTYARRAY;
		var tmp;

		if (!callback && (td === TYPE_FN || td === TYPE_S)) {
			timeout = callback;
			callback = data;
			data = undefined;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return W;

		var repeat = false;

		url = url.replace(/\srepeat/i, function() {
			repeat = true;
			return '';
		});

		if (repeat)
			arg = [url, data, callback, timeout];

		var method = url.substring(0, index).toUpperCase();
		var isCredentials = method.substring(0, 1) === '!';
		if (isCredentials)
			method = method.substring(1);

		var headers = {};
		tmp = url.match(/\{.*?\}/g);

		if (tmp) {
			url = url.replace(tmp, '').replace(/\s{2,}/g, ' ');
			tmp = (new Function('return ' + tmp))();
			if (typeof(tmp) === TYPE_O)
				headers = tmp;
		}

		url = url.substring(index).trim().$env();

		setTimeout(function() {

			if (method === 'GET' && data) {
				var qs = (typeof(data) === TYPE_S ? data : jQuery.param(data, true));
				if (qs)
					url += '?' + qs;
			}

			var options = {};
			options.method = method;
			options.converters = defaults.jsonconverter;

			if (method !== 'GET') {
				if (typeof(data) === TYPE_S) {
					options.data = data;
				} else {
					options.contentType = 'application/json; charset=utf-8';
					options.data = STRINGIFY(data);
				}
			}

			options.headers = $.extend(headers, defaults.headers);

			if (url.match(/http:\/\/|https:\/\//i)) {
				options.crossDomain = true;
				delete options.headers['X-Requested-With'];
				if (isCredentials)
					options.xhrFields = { withCredentials: true };
			} else
				url = url.ROOT();

			var custom = url.match(/\([a-z0-9\-.,]+\)/i);
			if (custom) {
				url = url.replace(custom, '').replace(/\s+/g, '');
				options.url = url;
				custom = custom.toString().replace(/\(|\)/g, '').split(',');
				for (var i = 0; i < custom.length; i++) {
					var opt = ajaxconfig[custom[i].trim()];
					opt && opt(options);
				}
			}

			if (!options.url)
				options.url = url;

			topic.emit('request', options);

			if (options.cancel)
				return;

			options.type = options.method;
			delete options.method;

			var output = {};
			output.url = options.url;
			output.process = true;
			output.error = false;
			output.upload = false;
			output.method = method;
			output.data = data;

			delete options.url;

			options.success = function(r, s, req) {
				output.response = r;
				output.status = req.status || 999;
				output.text = s;
				output.headers = parseHeaders(req.getAllResponseHeaders());
				topic.emit('response', output);
				if (output.process && !output.cancel) {
					if (typeof(callback) === TYPE_S)
						remap(callback, output.response);
					else
						callback && callback.call(output, output.response, undefined, output);
				}
			};

			options.error = function(req, s) {

				var code = req.status;

				if (repeat && (!code || code === 408 || code === 502 || code === 503 || code === 504 || code === 509)) {
					// internal error
					// internet doesn't work
					setTimeout(function() {
						arg[0] += ' REPEAT';
						W.AJAX.apply(M, arg);
					}, defaults.delayrepeat);
					return;
				}

				output.response = req.responseText;
				output.status = code || 999;
				output.text = s;
				output.error = true;
				output.headers = parseHeaders(req.getAllResponseHeaders());
				var ct = output.headers['content-type'];

				if (ct && ct.indexOf('/json') !== -1) {
					try {
						output.response = PARSE(output.response, defaults.jsondate);
					} catch (e) {}
				}

				topic.emit('response', output);

				if (output.cancel || !output.process)
					return;

				if (defaults.ajaxerrors) {
					if (typeof(callback) === TYPE_S)
						remap(callback, output.response);
					else
						callback && callback.call(output, output.response, output.status, output);
				} else {
					topic.emit('error', output);
					typeof(callback) === TYPE_FN && callback.call(output, output.response, output.status, output);
				}
			};

			$.ajax(makeurl(output.url), options);

		}, timeout || 0);

		return this;
	}

	function ajaxCacheReview(url, data, callback, expire, timeout, clear) { //W.AJAXCACHEREVIEW = 
		return ajaxCache(url, data, callback, expire, timeout, clear, true);
	}

	function ajaxCache(url, data, callback, expire, timeout, clear, review) { //W.AJAXCACHE = 

		var tdata = typeof(data);

		if (tdata === TYPE_FN || (tdata === TYPE_S && typeof(callback) === TYPE_S && typeof(expire) !== TYPE_S)) {
			clear = timeout;
			timeout = expire;
			expire = callback;
			callback = data;
			data = null;
		}

		if (typeof(timeout) === 'boolean') {
			clear = timeout === true;
			timeout = 0;
		}

		var index = url.indexOf(' ');
		if (index === -1)
			return W;

		var method = url.substring(0, index).toUpperCase();
		var uri = url.substring(index).trim().$env();

		setTimeout(function() {
			var value = clear ? undefined : cacherest(method, uri, data, undefined, expire);
			if (value !== undefined) {

				var diff = review ? STRINGIFY(value) : null;

				if (typeof(callback) === TYPE_S)
					remap(callback, value);
				else
					callback(value, true);

				if (!review)
					return;

				ajax(url, data, function(r, err) {
					if (err)
						r = err;
					// Is same?
					if (diff !== STRINGIFY(r)) {
						cacherest(method, uri, data, r, expire);
						if (typeof(callback) === TYPE_S)
							remap(callback, r);
						else
							callback(r, false, true);
					}
				});
				return;
			}

			ajax(url, data, function(r, err) {
				if (err)
					r = err;
				cacherest(method, uri, data, r, expire);
				if (typeof(callback) === TYPE_S)
					remap(callback, r);
				else
					callback(r, false);
			});
		}, timeout || 1);

		return this;
	}

	return jc.http = {
		defaults,
		ajax,
		ajaxCache,
		ajaxCacheReview,
		configure,
		import2,
		importCache,
		makeParams,
		ping,
		parseQuery,
		upload,
		uptodate
	};

});