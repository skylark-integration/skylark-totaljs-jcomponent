define([
	"../langx",
	"./configs"
],function(langx,configs){
   /**
   * Sets a default configuration for all components according to the selector
   * @param  {String} selector 
   * @param  {String/Object} config A default configuration
   */
    function configure(selector, config) { //W.COMPONENT_CONFIG = 

        if (langx.isString(selector)) {
            var fn = [];
            selector.split(' ').forEach(function(sel) {
                var prop = '';
                switch (sel.trim().substring(0, 1)) {
                    case '*':
                        fn.push('com.path.indexOf(\'{0}\')!==-1'.format(sel.substring(1)));
                        return;
                    case '.':
                        // path
                        prop = 'path';
                        break;
                    case '#':
                        // id
                        prop = 'id';
                        break;
                    default:
                        // name
                        prop = '$name';
                        break;
                }
                fn.push('com.{0}==\'{1}\''.format(prop, prop === '$name' ? sel : sel.substring(1)));
            });
            selector = FN('com=>' + fn.join('&&'));
        }

        configs.push({ fn: selector, config: config });
    };  

    return configure;
	
});