var properties = require("properties");
let express = require("express");
let app = express();

properties.parse(".ui5", { path: true }, (error, config) => {
    if (error) {
        return console.error(error);
    }

    app.use(express.static("webapp"));
    app.use("/resources", express.static(`${config.openui5}/resources`));
    app.use(express.static("./"));

    let server = app.listen("8080", () => {
        console.log("Listening on localhost:8080");
    });
});