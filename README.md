# UI5-CLI

This is a command line interface for OpenUI5 applications.

## Requirements
* NPM
* OpenUI5
* Grunt (optional)

## Installation

1. Download the sources to the desired folder. 
2. run `npm install -g`

## Usage

* Run `ui5 init` and follow the instructions to initialize a new UI5 application.
* Run `ui5 add <name>` to add a new controller and a new view
* Run `ui5 add -c <name>` to add only a new controller
* Run `ui5 add -v <name>` to add only a new view

## Deployment

To make your app deployable to an existing SAP instance, use the generated Grunt file by running `grunt`. Grunt will generate all required additional and precompiles files and write them to the dist directory.

## License
MIT