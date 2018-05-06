let express = require("express");
let app = express();

app.use(express.static("webapp"));
app.use("/resources", express.static("${openui5}/resources"));
app.use(express.static("./"));
app.use("/dist", express.static("dist"));

let server = app.listen("8080", () => {
    console.log("Listening on localhost:8080");
});