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
    default: files.capitalize(path.basename(files.projectPath())),
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
    type: "list",
    name: "type",
    message: "View type",
    choices: [{ name: "Single view", value: "single" }, { name: "Split view", value: "split" }]
}, {
    type: "confirm",
    name: "routing",
    message: "Use routing",
    when: (answers) => {
        return answers.type === "single";
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
        let appType = answers.type.trim();
        let splitApp = appType === "split";
        let routing = answers.routing || splitApp;

        ui5init.createFolders();
        ui5init.createComponent(packageName, routing);
        ui5init.createManifest(packageName, appType, routing);
        ui5init.createIndex(packageName, appTitle);
        ui5init.createI18n(appTitle, appDescription);
        jsGenerator.generateFile("App", packageName, jsGenerator.types.controller);
        viewGenerator.generateAppView(packageName, splitApp, routing);
        if (routing || splitApp) {
            jsGenerator.generateFile("Master", packageName, jsGenerator.types.controller);
            viewGenerator.generateView("Master", packageName);
        }
        if (splitApp) {
            jsGenerator.generateFile("Detail", packageName, jsGenerator.types.controller);
            viewGenerator.generateView("Detail", packageName);
        }

        runtime.createPackage(appTitle, appDescription);
        runtime.createServer(openui5);
        runtime.createGruntEnvironment();

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
    let manifest = require(`${files.getWebappPath()}/manifest.json`);

    if (!manifest || !manifest["sap.app"].id) {
        console.log(error);
        console.log("Not a UI5 project");
        return;
    }

    let packageName = manifest["sap.app"].id;
    name = files.capitalize(name);

    if (controller) {
        jsGenerator.generateFile(name, packageName, jsGenerator.types.controller);
    }
    if (view) {
        viewGenerator.generateView(name, packageName);
    }
}