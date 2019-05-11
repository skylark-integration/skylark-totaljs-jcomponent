require.config({
  baseUrl: "./"
  ,map: {
    '*': {
      'jquery': 'skylark-jquery/core'
  	}
  }
  , shim: {
  }
  ,packages : [
     { name: "skylark-langx", location: "../../node_modules/skylark-langx/dist/uncompressed/skylark-langx" },
     { name: "skylark-utils-dom", location: "../../node_modules/skylark-utils-dom/dist/uncompressed/skylark-utils-dom"},
     { name: "skylark-tangular", location: "../../../skylark-tangular/src"},
     { name: "skylark-totaljs-jcomponent", location: "../../src" }
  ],
});
 
var form = {};

// require(["module/name", ...], function(params){ ... });
require([
  "skylark-utils-dom/query",
  "skylark-tangular",
  "skylark-totaljs-jcomponent/globals"], function ($,Tangular,globals) {
    
    $(function() {
      globals();

COMPONENT('repeater', 'hidden:true;check:true', function(self, config) {

  var filter = null;
  var recompile = false;
  var reg = /\$(index|path)/g;

  self.readonly();

  self.configure = function(key, value) {
    if (key === 'filter')
      filter = value ? GET(value) : null;
  };

  self.make = function() {
    var element = self.find('script');

    if (!element.length) {
      element = self.element;
      self.element = self.element.parent();
    }

    var html = element.html();
    element.remove();
    self.template = Tangular.compile(html);
    recompile = (/data-jc="|data-bind="/).test(html);
  };

  self.setter = function(value) {

    if (!value || !value.length) {
      config.hidden && self.aclass('hidden');
      self.empty();
      self.cache = '';
      return;
    }

    var builder = [];
    for (var i = 0, length = value.length; i < length; i++) {
      var item = value[i];
      item.index = i;
      if (!filter || filter(item)) {
        builder.push(self.template(item).replace(reg, function(text) {
          return text.substring(0, 2) === '$i' ? i.toString() : self.path + '[' + i + ']';
        }));
      }
    }

    var tmp = builder.join('');

    if (config.check) {
      if (tmp === self.cache)
        return;
      self.cache = tmp;
    }

    self.html(tmp);
    config.hidden && self.rclass('hidden');
    recompile && self.compile();
  };
});
      COMPILE();

    });
});