define([
	"../langx",
	"../utils/domx",
	"../utils/query",
	"./binding",
	"./componenter",
	"./eventer",
	"./compiler",
	"./helper",
	"./scoper",
	"./storing",
],function(langx, domx, $,binding, componenter, eventer,compiler, helper,scoper,storing){



	// data-scope    
	// data-compile 
	// data-released 
	// data-vendor
	// data-store
	// data-com
	// data-bind
	var View = domx.Plugin.inherit({
	    options : {
	      elmAttrNames: {
	        scope   : "data-scope",             // data-jc-scope
	        bind    : "data-bind",              // data-bind
	        store   : "data-store",
	      	com  : {
		        base     : "data-com",          // data-jc
		        url      : "data-comp-url",     // data-jc-url
		        removed  : "data-com-removed",  //data-jc-removed
		        released : "data-com-released", //data-jc-released
	      	},
	        compile : "data-compile"            // data-jc-comile
	      }
	    },

		_construct : function(elm,options) {
			domx.Plugin.prototype._construct.apply(this,arguments);

			this.helper = helper(this);
			this.eventer = eventer(this);
			this.scoper = scoper(this);
			this.binding = binding(this);
			this.storing = storing(this);
			this.componenter = componenter(this);
			this.compiler = compiler(this);
		},

	   /**
	   * Create new components dynamically.
	   * @param  {String|Array<String>} declaration 
	   * @param  {jQuery Element/Component/Scope/Plugin} element optional,a parent element (default: "document.body")
	   */
		add : function (value, element) { // W.ADD =
			if (element instanceof COM || element instanceof Scope || element instanceof Plugin) {
				element = element.element;
			}
			if (value instanceof Array) {
				for (var i = 0; i < value.length; i++)
					ADD(value[i], element);
			} else {
				$(element || document.body).append('<div data-jc="{0}"></div>'.format(value));
				setTimeout2('ADD', COMPILE, 10);
			}
		},

		compile : function (container,immediate) {

		},

		refresh : function () {
			var self = this;
			setTimeout2('$refresh', function() {
				self.componenter.components.sort(function(a, b) {  // M.components.sort
					if (a.$removed || !a.path)
						return 1;
					if (b.$removed || !b.path)
						return -1;
					var al = a.path.length;
					var bl = b.path.length;
					return al > bl ? - 1 : al === bl ? langx.localCompare(a.path, b.path) : 1;
				});
			}, 200);
		},

		start : function() {
			this.helper.startView();
		},

		end : function() {

		}

	});

	return View;
});