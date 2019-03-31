define([
], function() {
    var types = {},
        instances = [] ,
        extensions = [],
        namespaceInit;
    return {
        /**
         * Adds a new control instance type to the factory.
         *
         * @method add
         * @param {String} type Type name for example "button".
         * @param {function} typeClass Class type function.
         */
        addType: function(type, typeClass) {
            types[type.toLowerCase()] = typeClass;
        },

        /**
         * Returns true/false if the specified type exists or not.
         *
         * @method has
         * @param {String} type Type to look for.
         * @return {Boolean} true/false if the control by name exists.
         */
        hasType: function(type) {
            return !!types[type.toLowerCase()];
        },

        /**
         * Creates a new control instance based on the settings provided. The instance created will be
         * based on the specified type property it can also create whole structures of components out of
         * the specified JSON object.
         *
         * @example
         * tinymce.ui.Factory.create({
         *     type: 'button',
         *     text: 'Hello world!'
         * });
         *
         * @method create
         * @param {Object/String} settings Name/Value object with items used to create the type.
         * @return {tinymce.ui.Control} Control instance based on the specified type.
         */
        createInstance: function(type, settings) {
            var ControlType, name, namespace;

            // Build type lookup
            if (!namespaceInit) {
                namespace = tinymce.ui;

                for (name in namespace) {
                    types[name.toLowerCase()] = namespace[name];
                }

                namespaceInit = true;
            }

            // If string is specified then use it as the type
            if (typeof type == 'string') {
                settings = settings || {};
                settings.type = type;
            } else {
                settings = type;
                type = settings.type;
            }

            // Find control type
            type = type.toLowerCase();
            ControlType = types[type];

            // #if debug

            if (!ControlType) {
                throw new Error("Could not find control by type: " + type);
            }

            // #endif

            ControlType = new ControlType(settings);
            ControlType.type = type; // Set the type on the instance, this will be used by the Selector engine

            return ControlType;
        },

        types : types,
        instances : instances,

        addInstance : function(inst) {
            instances.push(inst);
        },

        allInstances : function() {
            return instances;
        }
    };

});
