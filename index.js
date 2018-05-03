#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const commander = require("commander");
const properties = require("properties");

inquirer.registerPrompt('path', require("inquirer-path").PathPrompt);

const files = require("./lib/files");
const ui5init = require("./lib/ui5init");
const jsGenerator = require("./lib/jsGenerator");
const viewGenerator = require("./lib/viewGenerator");
const runtime = require("./lib/runtime");

// Inquirer questions
const questions = [{
    type: "input",
    name: "appTitle",
    message: "Project title",
    default: capitalize(path.basename(files.projectPath())),
    validate: answer => answer ? true : "Project title is required"
}, {
    type: "input",
    name: "appDescription",
    message: "Project description"
}, {
    type: "input",
    name: "packageName",
    message: "Package name",
    validate: answer => {
        let pattern = new RegExp("^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$");
        return answer && pattern.test(answer) ? true : "Invalid package name";
    }
}, {
    type: "path",
    name: "openui5",
    message: "Path to OpenUI5",
    validate: answer => answer && files.directoryExists(answer) ? true : `The path "${answer} does not exist`
}];

// Setup command line argument parsing
commander
    .command("init")
    .description("Initialize a new app")
    .action((cmd, options) => {
        init();
    });

commander
    .command("add <name>")
    .option("-c, --controller", "Create a new controller")
    .option("-v, --view", "Create a new view")
    .action((name, options) => {
        if (!name) {
            console.log("No name provided");
        }
        generateFile(name, options.controller, options.view);
    });

commander.parse(process.argv);

/**
 * Initialize a new UI5 application.
 */
function init() {
    inquirer.prompt(questions).then(answers => {
        let appTitle = answers.appTitle.trim();
        let appDescription = answers.appDescription ? answers.appDescription.trim() : "";
        let packageName = answers.packageName.trim();
        let openui5 = answers.openui5.trim();

        ui5init.createFolders();
        ui5init.createComponent(packageName);
        ui5init.createManifest(packageName);
        ui5init.createIndex(packageName, appTitle);
        ui5init.createI18n(appTitle, appDescription);
        jsGenerator.generateFile("App", packageName, jsGenerator.types.controller);
        viewGenerator.generateView("App", packageName);

        let config = `packageName=${packageName}
openui5=${openui5}`

        fs.writeFileSync(".ui5", config);

        runtime.createPackage(appTitle, appDescription);
        runtime.createServer();

        console.log(`Application "${appTitle}" initialized.`);
        console.log(`Run npm install && npm start to install and start the app.`);
    });
}

/**
 * Generate a new controller or view.
 * 
 * @param {string} name The name of the controller or view
 * @param {boolean} controller Flag indicating if a controller should be created
 * @param {boolean} view Flag indicating if a view should be created
 */
function generateFile(name, controller, view) {
    properties.parse(`${files.projectPath()}/.ui5`, { path: true }, (error, config) => {
        if (error) {
            console.log(error);
            console.log("Not a UI5 project");
            return;
        }

        let name = capitalize(name);
        if (controller) {
            jsGenerator.generateFile(name, config.packageName, jsGenerator.types.controller);
        }
        if (view) {
            viewGenerator.generateView(name, config.packageName);
        }
    });
}

/**
 * Capitalize the first character of the given string.
 * 
 * @param {string} value The string to be capitalized
 * @returns {string} The capitalized string
 */
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}