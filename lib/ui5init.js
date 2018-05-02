const fs = require("fs");
const mkdirp = require("mkdirp");
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

const files = require("./files");
const jsGenerator = require("./jsGenerator");

const manifestTpl = require("../template/manifest.json");

const FOLDERS = ["webapp/controller", "webapp/view", "webapp/i18n"];

const indexPath = `${files.getWebappPath()}/index.html`;
const manifestPath = `${files.getWebappPath()}/manifest.json`;
const i18nPath = `${files.getWebappPath()}/i18n/i18n.properties`;

/**
 * Setup a SAPUI5 base app.
 * 
 * @module
 * @name de.gt.ui5.cli.initializer
 * @author Gerry Gehrmann
 */
module.exports = {

    /**
     * Create all required folders and an empty i18n file.
     * 
     * @memberOf de.gt.ui5.cli.initializer
     */
    createFolders: () => {
        if (files.directoryExists(FOLDERS[0])) {
            console.log("Already a UI5 project folder!");
            return;
        }

        for (let folder of FOLDERS) {
            mkdirp.sync(folder);
        }
    },

    /**
     * Create a component JS file.
     * 
     * @memberOf de.gt.ui5.cli.initialiser
     * @param {string} packageName - The application package name
     */
    createComponent: (packageName) => {
        jsGenerator.generateFile("Component", packageName, jsGenerator.types.component);
    },

    /**
     * Create a manifest JSON file.
     * 
     * @memberOf de.gt.ui5.cli.initialiser.
     * @param {string} packageName - The application package name
     */
    createManifest: (packageName) => {
        manifestTpl["sap.app"].id = packageName;
        manifestTpl["sap.ui5"].rootView.viewName = `${packageName}.view.App`;
        manifestTpl["sap.ui5"].models.i18n.settings.bundleName = `${packageName}.i18n.i18n`;

        fs.writeFileSync(manifestPath, JSON.stringify(manifestTpl, null, 4));
    },

    /**
     * Create the index HTML file.
     * 
     * @memberOf de.gt.ui5.cli.initialiser
     * @param {string} packageName - The application package name
     * @param {string} title - The application title
     */
    createIndex: (packageName, title) => {
        let data = fs.readFileSync(`${__dirname}/../template/index.html.tpl`, "utf8");
        let compiled = compile(data);
        let content = resolveToString(compiled, { packageName: packageName, title: title });

        fs.writeFileSync(indexPath, content);
    },

    /**
     * Create an i18n translation file and fill it with the application title and description.
     * 
     * @memberOf de.gt.ui5.cli.initialiser
     * @param {string} title - The application title
     * @param {string} description - The application description
     */
    createI18n: (title, description) => {
        let content = `appTitle=${title}
appDescription=${description}`

        fs.writeFileSync(i18nPath, content);
    }
}