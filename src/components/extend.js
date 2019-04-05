define([
	"../langx",
	"./extensions"
],function(langx,extensions){
	var topic = langx.topic;
   /**
   * Extend a component by adding new features.
   * @param  {String} name 
   * @param  {String/Object} config A default configuration
   * @param  {Function} declaration 
   */
    function extend(name, config, declaration) { //W.COMPONENT_EXTEND = 

        if (typeof(config) === TYPE_FN) {
            var tmp = declaration;
            declaration = config;
            config = tmp;
        }

        if (extensions[name]) {
            extensions[name].push({ config: config, fn: declaration });
        } else {
            extensions[name] = [{ config: config, fn: declaration }];
        }

        topic.publish("skylark.vvm.component.extend",name);

    };

	return extend;	
})