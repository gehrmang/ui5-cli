#!/usr/bin/env node

const files = require("./lib/files");
const ui5init = require("./lib/ui5init");
const jsGenerator = require("./lib/jsGenerator");
const viewGenerator = require("./lib/viewGenerator");

const packageName = "de.gt.sap.ui5.base";
const appTitle = "UI5 Base";
const appDescription = "UI5 Base application";

ui5init.createFolders();
ui5init.createComponent(packageName);
ui5init.createManifest(packageName);
ui5init.createIndex(packageName, appTitle);
ui5init.createI18n(appTitle, appDescription);
jsGenerator.generateFile("App", packageName, jsGenerator.types.controller);
viewGenerator.generateView("App", packageName);