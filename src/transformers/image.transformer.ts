import gm from "gm";
import { imageSize } from "image-size";
import { MultipartFile } from "../types/multipart-file.type";

// Make sure to have imagmagick (lambda layer) or with brew install imagemagick!
const im = gm.subClass({ imageMagick: true });

export class ImageTransformer {
    public static intensifyImage(image: MultipartFile): Promise<Buffer> {
        const { content: buffer } = image;

        // Detect image size
        const { width, height } = imageSize(buffer);
        console.log(width, height);

        // Add 10% padding to width and height, then scale to 128x128
        const img = im(buffer)
            .gravity("Center")
            .extent(width + width / 10, height + height / 10)
            .geometry(128, 128);

        // const img = im(buffer)
        //     .setFormat("png")
        //     .resize(30, 30, "^")
        //     .gravity("Center")

        //return Promise.resolve(new Buffer(30));
        return this.toBuffer(img);
    }

    public static toBuffer(img: gm.State): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            img.toBuffer("gif", (err, buffer) => {
                if (err) return reject(err);

                return resolve(buffer);
            });
        });
    }
}
