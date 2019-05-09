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

    COMPONENT('audio', function(self) {

      var can = false;
      var volume = 0.5;

      self.items = [];
      self.readonly();
      self.singleton();

      self.make = function() {
        var audio = document.createElement('audio');
        if (audio.canPlayType && audio.canPlayType('audio/mpeg').replace(/no/, ''))
          can = true;
      };

      self.play = function(url) {

        if (!can)
          return;

        var audio = new window.Audio();

        audio.src = url;
        audio.volume = volume;
        audio.play();

        audio.onended = function() {
          audio.$destroy = true;
          self.cleaner();
        };

        audio.onerror = function() {
          audio.$destroy = true;
          self.cleaner();
        };

        audio.onabort = function() {
          audio.$destroy = true;
          self.cleaner();
        };

        self.items.push(audio);
        return self;
      };

      self.cleaner = function() {
        var index = 0;
        while (true) {
          var item = self.items[index++];
          if (item === undefined)
            return self;
          if (!item.$destroy)
            continue;
          item.pause();
          item.onended = null;
          item.onerror = null;
          item.onsuspend = null;
          item.onabort = null;
          item = null;
          index--;
          self.items.splice(index, 1);
        }
      };

      self.stop = function(url) {

        if (!url) {
          self.items.forEach(function(item) {
            item.$destroy = true;
          });
          return self.cleaner();
        }

        var index = self.items.findIndex('src', url);
        if (index === -1)
          return self;
        self.items[index].$destroy = true;
        return self.cleaner();
      };

      self.setter = function(value) {

        if (value === undefined)
          value = 0.5;
        else
          value = (value / 100);

        if (value > 1)
          value = 1;
        else if (value < 0)
          value = 0;

        volume = value ? +value : 0;
        for (var i = 0, length = self.items.length; i < length; i++) {
          var a = self.items[i];
          if (!a.$destroy)
            a.volume = value;
        }
      };
    });
      COMPILE();
      
     var volume = 50; // 50%
      SETTER(true, 'audio', 'play', 'http://www.tonycuffe.com/mp3/cairnomount.mp3');


    });
});