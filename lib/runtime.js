const fs = require("fs-extra");
const path = require("path");
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

const packageJson = require("../template/package.json");

/**
 * Module to create the runtime environment.
 * 
 * @module
 * @name de.gt.ui5.cli.runtime
 * @author Gerry Gehrmann
 */
module.exports = {

    /**
     * Create the package.json using the given application title and description.
     * 
     * @memberOf de.gt.ui5.cli.runtime
     * @param {string} title - The application title
     * @param {string} description - The application description
     */
    createPackage: (title, description) => {
        packageJson.name = title.replace(/ /g, "-");
        packageJson.description = description;

        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 4));
    },

    /**
     * Create the node server.
     * 
     * @memberOf de.gt.ui5.cli.runtime
     */
    createServer: (openui5) => {
        let data = fs.readFileSync(`${__dirname}/../template/server.js.tpl`, "utf8");
        let compiled = compile(data);
        let content = resolveToString(compiled, { openui5: openui5 });

        fs.writeFileSync("server.js", content);
    },

    /**
     * Create the grunt build environment
     * 
     * @memberOf de.gt.ui5.cli.runtime
     */
    createGruntEnvironment: () => {
        fs.writeFileSync(".npmrc", "@sap:registry=https://npm.sap.com");
        fs.copySync(path.resolve(__dirname, "../template/gruntfile.js.tpl"), "gruntfile.js");
    }
}