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
     { name: "skylark-totaljs-jcomponent", location: "../../src" }
  ],
});
 
var form = {};

// require(["module/name", ...], function(params){ ... });
require([
  "skylark-utils-dom/query",
  "skylark-totaljs-jcomponent/globals"], function ($,globals) {
    $(function() {
      globals();

COMPONENT('contentslider', 'interval:3000;selector:a', function(self, config) {

  var cssv = 'ui-contentslider-item-visible';
  var cssi = 'ui-contentslider-item';
  var cssp = 'ui-contentslider-pagination';
  var css = { 'min-height': 0 };
  var container;
  var length = 0;
  var cacheid;
  var interval;

  self.nocompile && self.nocompile();
  self.readonly();
  self.blind();

  self.make = function() {

    self.aclass('ui-contentslider');
    self.element.wrapInner('<div class="ui-contentslider-items" />');
    self.find(config.selector).wrap('<div class="{0}" />'.format(cssi));
    self.append('<div class="{0}" />'.format(cssp));
    self.refresh();
    container = self.find('.ui-contentslider-items');

    var id = config.cache;
    var indexer = 0;

    if (id) {
      cacheid = 'contentslider' + id;
      indexer = CACHE(cacheid) || 0;
    }

    self.rclass('hidden');
    self.show(indexer++);

    self.event('click', '.fa', function() {
      clearInterval(interval);
      self.show($(this).attrd('index').parseInt());
    });

    interval = setInterval(function() {
      if (!document.hasFocus())
        return;
      self.show(indexer++);
      if (indexer > length)
        indexer = 0;
    }, config.interval);
  };

  self.refresh = function(noredraw) {
    length = self.find('.' + cssi).length;
    var builder = '';
    for (var i = 0; i < length; i++)
      builder += '<i class="fa fa-circle" data-index="{0}"></i>'.format(i);
    noredraw !== true && self.find('.' + cssp).empty().html(builder);
  };

  self.show = function(index) {

    if (index >= length)
      index = 0;
    else if (index < 0)
      index = 0;

    var current = self.find('.' + cssv);
    var next = self.find('.' + cssi).eq(index);
    current.rclass(cssv);
    next.aclass(cssv);
    css['min-height'] = next.height();
    container.css(css);
    self.find('.' + cssp + '-selected').rclass(cssp + '-selected');
    self.find('.' + cssp).find('i').eq(index).aclass(cssp + '-selected');
    cacheid && CACHE(cacheid, index, '1 day');
  };
});
      COMPILE();

    });
});