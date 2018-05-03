const fs = require("fs-extra");
const path = require("path");

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
        packageJson.name = title;
        packageJson.description = description;

        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 4));
    },

    /**
     * Create the node server.
     * 
     * @memberOf de.gt.ui5.cli.runtime
     */
    createServer: () => {
        fs.copySync(path.resolve(__dirname, '../template/server.js.tpl'), 'server.js');
    }
}