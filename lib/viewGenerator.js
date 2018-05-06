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
        let data = fs.readFileSync(`${__dirname}/../template/${viewName === "App" ? "app" : "view"}.xml.tpl`, "utf8");
        let compiled = compile(data);
        let content = resolveToString(compiled, { controller: `${packageName}.controller.${viewName}`, viewName: viewName });

        let filename = `${files.getViewPath()}/${viewName}.view.xml`;

        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, content);
        } else {
            console.log(`A view with name "${viewName}" already exists.`);
        }
    },

    /**
     * Generate the central App view.
     * 
     * @memberOf de.gt.ui5.cli.view.generator
     * @param {string} packageName - The application package name
     * @param {boolean} splitApp - Flag indicating if the app uses split view mode
     * @param {boolean} routingUsed - Flag indicating if the router is used
     */
    generateAppView: (packageName, splitApp, routingUsed) => {
        let viewName = "App";
        let content = "";
        if (splitApp || routingUsed) {
            content = `<mvc:View controllerName="${packageName}.controller.${viewName}" xmlns="sap.m" xmlns:mvc="sap.ui.core.mvc">
    <${splitApp ? "SplitApp" : "App"} id="app" />
</mvc:View>`;
        } else {
            let data = fs.readFileSync(`${__dirname}/../template/app.xml.tpl`, "utf8");
            let compiled = compile(data);
            content = resolveToString(compiled, { controller: `${packageName}.controller.${viewName}`, viewName: viewName });
        }

        let filename = `${files.getViewPath()}/${viewName}.view.xml`;

        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, content);
        } else {
            console.log(`A view with name "${viewName}" already exists.`);
        }
    }
}