const fs = require("fs");
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

const files = require("./files");

/**
 * Module to generate a SAPUI5 view.
 * 
 * @module
 * @name de.gt.ui5.cli.view.generator
 * @author Gerry Gehrmann
 */
module.exports = {

    /**
     * Generates a new SAPUI5 view using the given controller name.
     * 
     * @memberOf de.gt.ui5.cli.view.generator
     * @param {string} viewName - The name of the new view
     * @param {string} packageName - The application package name
     */
    generateView: (viewName, packageName) => {
        let data = fs.readFileSync(`${__dirname}/../template/view.xml.tpl`, "utf8");
        let compiled = compile(data);
        let content = resolveToString(compiled, { controller: `${packageName}.controller.${viewName}` });

        let filename = `${files.getViewPath()}/${viewName}.view.xml`;

        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, content);
        } else {
            console.log(`A view with name "${viewName}" already exists.`);
        }
    }
}