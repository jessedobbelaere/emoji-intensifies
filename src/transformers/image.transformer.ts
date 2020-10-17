import { UploadedFile } from "express-fileupload";
import gm from "gm";
const fs = require("fs");

// Make sure to have imagmagick (lambda layer) or with brew install imagemagick!
const im = gm.subClass({ imageMagick: true });

export class ImageTransformer {
    public static intensifyImage(image: UploadedFile): Promise<Buffer> {
        const { name, data: buffer } = image;

        console.log("Saving to file");

        // var buf = fs.readFileSync("./examples/f579e4d34eaf81d5.png");
        // console.log(buf, buffer);
        // gm(buffer)
        //     .resize(20, 20)
        //     .noProfile()
        //     .write("./examples/f579e4d34eaf81d5-resized.png", function (err) {
        //         if (err) {
        //             console.error(err);
        //         } else {
        //             console.log("done using buffers");
        //         }
        //     });

        // const img = im(buffer)
        //     .setFormat("png")
        //     .resize(30, 30, "^")
        //     .gravity("Center")
        //     .stream(function (err, stdout, stderr) {
        //         if (err) {
        //             console.log("Error happening", err);
        //         }

        //         var chunks = [];
        //         stdout.on("data", function (chunk) {
        //             chunks.push(chunk);
        //         });
        //         stdout.on("end", function () {
        //             var image = Buffer.concat(chunks);
        //             console.log("END");
        //             console.log(image);
        //         });
        //         stderr.on("data", function (data) {
        //             //console.log(`stderr data:`, data);
        //         });
        //     });

        return Promise.resolve(new Buffer(30));
    }

    public static toBuffer(img: gm.State): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            img.toBuffer("png", (err, buffer) => {
                if (err) return reject(err);

                return resolve(buffer);
            });
        });
    }
}
