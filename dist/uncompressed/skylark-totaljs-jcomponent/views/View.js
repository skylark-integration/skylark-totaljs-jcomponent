define([
	"../langx",
	"./compose",
	"./crawler",
	"./download",
	"./pend"
],function(langx, compose, crawler, download, pend){

	var $rebinder;

	function rebindbinder() {
		$rebinder && clearTimeout($rebinder);
		$rebinder = setTimeout(function() {
			var arr = bindersnew.splice(0);
			for (var i = 0; i < arr.length; i++) {
				var item = arr[i];
				if (!item.init) {
					if (item.com) {
						item.exec(item.com.data(item.path), item.path);
					} else {
						item.exec(getx(item.path), item.path);  // GET
					}
				}
			}
		}, 50);
	}

	var View = Evented.inherit({
	    options : {
	      elmComAttrNames: {
	        base : "data-jc",
	        url : "data-jc-url",
	        removed : "data-jc-removed",
	        released : "data-jc-released",
	        scope : "data-jc-scope"
	      }
	    },

		_construct : function(options) {

			this.is = false;
			this.recompile = false;
			this.importing = 0;
			this.pending = [];
			this.init = [];
			this.imports = {};
			this.ready = [];
		},

		attrcom : function(el) {
			return attrcom(el);
		},

		compile : function (container,immediate) {
			var self = this;

			if (self.is) {
				self.recompile = true;
				return;
			}

			var arr = [];

			if (W.READY instanceof Array)  {
				arr.push.apply(arr, W.READY);
			}
			if (W.jComponent instanceof Array) {
				arr.push.apply(arr, W.jComponent);
			}
			if (W.components instanceof Array) {
				arr.push.apply(arr, W.components);
			}

			if (arr.length) {
				while (true) {
					var fn = arr.shift();
					if (!fn){
						break;
					}
					fn();
				}
			}

			self.is = true;
			download(self);

			if (self.pending.length) {
				(function(container) {
					self.pending.push(function() {
						compile(self,container);
					});
				})(container);
				return;
			}

			var has = false;

			crawler(self,container, compose);

			// perform binder
			rebindbinder();

			if (!has || !self.pending.length) {
				self.is = false;
			}

			if (container !== undefined || !toggles.length) {
				return pend();
			}

			langx.async(toggles, function(item, next) {
				for (var i = 0, length = item.toggle.length; i < length; i++)
					item.element.tclass(item.toggle[i]);
				next();
			}, pend);
		},

		refresh : function () {
			setTimeout2('$refresh', function() {
				all.sort(function(a, b) {  // M.components.sort
					if (a.$removed || !a.path)
						return 1;
					if (b.$removed || !b.path)
						return -1;
					var al = a.path.length;
					var bl = b.path.length;
					return al > bl ? - 1 : al === bl ? LCOMPARER(a.path, b.path) : 1;
				});
			}, 200);
		}

	});

	return View;
});