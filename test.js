var fs = require("fs");
var gm = require("gm").subClass({ imageMagick: true });

gm("./examples/f579e4d34eaf81d5.png")
    .resize(20, 20)
    .noProfile()
    .write("./examples/f579e4d34eaf81d5-resized.png", function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log("done");
        }
    });
