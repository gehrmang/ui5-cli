const fs = require("fs");
const beautify = require("js-beautify");

const files = require("./files");

const TEMPLATES = {
    component: {
        import: "sap/ui/core/UIComponent",
        variable: "UIComponent",
        extensionBase: "",
        content: `
        metadata: {
            manifest: "json"
        },
        
        init: function() {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
        }
        `
    },
    controller: {
        import: "sap/ui/core/mvc/Controller",
        variable: "Controller",
        extensionBase: ".controller",
        content: `
        onInit: () => {
            // Fill with your initialization code
        }`
    }
}

/**
 * Module to generate a SAPUI5 JavaScript file.
 * 
 * @module
 * @name de.gt.ui5.cli.js.generator
 * @author Gerry Gehrmann
 */
module.exports = {

    /**
     * Available file types.
     * 
     * @fieldOf de.gt.ui5.cli.js.generator
     * @type Object
     */
    types: {
        component: "component",
        controller: "controller"
    },

    /**
     * Generate a new JS file of the given type.
     * 
     * @memberOf de.gt.ui5.cli.js.generator
     * @param {string} name - The object name
     * @param {string} packageName - The application package name
     * @param {de.gt.ui5.cli.js.generator.types} type - The file type
     */
    generateFile: (name, packageName, type) => {
        let template = TEMPLATES[type];

        let content = `sap.ui.define([
            "${template.import}"
        ], function(${template.variable}) {
            "use strict"

            return ${template.variable}.extend("${packageName}${template.extensionBase}.${name}", {
                ${template.content}
            });
        });`;

        let filename = _getFileName(name, type);
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, beautify(content, { indent_size: 4 }));
        } else {
            console.log(`A ${type === "component" ? "component" : "controller"} with name "${name}" already exists.`);
        }
    }
}

/**
 * Get the file path for the new file.
 * 
 * @private
 * @param {string} name - The object name
 * @param {de.gt.ui5.cli.js.generator.types} type - The file type
 */
function _getFileName(name, type) {
    if (type === "component") {
        return `${files.getWebappPath()}/${name}.js`;
    } else {
        return `${files.getControllerPath()}/${name}.controller.js`;
    }
}