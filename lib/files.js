const fs = require('fs');
const path = require('path');

/**
 * Helper module for file handling.
 * 
 * @module
 * @name de.gt.ui5.cli.files
 * @author Gerry Gehrmann
 */
module.exports = {

    /**
     * Check if the given directory exists.
     * 
     * @memberOf de.gt.ui5.cli.files
     * @param {string} filePath - The path to be checked
     * @returns {boolean} True if the directory exists, false otherwise
     */
    directoryExists: (filePath) => {
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    },

    /**
     * Get the project base path.
     * 
     * @memberOf de.gt.ui5.cli.files
     * @returns {string} The project base path
     */
    projectPath: () => {
        return process.cwd();
    },

    /**
     * Get the webapp directory path.
     * 
     * @memberOf de.gt.ui5.cli.files
     * @returns {string} The full path to the webapp directory
     */
    getWebappPath: () => {
        return `${process.cwd()}/webapp`;
    },

    /**
     * Get the view directory path.
     * 
     * @memberOf de.gt.ui5.cli.files
     * @returns {string} The full path to the view directory
     */
    getViewPath: () => {
        return `${process.cwd()}/webapp/view`;
    },

    /**
     * Get the controller directory path.
     * 
     * @memberOf de.gt.ui5.cli.files
     * @returns {string} The full path to the controller directory
     */
    getControllerPath: () => {
        return `${process.cwd()}/webapp/controller`;
    },

    /**
     * Capitalize the first character of the given string.
     * 
     * @memberOf de.gt.ui5.cli.files
     * @param {string} value The string to be capitalized
     * @returns {string} The capitalized string
     */
    capitalize: (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    },

    /**
     * Lowercase the first character of the given string.
     * 
     * @memberOf de.gt.ui5.cli.files
     * @param {string} value The string to be lowercased
     * @returns {string} The lowercased string
     */
    lowercase: (value) => {
        return value.charAt(0).toLowerCase() + value.slice(1);
    }
};