const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

// default options
app.use(fileUpload());

app.post("/upload", function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    console.log(sampleFile);
    console.log(sampleFile.data);
    console.log(sampleFile.data.length);

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv("filename.png", function (err) {
        if (err) return res.status(500).send(err);

        res.send("File uploaded!");
    });
});

app.listen(8000, () => {
    console.log(`Example app listening at http://localhost:8000`);
});
