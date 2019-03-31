define([],function(){
	function initialize() {
		var item = C.init.pop();
		if (item === undefined)
			!C.ready && compile();
		else {
			!item.$removed && prepare(item);
			initialize();
		}
	}

	function ready() {

		langx.setTimeout2('$ready', function() {

			mediaquery();
			components.refresh();
			initialize();

			var count = components.length; // M.components
			$(document).trigger('components', [count]);

			if (!$loaded) {
				$loaded = true;
				caches.clear('valid', 'dirty', 'find');
				topic.emit('init');
				topic('ready');
			}

			langx.setTimeout2('$initcleaner', function() {
				components.cleaner();
				var arr = autofill.splice(0);
				for (var i = 0; i < arr.length; i++) {
					var com = arr[i];
					!com.$default && findcontrol(com.element[0], function(el) {
						var val = $(el).val();
						if (val) {
							var tmp = com.parser(val);
							if (tmp && com.get() !== tmp) {
								com.dirty(false, true);
								com.set(tmp, 0);
							}
						}
						return true;
					});
				}
			}, 1000);

			C.is = false;

			if (C.recompile) {
				C.recompile = false;
				compile();
			}

			if (C.ready) {
				var arr = C.ready;
				for (var i = 0, length = arr.length; i < length; i++)
					arr[i](count);
				C.ready = undefined;
				compile();
				setTimeout(compile, 3000);
				setTimeout(compile, 6000);
				setTimeout(compile, 9000);
			}
		}, 100);
	}
	
});