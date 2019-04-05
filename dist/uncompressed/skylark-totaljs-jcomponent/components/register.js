define([
	"../langx",
	"./registry"
],function(langx,registry){
    function register(name, config, declaration, dependencies) { // W.COMPONENT =

        if (langx.isFunction(config)) {
            dependencies = declaration;
            declaration = config;
            config = null;
        }

        // Multiple versions
        if (name.indexOf(',') !== -1) {
            name.split(',').forEach(function(item, index) {
                item = item.trim();
                if (item) {
                    add(item, config, declaration, index ? null : dependencies);   
                } 
            });
            return;
        }

        if (registry[name]){ // M.$components
            warn('Components: Overwriting component:', name);   
        } 
        var a = registry[name] = { //M.$components
            name: name, 
            config: config, 
            declaration: declaration, 
            shared: {}, 
            dependencies: dependencies instanceof Array ? dependencies : null 
        };
        //topic.emit('component.compile', name, a); //TODO
    }

    return register;
	
})