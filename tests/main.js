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
     { name: "skylark-langx", location: "../node_modules/skylark-langx/dist/uncompressed/skylark-langx" },
     { name: "skylark-utils-dom", location: "../node_modules/skylark-utils-dom/dist/uncompressed/skylark-utils-dom"},
     { name: "skylark-totaljs-jcomponent", location: "../src" }
  ],
});
 
var form = {};

// require(["module/name", ...], function(params){ ... });
require([
  "skylark-utils-dom/query",
  "skylark-totaljs-jcomponent/globals"], function ($,globals) {
    $(function() {
      globals();

      COMPONENT('newtask', function(self, config) {
        self.make = function() {
        };

        self.watch(function(path, value) {
          console.log(path, value);
        });
      });
      COMPILE();
    });
});