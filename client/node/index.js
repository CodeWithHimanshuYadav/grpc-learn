const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
const fileUploadController = require("./controllers");

const app = express();

app.use(fileUpload());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/frontend/index.html")));

app.post("/upload", fileUploadController)

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})